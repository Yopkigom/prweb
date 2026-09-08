import Image from "next/image";
import Link from "next/link";
import { getFeaturedProjects } from "../lib/projects";
import { SERIF_HEADING_CLASS, TAG_CLASS, StatTile } from "../components/resume-layout";

// Home mirrors resume pages 1~3 (poster → Overview → Showcase) from
// resume/design/resume.tpl.html. Every number mirrors the master resume.

const CONTACT = [
  { k: "Email", v: "seenjeonga@gmail.com", href: "mailto:seenjeonga@gmail.com" },
  { k: "GitHub", v: "github.com/Yopkigom", href: "https://github.com/Yopkigom" },
  { k: "Web", v: "prweb.yopkigom.workers.dev", href: "/" },
  { k: "Location", v: "경기도" },
] as const;

const EXPERIENCE = [
  { k: "뉴냅스", role: "개발팀 수석", v: "발성 교정용 Unity 실시간 음성 녹음 모듈", d: "2025.09 ~ 2026.01" },
  { k: "일루니", role: "개발팀장", v: "소셜 아바타 앱 Moii, 주니어 4명 리딩, 누적 30만, 평점 4.7", d: "2022.05 ~ 2025.08" },
  { k: "컵케이크소프트", role: "사원", v: "영어 학습 앱, 32bit 온라인 앱의 64bit 오프라인 1인 전환", d: "2020.06 ~ 2022.04" },
  { k: "티쓰리엔터테인먼트", role: "사원", v: "영어 학습 앱 클라이언트 개발, 특허 공동발명", d: "2017.06 ~ 2020.06" },
  { k: "네오위즈 게임온스튜디오", role: "사원", v: "시스타 카지노 한글화, 캅사 수순(포커) 클라이언트", d: "2015.12 ~ 2017.01" },
  { k: "중소 게임 개발사", role: "사원", v: "캐주얼, 리듬, 2D MO RPG 클라이언트", d: "2009.10 ~ 2015.11" },
] as const;

const AWARDS = [
  { k: "수상", v: "제8회 K-디지털 트레이닝 해커톤 장려상(고용노동부장관상)", d: "2026.09" },
  { k: "특허", v: "아바타 생성 장치 및 방법 — KR 10-2652652 / KR 10-2876336 / US 12,223,576 B2" },
  { k: "", v: "외국어 학습시스템 — KR 10-2093938, 후속 출원 5건에 피인용" },
  { k: "교육", v: "동의대학교 게임공학 졸업 2010.03 · 코드잇 스프린트 AI 엔지니어 부트캠프 수료 2026.08" },
] as const;

const AI_PROJECTS = [
  { k: "온디바이스 RAG", v: "llama.cpp를 Unity에 직접 통합, ONNX FP16 임베딩 경량화, Galaxy S25 실기기 검증", slug: "unity-ondevice-rag" },
  { k: "모델 경량화", v: "의료영상 분류 모델 INT8 3.64배 압축, ONNX 추론 2.15배 단축, 위음성 0 유지", slug: "model-quantization-ondevice" },
  { k: "광고 소재 생성", v: "Tech Lead / OpenAPI 계약 모노레포, 광고 카피 가드레일 위반 0건, 커밋 165건 최다", slug: "ad-creative-generation" },
  { k: "재난 대피 안내", v: "Tech Lead / 아키텍처와 HTTP 계약 소유, K-DT 해커톤 장려상(장관상) 수상", slug: "savers-disaster-evacuation" },
  { k: "PR 사이트", v: "Next.js + Cloudflare Workers, Ask AI 챗봇, Lighthouse 접근성 100", slug: "ask-ai-behind-the-scenes" },
] as const;

const STACK = [
  { h: "Client / Real-time", tags: ["C#", "Unity", "Unity Sentis", "C/C++", "IL2CPP AOT", "Android NDK", "Agora", "실시간 오디오", "MVP"], hi: 2 },
  { h: "AI / Deployment", tags: ["llama.cpp", "ONNX", "PyTorch", "INT8 PTQ", "RAG", "LangGraph", "TensorRT", "TFLite", "FastAPI", "Cloudflare"], hi: 2 },
] as const;

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
const POSTER_BUTTON_CLASS =
  "rounded-lg border border-white/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-brand";
const POSTER_BUTTON_FILL_CLASS =
  "rounded-lg bg-cream px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white";
