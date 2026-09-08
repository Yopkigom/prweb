import Image from "next/image";
import Link from "next/link";
import { getFeaturedProjects } from "../lib/projects";
import {
  CREAM_FRAME_CLASS,
  SERIF_HEADING_CLASS,
  SHEET_CLASS,
  SHEET_HEAD_CLASS,
  SHEET_SUBTITLE_CLASS,
  SHEET_TITLE_CLASS,
} from "../components/resume-layout";

// Home = one blue sheet: headline → name · role → Applying For → Introduction →
// buttons → Showcase → featured projects (one grouped box). Mirrors the resume
// poster/showcase pages; the numeric Overview lives on About.

// Demo videos shown in Showcase. Embed via youtube-nocookie
// (see docs/MAINTENANCE.md). Keep captions in sync with projects.json.
const DEMO_VIDEOS = [
  {
    id: "E51utCQPQYk",
    title: "Unity 온디바이스 RAG 앱",
    meta: "개인 | 2026",
    caption: "llama.cpp를 Unity에 직접 통합해 Galaxy S25 실기기에서 연말정산 문서 질의응답을 구동하는 시연",
    projectSlug: "unity-ondevice-rag",
  },
  {
    id: "OvK0o6xK6CE",
    title: "온디바이스 쇼핑몰 리뷰 감성 분석",
    meta: "개인 | 2026",
    caption: "쇼핑몰 리뷰로 학습한 한국어 감성 분류 모델을 ONNX로 변환해 Unity Sentis로 Android 앱에서 구동하는 시연",
    projectSlug: "ondevice-sentiment-analysis",
  },
] as const;

const SHOWCASE_REPO = {
  href: "https://github.com/Codeit-AI10-Part4-3Team/AI10-Part4-3Team-Advanced-Project",
  title: "브랜드 스타일 광고 소재 생성 서비스",
  meta: "테크리드, AI 생성/서빙 | 4인 | 2026.08",
  caption: "제품 사진, 제품명, 소구점으로 인스타그램용 만화형 6칸 광고 소재를 만드는 서비스. 1번 칸을 레퍼런스로 나머지 5칸을 병렬 생성해 3x2로 합성",
  display: "github.com/Codeit-AI10-Part4-3Team/AI10-Part4-3Team-Advanced-Project",
  projectSlug: "ad-creative-generation",
} as const;

const POSTER_BUTTON_CLASS =
  "rounded-lg border border-white/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-brand";
