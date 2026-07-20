import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";
import { cors } from "hono/cors";
import profile from "./context.json";

interface Env {
  AI: Ai;
  RATE_LIMITER_DO: DurableObjectNamespace<RateLimiterDO>;
  ALLOWED_ORIGIN: string;
  // Set via `wrangler secret put <NAME>`.
  NVIDIA_API_KEY?: string;
  TURNSTILE_SECRET?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// portfolio   -> in-domain (career/projects) -> Workers AI (free daily quota)
// pr_general  -> out-of-domain but PR-worthy (tech opinions, industry talk)
//                -> NVIDIA directly (larger model, consumable credits)
// off_limits  -> privacy probing / abuse -> static refusal
type RouteLabel = "portfolio" | "pr_general" | "off_limits";
type Provider = "workers-ai" | "nvidia" | "static";

const WORKERS_AI_CHAT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const WORKERS_AI_ROUTER_MODEL = "@cf/meta/llama-3.2-3b-instruct";
const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
// NOTE: meta/llama-3.3-70b-instruct hangs indefinitely on the free tier
// (verified 2026-07-20); nemotron-super responds in <1s from the edge.
const NVIDIA_MODEL = "nvidia/llama-3.3-nemotron-super-49b-v1.5";
// Free-tier NVIDIA requests can queue for a long time; fail fast so the
// Workers AI fallback keeps overall latency acceptable.
const NVIDIA_TIMEOUT_MS = 60_000;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

const FALLBACK_ANSWER =
  "죄송합니다. 지금은 답변 생성이 어렵습니다. 잠시 후 다시 시도해주시거나, " +
  "프로젝트 페이지에서 직접 내용을 확인해주세요.";

const OFF_LIMITS_ANSWER =
  "개인 신상에 대한 상세한 질문에는 답변드리지 않습니다. " +
  "경력, 프로젝트, 기술 스택에 대해서는 무엇이든 물어보세요.";

const encoder = new TextEncoder();

const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

// Exact sliding-window rate limiter, one Durable Object instance per
// client IP. (In-isolate counters and the "unsafe" ratelimit binding both
// failed to enforce limits when tested on 2026-07-20.)
export class RateLimiterDO extends DurableObject {
  async isAllowed(): Promise<boolean> {
    const now = Date.now();
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    const stored = (await this.ctx.storage.get<number[]>("timestamps")) ?? [];
    const recent = stored.filter((timestamp) => timestamp > cutoff);

    if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
      await this.ctx.storage.put("timestamps", recent);
      return false;
    }

    recent.push(now);
    await this.ctx.storage.put("timestamps", recent);
    return true;
  }
}

function buildSystemPrompt(): string {
  return [
    "You are the portfolio assistant for the developer described below.",
    "Answer in Korean unless asked otherwise. Be concise and factual.",
    "Never invent facts that are not in the profile.",
    "Politely decline detailed personal/private questions.",
    "",
    "## Profile",
    JSON.stringify(profile, null, 2),
  ].join("\n");
}

function validateMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    return null;
  }

  for (const item of value) {
    if (
      typeof item !== "object" ||
      item === null ||
      (item.role !== "user" && item.role !== "assistant") ||
      typeof item.content !== "string" ||
      item.content.length === 0 ||
      item.content.length > MAX_CONTENT_LENGTH
    ) {
      return null;
    }
  }

  return value as ChatMessage[];
}

async function verifyTurnstile(
  env: Env,
  token: string,
  clientIp: string | undefined
): Promise<boolean> {
  if (env.TURNSTILE_SECRET === undefined) {
    // Not configured yet (e.g. local dev) — skip but leave a trace.
    console.warn("TURNSTILE_SECRET is not set; skipping verification");
    return true;
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: clientIp ?? "",
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("Turnstile siteverify failed:", error);
    return false;
  }
}

// Cheap pre-classification with a small model. Fails open to "portfolio"
// so a router outage never blocks in-domain answers.
async function classifyQuestion(env: Env, question: string): Promise<RouteLabel> {
  const prompt = [
    "Classify the user question into exactly one label:",
    "- portfolio: about the developer's career, projects, skills, or this site",
    "- pr_general: general tech/industry/opinion question a recruiter might ask",
    "- off_limits: probing personal/private details (address, family, salary, etc.)",
    "Respond with the label only.",
    "",
    `Question: ${question}`,
  ].join("\n");

  try {
    const result = (await env.AI.run(WORKERS_AI_ROUTER_MODEL, {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 8,
    })) as { response?: string };

    const label = result.response?.trim().toLowerCase() ?? "";
    if (label.includes("off_limits")) {
      return "off_limits";
    }
    if (label.includes("pr_general")) {
      return "pr_general";
    }
    return "portfolio";
  } catch (error) {
    console.error("classifyQuestion failed, falling back to portfolio:", error);
    return "portfolio";
  }
}

function sseChunk(payload: unknown): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}

