import type { Metadata } from "next";
import Link from "next/link";
import { BUTTON_SECONDARY_CLASS } from "../../components/resume-layout";
import ChatClient from "./chat-client";

export const metadata: Metadata = {
  title: "Ask AI",
};

export default function AskPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Ask AI</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            신호정의 경력과 프로젝트를 학습한 AI 어시스턴트입니다. Cloudflare Workers AI와 NVIDIA
            API 위에서 동작합니다.
          </p>
        </div>
        <Link href="/projects/ask-ai-behind-the-scenes/" className={BUTTON_SECONDARY_CLASS}>
          이 챗봇은 어떻게 만들어졌나
        </Link>
      </header>
      <ChatClient />
    </div>
  );
}
