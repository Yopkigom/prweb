import type { Metadata } from "next";
import ChatClient from "./chat-client";

export const metadata: Metadata = {
  title: "Ask AI",
};

export default function AskPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ask AI</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          신호정의 경력과 프로젝트를 학습한 AI 어시스턴트입니다. Cloudflare
          Workers AI와 NVIDIA API 위에서 동작합니다.
        </p>
      </header>
      <ChatClient />
    </div>
  );
}