const POSTER_BUTTON_FILL_CLASS =
  "rounded-lg bg-cream px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white";

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <div className={SHEET_CLASS}>
      {/* ---------- headline (resume page 1) ---------- */}
      <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        Unity 16년, 멀티플랫폼 AI를 주도합니다.
      </h1>
      <p className="mt-3 text-xl font-bold sm:text-2xl">
        신호정
        <span className="mx-3 font-normal opacity-60">|</span>
        AI 제품 개발 리드
      </p>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-5">
        <div className={`${SERIF_HEADING_CLASS} shrink-0`}>Applying For :</div>
        <p className="text-base font-bold leading-relaxed sm:text-lg">
          AI 제품 개발 리드 / 테크리드
          <span className="ml-2 font-normal opacity-90">(온디바이스 AI 클라이언트, 게임 AI 포함)</span>
        </p>
      </div>

      <div className="mt-6">
        <h2 className={`${SERIF_HEADING_CLASS} mb-2`}>Introduction</h2>
        <p className="max-w-3xl text-base leading-relaxed">
          <b>실시간 클라이언트를 16년 만들어 온 개발자</b>입니다.{" "}
          <b>지금은 AI 모델을 제품 안에서 돌아가게 만드는 일</b>을 합니다. 소셜 아바타 앱 개발팀을
          3년 4개월 이끌었고, 2026년 8월에는 두 팀 프로젝트를 동시에 테크리드로 맡아 둘 다
          제출했습니다.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/projects/" className={POSTER_BUTTON_FILL_CLASS}>
          프로젝트 보기
        </Link>
        <Link href="/about/" className={POSTER_BUTTON_CLASS}>
          경력 · 특허 · 수상
        </Link>
        <Link href="/ask/" className={POSTER_BUTTON_CLASS}>
          Ask AI에게 질문하기
        </Link>
      </div>

      {/* ---------- Showcase, real devices not slides (resume page 3) ---------- */}
      <section className="mt-12">
        <div className={`${SHEET_HEAD_CLASS} mb-8`}>
          <h2 className={SHEET_TITLE_CLASS}>
            Showcase
            <span className={SHEET_SUBTITLE_CLASS}>시연 영상과 저장소</span>
          </h2>
          <p className="text-sm leading-relaxed sm:text-right">
            <b>시연 영상과 저장소.</b>
            <br />
            영상은 바로 재생되고, 이미지를 누르면 GitHub로 이동합니다.
          </p>
        </div>

        <div className="mx-auto mb-10 max-w-2xl">
          <a
            href={SHOWCASE_REPO.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className={CREAM_FRAME_CLASS}>
              <div className="relative aspect-[3/2] overflow-hidden bg-brand-deep">
                <Image
                  src="/showcase-ad.jpg"
                  alt="광고 소재 생성 서비스 결과물, 만화형 6칸 3x2 합성본"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                />
                <span className="absolute right-4 bottom-4 rounded-sm bg-ink/85 px-2.5 py-1 font-serif text-sm italic">
                  GitHub
                </span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <div className="font-bold">
                {SHOWCASE_REPO.title}
                <span className="ml-1.5 text-xs font-normal opacity-85">{SHOWCASE_REPO.meta}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed opacity-90">{SHOWCASE_REPO.caption}</p>
              <p className="mt-1 font-serif text-xs italic underline underline-offset-2 opacity-85 break-all">
                {SHOWCASE_REPO.display}
              </p>
            </div>
          </a>
          <p className="mt-2 text-center text-sm">
            <Link href={`/projects/${SHOWCASE_REPO.projectSlug}/`} className="underline underline-offset-4">
              프로젝트 상세 보기
            </Link>
          </p>
        </div>

        <h3 className="sr-only">시연 영상</h3>
        <div className="grid gap-8 sm:grid-cols-2">
          {DEMO_VIDEOS.map((video) => (
            <figure key={video.id}>
              <div className={CREAM_FRAME_CLASS}>
                <div className="aspect-video overflow-hidden bg-brand-deep">
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
              </div>
              <figcaption className="mt-3">
                <div className="font-bold">
                  {video.title}
                  <span className="ml-1.5 text-xs font-normal opacity-85">{video.meta}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed opacity-90">
                  {video.caption}
                  {" · "}
                  <Link href={`/projects/${video.projectSlug}/`} className="underline underline-offset-4">
                    프로젝트 상세 보기
                  </Link>
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- featured projects, one grouped box ---------- */}
      <section className="mt-12">
        <div className={`${SHEET_HEAD_CLASS} mb-8`}>
          <h2 className={SHEET_TITLE_CLASS}>
            Projects
            <span className={SHEET_SUBTITLE_CLASS}>주요 프로젝트</span>
          </h2>
          <p className="text-sm leading-relaxed sm:text-right">
            <b>문제 · 역할 · 성과와 기술 상세.</b>
            <br />
            <Link href="/projects/" className="underline underline-offset-4">
              전체 프로젝트 보기
            </Link>
          </p>
        </div>
        <div className={CREAM_FRAME_CLASS}>
          <ul className="divide-y divide-cream bg-white text-ink">
            {featured.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}/`}
                  className="group grid gap-2 px-5 py-4 transition-colors hover:bg-cream/50 sm:grid-cols-[16rem_minmax(0,1fr)] sm:gap-6"
                >
                  <h3 className="font-bold leading-snug group-hover:underline">{project.title}</h3>
                  <div>
                    <p className="text-sm leading-relaxed text-ink/80">{project.hook}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm border border-brand/40 px-2 py-0.5 text-xs text-brand"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
