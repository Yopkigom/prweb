import { SERIF_HEADING_CLASS } from "./resume-layout";
import { SiteNav } from "./site-nav";

// Public resume PDF (phone number removed, photo kept). Built in the job-hunt repo with
// `python -X utf8 resume/design/build.py --web` and copied to public/resume.pdf.
// Served with X-Robots-Tag: noindex (public/_headers); not disallowed in robots.ts so crawlers can read that header.
const RESUME_PDF_PATH = "/resume.pdf";
const RESUME_PDF_FILENAME = "신호정_웹_이력서.pdf";

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 15.5h12" />
    </svg>
  );
}

// Replaces the old top menu: the resume poster headline (title → name · role →
// Applying For → Introduction) plus the section buttons and the resume download,
// pinned to the top on sm+ viewports. On phones it scrolls with the page so it
// does not eat the screen.
export function SiteHeader() {
  return (
    <header className="z-10 bg-brand text-white shadow-md sm:sticky sm:top-0">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
          Unity 16년, 멀티플랫폼 AI를 주도합니다.
        </h1>
        <p className="mt-1.5 flex flex-wrap items-baseline text-base font-bold sm:text-lg">
          {/* Name matches the h1 size; the role keeps the smaller line size. */}
          <span className="text-2xl font-black tracking-tight sm:text-3xl">신호정</span>
          <span className="mx-2 font-normal opacity-60">|</span>
          <span>AI 제품 개발 리드</span>
        </p>

        <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
          <div className={`${SERIF_HEADING_CLASS} shrink-0 text-base`}>Applying For :</div>
          <p className="text-sm font-bold leading-relaxed">
            AI 제품 개발 리드 / 테크리드
            <span className="ml-2 font-normal opacity-90">(온디바이스 AI 클라이언트, 게임 AI 포함)</span>
          </p>
        </div>

        <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
          <h2 className={`${SERIF_HEADING_CLASS} shrink-0 text-base`}>Introduction</h2>
          <p className="max-w-3xl text-sm leading-relaxed">
            <b>실시간 클라이언트를 16년 만들어 온 개발자</b>입니다.{" "}
            <b>지금은 AI 모델을 제품 안에서 돌아가게 만드는 일</b>을 합니다. 소셜 아바타 앱 개발팀을
            3년 4개월 이끌었고, 2026년 8월에는 두 팀 프로젝트를 동시에 테크리드로 맡아 둘 다
            제출했습니다.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
          <SiteNav />
          <a
            href={RESUME_PDF_PATH}
            download={RESUME_PDF_FILENAME}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-cream sm:ml-auto"
          >
            <DownloadIcon />
            이력서 PDF 다운로드
          </a>
        </div>
      </div>
    </header>
  );
}