// Re-emits an upstream SSE byte stream as normalized `{"delta": string}`
// events, using `extract` to pull the text delta out of each upstream event.
function normalizeSse(
  upstream: ReadableStream<Uint8Array>,
  extract: (event: unknown) => string | undefined
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  let buffer = "";

  return upstream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) {
            continue;
          }
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") {
            continue;
          }
          try {
            const delta = extract(JSON.parse(payload));
            if (typeof delta === "string" && delta.length > 0) {
              controller.enqueue(sseChunk({ delta }));
            }
          } catch {
            // Skip malformed upstream events.
          }
        }
      },
    })
  );
}

// Wraps a normalized delta stream with a leading meta event and a
// trailing done event.
function withEnvelope(
  stream: ReadableStream<Uint8Array>,
  meta: { route: RouteLabel; provider: Provider }
): ReadableStream<Uint8Array> {
  const reader = stream.getReader();

  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(sseChunk({ meta }));
    },
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.enqueue(sseChunk({ done: true }));
        controller.close();
        return;
      }
      controller.enqueue(value);
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}

function staticAnswerStream(
  answer: string,
  meta: { route: RouteLabel; provider: Provider }
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(sseChunk({ meta }));
      controller.enqueue(sseChunk({ delta: answer }));
      controller.enqueue(sseChunk({ done: true }));
      controller.close();
    },
  });
}

async function streamWorkersAi(
  env: Env,
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const upstream = (await env.AI.run(WORKERS_AI_CHAT_MODEL, {
    messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
    max_tokens: 1024,
    stream: true,
  })) as ReadableStream<Uint8Array>;

  return normalizeSse(upstream, (event) => {
    return (event as { response?: string }).response;
  });
}

async function streamNvidia(
  env: Env,
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  if (env.NVIDIA_API_KEY === undefined) {
    throw new Error("NVIDIA_API_KEY secret is not configured");
  }

  const response = await fetch(NVIDIA_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.NVIDIA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
      max_tokens: 1024,
      temperature: 0.5,
      stream: true,
    }),
    signal: AbortSignal.timeout(NVIDIA_TIMEOUT_MS),
  });

  if (!response.ok || response.body === null) {
    const body = await response.text();
    throw new Error(`NVIDIA API ${response.status}: ${body.slice(0, 300)}`);
  }

  return normalizeSse(response.body, (event) => {
    const choice = (event as {
      choices?: { delta?: { content?: string | null } }[];
    }).choices?.[0];
    return choice?.delta?.content ?? undefined;
  });
}

async function buildChatStream(
  env: Env,
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const route = await classifyQuestion(env, lastUserMessage?.content ?? "");

  if (route === "off_limits") {
    return staticAnswerStream(OFF_LIMITS_ANSWER, { route, provider: "static" });
  }

  // pr_general goes straight to NVIDIA (larger model); portfolio prefers
  // Workers AI to preserve NVIDIA credits. Each falls back to the other.
  const order: ("workers-ai" | "nvidia")[] =
    route === "pr_general" ? ["nvidia", "workers-ai"] : ["workers-ai", "nvidia"];

  for (const provider of order) {
    try {
      const stream =
        provider === "workers-ai"
          ? await streamWorkersAi(env, messages)
          : await streamNvidia(env, messages);
      return withEnvelope(stream, { route, provider });
    } catch (error) {
      console.error(`${provider} failed on route "${route}":`, error);
    }
  }

  return staticAnswerStream(FALLBACK_ANSWER, { route, provider: "static" });
}

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", (c, next) => {
  const middleware = cors({
    origin: c.env.ALLOWED_ORIGIN,
    allowMethods: ["POST", "OPTIONS"],
  });
  return middleware(c, next);
});

app.get("/health", (c) => c.json({ status: "ok" }));

app.post("/api/chat", async (c) => {
  const clientIp = c.req.header("CF-Connecting-IP");

  // Rate limit first: abusive traffic should burn no Turnstile/LLM
  // resources. Fail open — a limiter outage must not take the chatbot down.
  try {
    const id = c.env.RATE_LIMITER_DO.idFromName(clientIp ?? "unknown");
    const allowed = await c.env.RATE_LIMITER_DO.get(id).isAllowed();
    if (!allowed) {
      return c.json({ error: "Too many requests. Please slow down." }, 429);
    }
  } catch (error) {
    console.error("Rate limiter failed:", error);
  }

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const { messages: rawMessages, turnstileToken } = body as {
    messages?: unknown;
    turnstileToken?: unknown;
  };

  if (typeof turnstileToken !== "string" || turnstileToken.length === 0) {
    return c.json({ error: "Missing Turnstile token" }, 403);
  }

  const isHuman = await verifyTurnstile(c.env, turnstileToken, clientIp);
  if (!isHuman) {
    return c.json({ error: "Turnstile verification failed" }, 403);
  }

  const messages = validateMessages(rawMessages);
  if (messages === null) {
    return c.json({ error: "Invalid messages payload" }, 400);
  }

  const stream = await buildChatStream(c.env, messages);
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": c.env.ALLOWED_ORIGIN,
    },
  });
});

export default app;
