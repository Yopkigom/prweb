import Link from "next/link";
import { getFeaturedProjects } from "../lib/projects";

// Demo videos shown under Featured Projects. Embed via youtube-nocookie
// (see docs/MAINTENANCE.md). Keep captions in sync with projects.json.
const DEMO_VIDEOS = [
  {
    id: "E51utCQPQYk",
    title: "챗봇 애플리케이션 구현을 통한 온디바이스 환경의 이해",
    caption:
      "llama.cpp를 Unity에 직접 통합한 문서 질의응답(RAG) 앱. Galaxy S25 실기기 구동",
    projectSlug: "unity-ondevice-rag",
  },
  {
    id: "OvK0o6xK6CE",
    title: "감성 분석 모델의 쇼핑몰 리뷰 분석 모바일 앱 구동",
    caption:
      "감성 분류 모델을 ONNX로 변환해 Unity Sentis로 Android에서 서빙",
    projectSlug: undefined,
  },
] as const;

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <div className="space-y-16">
      {/* L1: one-line positioning, readable in 10 seconds */}
      <section className="space-y-4 pt-8">
        <p className="text-sm font-medium text-zinc-500">
          신호정 · Unity 실시간 클라이언트 16년, AI 제품 개발 리드
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          실시간 클라이언트를 16년 만들었고,
          <br />
          이제 AI를 그 안에서 돌아가게 만듭니다
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          소셜 아바타 앱 개발팀장 3년 4개월(누적 다운로드 30만, 평점 4.7).
          llama.cpp · ONNX · Unity Sentis로 이어지는 온디바이스 AI와, 두 팀을
          동시에 이끌어 고용노동부장관상을 받은 AI 제품 테크리드 경험.
        </p>
        <div className="flex gap-3 pt-2">
          <Link
            href="/projects/"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 transition-colors"
          >
            프로젝트 보기
          </Link>
          <Link
            href="/about/"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900 transition-colors"
          >
            경력 · 특허 · 수상
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
              <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
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

      {/* On-device demo videos: real devices, not slides */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">시연 영상</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {DEMO_VIDEOS.map((video) => (
            <figure key={video.id} className="space-y-3">
              <div className="aspect-video overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <figcaption className="space-y-1">
                <h3 className="font-semibold">{video.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {video.caption}
                  {video.projectSlug !== undefined && (
                    <>
                      {" · "}
                      <Link
                        href={`/projects/${video.projectSlug}/`}
                        className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100"
                      >
                        프로젝트 상세 보기
                      </Link>
                    </>
                  )}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
