import Image from "next/image";
import Link from "next/link";
import {
  CREAM_FRAME_CLASS,
  SHEET_CLASS,
  SHEET_HEAD_CLASS,
  SHEET_SUBTITLE_CLASS,
  SHEET_TITLE_CLASS,
} from "../components/resume-layout";

// Home = Showcase (resume page 3). The headline lives in the sticky SiteHeader,
// the numeric Overview on About, and the project list on /projects/.

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

export default function HomePage() {
  return (
    <section className={SHEET_CLASS}>
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
        <a href={SHOWCASE_REPO.href} target="_blank" rel="noopener noreferrer" className="group block">
          <div className={CREAM_FRAME_CLASS}>
            <div className="relative aspect-[3/2] overflow-hidden bg-brand-deep">
              <Image
                src="/showcase-ad.jpg"
                alt="광고 소재 생성 서비스 결과물, 만화형 6칸 3x2 합성본"
                width={1200}
                height={800}
                priority
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
  );
}
