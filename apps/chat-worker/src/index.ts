import { Hono } from "hono";
import { cors } from "hono/cors";
import profile from "./context.json";

interface Env {
  AI: Ai;
  ALLOWED_ORIGIN: string;
  // Set via `wrangler secret put NVIDIA_API_KEY`.
  NVIDIA_API_KEY?: string;
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

interface ChatResult {
  answer: string;
  route: RouteLabel;
  provider: "workers-ai" | "nvidia" | "static";
}

const WORKERS_AI_CHAT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const WORKERS_AI_ROUTER_MODEL = "@cf/meta/llama-3.2-3b-instruct";
const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_MODEL = "meta/llama-3.3-70b-instruct";

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

const FALLBACK_ANSWER =
  "죄송합니다. 지금은 답변 생성이 어렵습니다. 잠시 후 다시 시도해주시거나, " +
  "프로젝트 페이지에서 직접 내용을 확인해주세요.";

const OFF_LIMITS_ANSWER =
  "개인 신상에 대한 상세한 질문에는 답변드리지 않습니다. " +
  "경력, 프로젝트, 기술 스택에 대해서는 무엇이든 물어보세요.";

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

async function askWorkersAi(env: Env, messages: ChatMessage[]): Promise<string> {
  const result = (await env.AI.run(WORKERS_AI_CHAT_MODEL, {
    messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
    max_tokens: 1024,
  })) as { response?: string };

  if (typeof result.response !== "string" || result.response.length === 0) {
    throw new Error("Workers AI returned an empty response");
  }

  return result.response;
}

async function askNvidia(env: Env, messages: ChatMessage[]): Promise<string> {
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
    }),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA API responded with ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const answer = data.choices?.[0]?.message?.content;

  if (typeof answer !== "string" || answer.length === 0) {
    throw new Error("NVIDIA API returned an empty response");
  }

  return answer;
}

async function generateAnswer(env: Env, messages: ChatMessage[]): Promise<ChatResult> {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const route = await classifyQuestion(env, lastUserMessage?.content ?? "");

  if (route === "off_limits") {
    return { answer: OFF_LIMITS_ANSWER, route, provider: "static" };
  }

  // pr_general goes straight to NVIDIA (larger model); portfolio prefers
  // Workers AI to preserve NVIDIA credits. Each falls back to the other.
  const order: ("workers-ai" | "nvidia")[] =
    route === "pr_general" ? ["nvidia", "workers-ai"] : ["workers-ai", "nvidia"];

  for (const provider of order) {
    try {
      const answer =
        provider === "workers-ai"
          ? await askWorkersAi(env, messages)
          : await askNvidia(env, messages);
      return { answer, route, provider };
    } catch (error) {
      console.error(`${provider} failed on route "${route}":`, error);
    }
  }

  return { answer: FALLBACK_ANSWER, route, provider: "static" };
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

// TODO(Phase 4): Turnstile verification + per-IP rate limiting before this
// handler, and SSE streaming instead of a single JSON response.
app.post("/api/chat", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const messages = validateMessages((body as { messages?: unknown }).messages);
  if (messages === null) {
    return c.json({ error: "Invalid messages payload" }, 400);
  }

  const result = await generateAnswer(c.env, messages);
  return c.json(result);
});

export default app;
