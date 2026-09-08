import Image from "next/image";
import Link from "next/link";
import { getFeaturedProjects } from "../lib/projects";
import { SERIF_HEADING_CLASS, StatTile } from "../components/resume-layout";

// Home = one blue sheet (headline → name · role → Applying For → Introduction →
// buttons → Overview numbers) followed by Showcase and Projects sheets. Mirrors
// resume/design/resume.tpl.html pages 1~3. Every number mirrors the master resume.

const OVERVIEW = [
  {
    en: "Real-time Client",
    ko: "실시간 클라이언트 16년",
    desc: "캐주얼, 리듬 게임에서 소셜 아바타 앱, 디지털치료기기까지. 프레임 예산 안에서 무엇을 지킬지 정하는 일",
    stats: [
      { value: "16", unit: "년", label: "Unity 실시간 클라이언트 개발 경력" },
      { value: "30", unit: "fps", label: "10인 이상 동시 참여 그룹 콘텐츠에서 평균 유지" },
      { value: "18", unit: "개 이상", label: "동시에 조합하는 아바타 부위 수" },
      { value: "3", unit: "개월", label: "12년 된 32bit 앱을 64bit로 1인 전환" },
    ],
  },
  {
    en: "Team Leading",
    ko: "개발팀장 3년 4개월",
    desc: "소셜 아바타 앱 Moii. 주니어 4명과 4개월 만에 프로토타입, 1년 만에 오픈 베타",
    stats: [
      { value: "30", unit: "만", label: "누적 다운로드" },
      { value: "4.7", unit: "/5.0", label: "사용자 평점" },
      { value: "4", unit: "명", label: "3년 4개월 리딩한 주니어 개발자" },
      { value: "1", unit: "년", label: "오픈 베타까지, 4개월 만에 프로토타입" },
    ],
  },
  {
    en: "On-device AI",
    ko: "모델 경량화와 실기기 배포",
    desc: "의료영상 분류 모델 3종 포맷 변환, llama.cpp를 Unity에 직접 통합해 Galaxy S25에서 RAG 구동",
    stats: [
      { value: "3.64", unit: "배", label: "INT8 양자화 압축, 16.24MB에서 4.47MB" },
      { value: "2.15", unit: "배", label: "ONNX 추론 지연 단축, 20.20ms에서 9.40ms" },
      { value: "0", unit: "건", label: "위음성(FN), Recall 1.0 유지 검증" },
      { value: "1.1", unit: "GB", label: "임베딩 모델 FP16 경량화, 2.2GB에서" },
    ],
  },
  {
    en: "Tech Lead",
    ko: "두 팀 프로젝트 동시 테크리드",
    desc: "2026년 8월, 광고 소재 생성 서비스와 재난 대피 안내 서비스를 동시에 이끌어 둘 다 제출",
    stats: [
      { value: "2", unit: "팀", label: "동시 테크리드, K-DT 해커톤 장려상(장관상)" },
      { value: "165", unit: "건", label: "팀 커밋 최다, ADR 19건 작성" },
      { value: "61", unit: "%", label: "팀 전체 커밋 약 270건 중 본인 비중" },
      { value: "22", unit: "회", label: "모듈 간 HTTP 계약(openapi.yaml) 개정 소유" },
    ],
  },
  {
    en: "IP & Operations",
    ko: "지식재산과 개인 운영 자산",
    desc: "등록특허 국내 3건, 미국 1건. PR 사이트와 Ask AI 챗봇을 운영비 0원으로 운영 중",
    stats: [
      { value: "4", unit: "건", label: "등록특허, 국가연구개발사업 참여" },
      { value: "5", unit: "건", label: "후속 출원에 피인용된 특허" },
      { value: "100", label: "Lighthouse 접근성, SEO 100, 성능 97 ~ 100" },
      { value: "0.6", unit: "초", label: "Ask AI 챗봇 응답, 운영비 0원" },
    ],
  },
] as const;

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

const SHEET_CLASS = "rounded-2xl bg-brand p-6 text-white sm:p-10";
const SHEET_HEAD_CLASS =
  "flex flex-col gap-2 border-b-2 border-white/70 pb-4 sm:flex-row sm:items-end sm:justify-between";
const SHEET_TITLE_CLASS = "font-serif text-4xl font-bold italic leading-none";
const SHEET_SUBTITLE_CLASS = "ml-3 font-sans text-base font-normal not-italic opacity-85";
const POSTER_BUTTON_CLASS =
  "rounded-lg border border-white/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-brand";
const POSTER_BUTTON_FILL_CLASS =
  "rounded-lg bg-cream px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white";
const CREAM_FRAME_CLASS = "bg-cream p-2.5";

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <div className="space-y-12">
      {/* ---------- sheet 1: headline + Overview (resume pages 1~2 merged) ---------- */}
      <section className={SHEET_CLASS}>
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

        <div className={`${SHEET_HEAD_CLASS} mt-12`}>
          <h2 className={SHEET_TITLE_CLASS}>Overview</h2>
          <p className="text-sm leading-relaxed sm:text-right">
            <b>숫자로 보는 핵심 역량.</b>
            <br />
            모든 수치의 근거와 맥락은 About과 프로젝트 상세에 있습니다.
          </p>
        </div>
        {OVERVIEW.map((group, index) => (
          <div
            key={group.en}
            className={`grid gap-6 py-8 md:grid-cols-[14rem_minmax(0,1fr)] ${
              index < OVERVIEW.length - 1 ? "border-b border-white/30" : "pb-2"
            }`}
          >
            <div>
              <h3 className={SERIF_HEADING_CLASS}>{group.en}</h3>
              <div className="mt-2 font-bold">{group.ko}</div>
              <p className="mt-1 text-sm leading-relaxed opacity-90">{group.desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
              {group.stats.map((stat) => (
                <StatTile
                  key={stat.label}
                  value={stat.value}
                  unit={"unit" in stat ? stat.unit : undefined}
                  label={stat.label}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ---------- sheet 2: Showcase, real devices not slides (resume page 3) ---------- */}
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

      {/* ---------- sheet 3: featured projects as cream-framed cards ---------- */}
      <section className={SHEET_CLASS}>
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}/`}
              className={`group flex ${CREAM_FRAME_CLASS} text-ink transition-colors hover:bg-white`}
            >
              <div className="flex w-full flex-col bg-white p-5">
                <h3 className="font-bold leading-snug group-hover:underline">{project.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/80">
                  {project.hook}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
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
          ))}
        </div>
      </section>
    </div>
  );
}
