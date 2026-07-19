import Link from "next/link";
import { getFeaturedProjects } from "../lib/projects";

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <div className="space-y-16">
      {/* L1: one-line positioning, readable in 10 seconds */}
      <section className="space-y-4 pt-8">
        <p className="text-sm font-medium text-zinc-500">
          저는 신호정입니다. 그리고 프로그래머입니다.
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          15년 실서비스 경험으로
          <br />
          On-Device AI를 만듭니다
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Unity 멀티플랫폼 개발 15년, 팀 리딩 경험, 그리고 ExecuTorch ·
          llama.cpp · Unity Sentis · TensorFlow Lite로 이어지는 엣지 AI
          엔지니어링.
        </p>
        <div className="flex gap-3 pt-2">
          <Link
            href="/projects/"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-colors"
          >
            프로젝트 보기
          </Link>
          <Link
            href="/ask/"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900 transition-colors"
          >
            Ask AI에게 질문하기
          </Link>
        </div>
      </section>

      {/* L1: featured project cards */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Featured Projects
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}/`}
              className="group rounded-xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <h3 className="font-semibold group-hover:underline">
                {project.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                {project.hook}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