const SHOWCASE_FRAME_CLASS = "bg-cream p-2.5";

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <div className="space-y-12">
      {/* ---------- resume page 1: blue poster ---------- */}
      <section className={`${SHEET_CLASS} grid gap-10 lg:grid-cols-[17rem_minmax(0,1fr)]`}>
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-black leading-snug tracking-tight sm:text-4xl">
            Unity 16년,
            <br />
            멀티플랫폼 AI를
            <br />
            주도합니다.
          </h1>

          <div className="flex flex-wrap gap-3">
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

          <div>
            <div className="text-5xl font-black leading-none tracking-tighter">신호정</div>
            <div className="mt-3 w-52 bg-cream p-2.5">
              <Image
                src="/photo.jpg"
                alt="신호정 증명사진"
                width={624}
                height={780}
                priority
                className="aspect-[4/5] w-full object-cover object-[50%_20%] grayscale contrast-[1.12] brightness-[1.02]"
              />
            </div>
            <div className="mt-3 w-52 text-right text-4xl font-black leading-none tracking-tighter">
              AI 제품
              <br />
              <span className="mt-1 inline-block">개발 리드</span>
            </div>
          </div>

          <div className="space-y-6 text-sm">
            <div>
              <div className={`${SERIF_HEADING_CLASS} mb-2`}>Applying For :</div>
              <p className="font-bold leading-relaxed">
                AI 제품 개발 리드 / 테크리드
                <br />
                (온디바이스 AI 클라이언트, 게임 AI 포함)
              </p>
            </div>
            <div>
              <div className={`${SERIF_HEADING_CLASS} mb-2`}>Contact Me At :</div>
              <ul className="space-y-0.5 leading-relaxed">
                {CONTACT.map((row) => (
                  <li key={row.k} className="flex gap-2">
                    <span className="w-16 shrink-0 opacity-85">{row.k}</span>
                    {"href" in row ? (
                      <a
                        href={row.href}
                        className="underline-offset-4 hover:underline"
                        {...(row.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {row.v}
                      </a>
                    ) : (
                      <span>{row.v}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-7 text-sm">
          <section>
            <h2 className={`${SERIF_HEADING_CLASS} mb-2`}>Introduction</h2>
            <p className="leading-relaxed">
              <b>실시간 클라이언트를 16년 만들어 온 개발자</b>입니다.{" "}
              <b>지금은 AI 모델을 제품 안에서 돌아가게 만드는 일</b>을 합니다. 소셜 아바타 앱
              개발팀을 3년 4개월 이끌었고, 2026년 8월에는 두 팀 프로젝트를 동시에 테크리드로 맡아
              둘 다 제출했습니다.
            </p>
          </section>

          <section>
            <h2 className={`${SERIF_HEADING_CLASS} mb-2`}>Experience</h2>
            <ul className="space-y-1.5">
              {EXPERIENCE.map((row) => (
                <li key={row.k} className="flex flex-col gap-x-3 sm:flex-row sm:items-baseline">
                  <span className="w-44 shrink-0 font-bold">
                    {row.k}
                    <span className="ml-1.5 text-xs font-normal opacity-85">{row.role}</span>
                  </span>
                  <span className="flex-1 leading-snug opacity-95">{row.v}</span>
                  <span className="shrink-0 font-serif text-xs opacity-85">{row.d}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className={`${SERIF_HEADING_CLASS} mb-2`}>Awards &amp; Patents</h2>
            <ul className="space-y-1.5">
              {AWARDS.map((row, index) => (
                <li key={index} className="flex flex-col gap-x-3 sm:flex-row sm:items-baseline">
                  <span className="w-12 shrink-0 font-bold">{row.k}</span>
                  <span className="flex-1 leading-snug opacity-95">
                    {row.v}
                    {"d" in row && (
                      <span className="ml-1.5 font-serif text-xs opacity-85">{row.d}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className={`${SERIF_HEADING_CLASS} mb-2`}>AI Projects</h2>
            <ul className="space-y-1.5">
              {AI_PROJECTS.map((row) => (
                <li key={row.k} className="flex flex-col gap-x-3 sm:flex-row sm:items-baseline">
                  <Link
                    href={`/projects/${row.slug}/`}
                    className="w-32 shrink-0 font-bold underline-offset-4 hover:underline"
                  >
                    {row.k}
                  </Link>
                  <span className="flex-1 leading-snug opacity-95">{row.v}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className={`${SERIF_HEADING_CLASS} mb-2`}>Tech Stack</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {STACK.map((group) => (
                <div key={group.h}>
                  <div className="mb-1.5 font-bold">{group.h}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.tags.map((tag, index) => (
                      <span
                        key={tag}
                        className={
                          index < group.hi
                            ? "rounded-sm bg-cream px-1.5 py-0.5 text-xs font-bold text-ink"
                            : "rounded-sm border border-white/75 px-1.5 py-0.5 text-xs"
                        }
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* ---------- resume page 2: Overview, numbers first ---------- */}
      <section className={SHEET_CLASS}>
        <div className="flex flex-col gap-2 border-b-2 border-white/70 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-serif text-4xl font-bold italic leading-none">Overview</h2>
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

      {/* ---------- resume page 3: Showcase, real devices not slides ---------- */}
      <section className={SHEET_CLASS}>
        <div className="mb-8 flex flex-col gap-2 border-b-2 border-white/70 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-serif text-4xl font-bold italic leading-none">
            Showcase
            <span className="ml-3 font-sans text-base font-normal not-italic opacity-85">시연 영상과 저장소</span>
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
            <div className={SHOWCASE_FRAME_CLASS}>
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
              <div className={SHOWCASE_FRAME_CLASS}>
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

      {/* ---------- featured project cards ---------- */}
      <section className="space-y-6">
        <h2 className="flex items-baseline gap-3 text-brand dark:text-blue-300">
          <span className={SERIF_HEADING_CLASS}>Projects</span>
          <span className="text-sm text-zinc-500">주요 프로젝트</span>
          <Link href="/projects/" className="ml-auto text-sm underline underline-offset-4">
            전체 보기
          </Link>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}/`}
              className="group rounded-xl border border-zinc-200 bg-cream/60 p-6 transition-colors hover:border-brand dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-300"
            >
              <h3 className="font-semibold group-hover:underline">{project.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                {project.hook}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className={TAG_CLASS}>
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
