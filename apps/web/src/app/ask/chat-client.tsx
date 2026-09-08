"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const CHAT_ENDPOINT = "https://prweb-chat.yopkigom.workers.dev/api/chat";
const TURNSTILE_SITEKEY = "0x4AAAAAAD5VH5MXe3EnvQct";
const TURNSTILE_SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit";

const STARTER_QUESTIONS = [
  "아바타 순차 생성 프로젝트를 소개해주세요",
  "팀장으로서 어떤 성과를 냈나요?",
  "어떤 기술 스택에 강점이 있나요?",
] as const;

// Shown as follow-ups once the starters above have been asked.
const FOLLOW_UP_POOL = [
  "Agora 더블 버퍼링 구조는 어떻게 동작하나요?",
  "이 Ask AI 챗봇은 어떻게 만들어졌나요?",
  "AI 도구를 실무에 어떻게 활용하시나요?",
  "코딩 스타일이나 컨벤션에 대해 알려주세요",
  "On-Device AI로 전환하는 이유가 궁금해요",
] as const;

interface TurnstileApi {
  render(
    element: HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    }
  ): string;
  reset(widgetId?: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onTurnstileLoad?: () => void;
  }
}

const CHIP_CLASS =
  "rounded-full border border-brand/40 px-3 py-1.5 text-xs text-brand hover:bg-cream disabled:opacity-50";

interface UiMessage {
  role: "user" | "assistant";
  content: string;
  stopped?: boolean;
}

const markdownComponents: Components = {
  p: (props) => <p className="mb-2 last:mb-0" {...props} />,
  ul: (props) => <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0" {...props} />,
  ol: (props) => <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0" {...props} />,
  a: (props) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2"
    />
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes("language-") ?? false;
    if (isBlock) {
      return (
        <code
          className="my-2 block overflow-x-auto rounded-lg bg-zinc-200 p-3 text-xs"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs" {...props}>
        {children}
      </code>
    );
  },
};

