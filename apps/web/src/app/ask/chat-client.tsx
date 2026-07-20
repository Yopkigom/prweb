"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHAT_ENDPOINT = "https://prweb-chat.yopkigom.workers.dev/api/chat";
const TURNSTILE_SITEKEY = "0x4AAAAAAD5VH5MXe3EnvQct";
const TURNSTILE_SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit";

const SUGGESTED_QUESTIONS = [
  "아바타 순차 생성 프로젝트를 소개해주세요",
  "팀장으로서 어떤 성과를 냈나요?",
  "어떤 기술 스택에 강점이 있나요?",
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

interface UiMessage {
  role: "user" | "assistant";
  content: string;
}

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

      try {
        const response = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, turnstileToken: token }),
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
        let answer = "";

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
        console.error(sendError);
        setMessages(history);
        setError(
          sendError instanceof Error && sendError.message.length > 0
            ? `답변을 가져오지 못했습니다: ${sendError.message}`
            : "답변을 가져오지 못했습니다. 잠시 후 다시 시도해주세요."
        );
      } finally {
        setIsLoading(false);
        if (window.turnstile !== undefined && widgetIdRef.current !== null) {
          window.turnstile.reset(widgetIdRef.current);
        }
      }
    },
    [isLoading, messages]
  );

  return (
    <div className="flex h-[70vh] flex-col rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-3 pt-8 text-center">
            <p className="text-sm text-zinc-500">
              경력·프로젝트·기술 스택에 대해 무엇이든 물어보세요.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void send(question)}
                  disabled={isLoading}
                  className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
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
                  ? "max-w-[80%] rounded-2xl rounded-br-sm bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-2 text-sm dark:bg-zinc-900"
              }
            >
              {message.content.length > 0 ? message.content : "…"}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error !== null && (
        <p className="border-t border-zinc-200 px-4 py-2 text-xs text-red-600 dark:border-zinc-800 dark:text-red-400">
          {error}
        </p>
      )}

      <form
        className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"
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
          className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
        <button
          type="submit"
          disabled={isLoading || input.trim().length === 0}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isLoading ? "생성 중…" : "보내기"}
        </button>
      </form>

      <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 dark:border-zinc-800">
        <p className="text-xs text-zinc-400">
          AI가 생성한 답변으로, 부정확할 수 있습니다.
          {!isVerified && " · 봇 방지 확인 중…"}
        </p>
        <div ref={turnstileSlotRef} />
      </div>
    </div>
  );
}
