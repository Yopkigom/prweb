import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask AI",
};

export default function AskPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Ask AI</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        {/* TODO(Phase 4): chat UI — streaming client hitting the
            prweb-chat Worker (Workers AI primary, NVIDIA fallback) */}
        경력과 프로젝트에 대해 무엇이든 물어보세요. (챗봇 준비 중)
      </p>
    </div>
  );
}