export default function ChatClient() {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const tokenRef = useRef<string | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const turnstileSlotRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const renderWidget = () => {
      if (
        window.turnstile === undefined ||
        turnstileSlotRef.current === null ||
        widgetIdRef.current !== null
      ) {
        return;
      }
      widgetIdRef.current = window.turnstile.render(turnstileSlotRef.current, {
        sitekey: TURNSTILE_SITEKEY,
        action: "turnstile-spin-v2",
        callback: (token) => {
          tokenRef.current = token;
          setIsVerified(true);
        },
        "expired-callback": () => {
          tokenRef.current = null;
          setIsVerified(false);
          if (window.turnstile !== undefined && widgetIdRef.current !== null) {
            window.turnstile.reset(widgetIdRef.current);
          }
        },
        "error-callback": () => {
          tokenRef.current = null;
          setIsVerified(false);
        },
      });
    };

    if (window.turnstile !== undefined) {
      renderWidget();
      return;
    }

    window.onTurnstileLoad = renderWidget;
    if (document.querySelector(`script[src^="${TURNSTILE_SCRIPT}"]`) === null) {
      const script = document.createElement("script");
      script.src = TURNSTILE_SCRIPT;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const send = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (trimmed.length === 0 || isLoading) {
        return;
      }

      const token = tokenRef.current;
      if (token === null) {
        setError("봇 방지 확인이 아직 완료되지 않았습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      setError(null);
      setInput("");
      setIsLoading(true);

      const history: UiMessage[] = [...messages, { role: "user", content: trimmed }];
      setMessages([...history, { role: "assistant", content: "" }]);

      // Each Turnstile token is single-use: consume it, then reset the
      // widget so the next message gets a fresh token.
      tokenRef.current = null;
      setIsVerified(false);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      let answer = "";
      let wasAborted = false;

      try {
        const response = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, turnstileToken: token }),
          signal: controller.signal,
        });

        if (!response.ok || response.body === null) {
          const detail = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(detail?.error ?? `HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("data:")) {
              continue;
            }
            try {
              const event = JSON.parse(trimmedLine.slice(5).trim()) as {
                delta?: string;
              };
              if (typeof event.delta === "string") {
                answer += event.delta;
                setMessages([...history, { role: "assistant", content: answer }]);
              }
            } catch {
              // Skip malformed events.
            }
          }
        }

        if (answer.length === 0) {
          throw new Error("빈 응답을 받았습니다");
        }
      } catch (sendError) {
        if (sendError instanceof DOMException && sendError.name === "AbortError") {
          wasAborted = true;
        } else {
          console.error(sendError);
          setMessages(history);
          setError(
            sendError instanceof Error && sendError.message.length > 0
              ? `답변을 가져오지 못했습니다: ${sendError.message}`
              : "답변을 가져오지 못했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      } finally {
        if (wasAborted && answer.length > 0) {
          setMessages([...history, { role: "assistant", content: answer, stopped: true }]);
        }
        abortControllerRef.current = null;
        setIsLoading(false);
        if (window.turnstile !== undefined && widgetIdRef.current !== null) {
          window.turnstile.reset(widgetIdRef.current);
        }
      }
    },
    [isLoading, messages]
  );

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const askedQuestions = new Set(
    messages.filter((m) => m.role === "user").map((m) => m.content)
  );
  const remainingStarters = STARTER_QUESTIONS.filter((q) => !askedQuestions.has(q));
  const remainingFollowUps = FOLLOW_UP_POOL.filter((q) => !askedQuestions.has(q)).slice(0, 3);

  const showFollowUps =
    !isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "assistant";

  return (
    <div className="flex h-[min(70dvh,720px)] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      {/* Band-style header, matching the resume sheets used across the site. */}
      <div className="flex items-baseline justify-between gap-3 bg-brand px-4 py-3 text-white">
        <span className="font-serif text-lg font-bold italic underline decoration-1 underline-offset-4">
          Ask AI
        </span>
        <span className="text-xs opacity-85">경력 · 프로젝트 · 기술 스택</span>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-3 pt-8 text-center">
            <p className="text-sm text-zinc-500">
              경력·프로젝트·기술 스택에 대해 무엇이든 물어보세요.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {remainingStarters.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void send(question)}
                  disabled={isLoading}
                  className={CHIP_CLASS}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                message.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-4 py-2 text-sm text-white"
                  : "max-w-[80%] rounded-2xl rounded-bl-sm bg-cream px-4 py-2 text-sm"
              }
            >
              {message.role === "assistant" ? (
                message.content.length > 0 ? (
                  <>
                    <ReactMarkdown components={markdownComponents}>
                      {message.content}
                    </ReactMarkdown>
                    {message.stopped === true && (
                      <p className="mt-1 text-xs text-zinc-400">(응답 중단됨)</p>
                    )}
                  </>
                ) : (
                  "…"
                )
              ) : (
                <span className="whitespace-pre-wrap">{message.content}</span>
              )}
            </div>
          </div>
        ))}

        {showFollowUps && remainingFollowUps.length > 0 && (
          <div className="flex flex-wrap justify-start gap-2 pl-1">
            {remainingFollowUps.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => void send(question)}
                className={CHIP_CLASS}
              >
                {question}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error !== null && (
        <p className="border-t border-zinc-200 px-4 py-2 text-xs text-red-600">
          {error}
        </p>
      )}

      <form
        className="flex items-center gap-2 border-t border-zinc-200 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          void send(input);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="질문을 입력하세요…"
          maxLength={2000}
          className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand"
        />
        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className="rounded-lg border border-brand/50 px-4 py-2 text-sm font-medium text-brand hover:bg-cream"
          >
            중단
          </button>
        ) : (
          <button
            type="submit"
            disabled={input.trim().length === 0}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50 disabled:hover:bg-brand"
          >
            보내기
          </button>
        )}
      </form>

      <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2">
        <p className="text-xs text-zinc-500">
          AI가 생성한 답변으로, 부정확할 수 있습니다.
          {!isVerified && " · 봇 방지 확인 중…"}
        </p>
        <div ref={turnstileSlotRef} />
      </div>
    </div>
  );
}
