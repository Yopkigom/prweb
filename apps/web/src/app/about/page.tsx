import type { Metadata } from "next";
import {
  BULLET_CLASS,
  BUTTON_PRIMARY_CLASS,
  LINK_CLASS,
  ResumeFoot,
  ResumeFrame,
  ResumeRow,
  ResumeSection,
  SERIF_HEADING_CLASS,
  SHEET_CLASS,
  SHEET_HEAD_CLASS,
  SHEET_TITLE_CLASS,
  StatTile,
} from "../../components/resume-layout";

export const metadata: Metadata = {
  title: "About",
};

// Public resume PDF (phone number removed, photo kept). Built in the job-hunt repo with
// `python -X utf8 resume/design/build.py --web` and copied to public/resume.pdf.
// Served with X-Robots-Tag: noindex (public/_headers); not disallowed in robots.ts so crawlers can read that header.
const RESUME_PDF_PATH = "/resume.pdf";
const RESUME_PDF_FILENAME = "신호정_웹_이력서.pdf";

// Every number below mirrors the master resume. Change both or neither.

// Resume page 2: numbers first. Rendered as a blue sheet above the detail frame.
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

const SUMMARY = [
  {
    label: "실시간 클라이언트",
    text: "실시간 클라이언트를 16년 만들어 온 개발자. 지금은 AI 모델을 제품 안에서 돌아가게 만드는 일을 합니다",
  },
  {
    label: "팀 리딩",
    text: "소셜 아바타 앱 개발팀장 3년 4개월. 개발 4명으로 4개월 만에 프로토타입, 1년 만에 오픈 베타. 누적 다운로드 30만, 사용자 평점 4.7",
  },
  {
    label: "테크리드",
    text: "2026년 8월 두 팀 프로젝트를 동시에 테크리드로 이끌어 둘 다 제출, 제8회 K-디지털 트레이닝 해커톤 장려상(고용노동부장관상) 수상",
  },
  {
    label: "모델 경량화",
    text: "의료영상 분류 모델을 INT8 양자화로 3.64배 압축, ONNX 변환으로 추론 지연 2.15배 단축, 위음성 0 유지 검증",
  },
  {
    label: "온디바이스 RAG",
    text: "llama.cpp를 Unity에 직접 통합해 Galaxy S25에서 문서 질의응답(RAG) 앱 구동",
  },
  {
    label: "지식재산",
    text: "등록특허 4건(국내 3건, 미국 1건), 국가연구개발사업 참여",
  },
] as const;

const INTRO = [
  {
    label: "16년, 같은 문제",
    text: "16년 동안 제한된 단말에서 실시간을 지키는 일을 해 왔습니다. 캐주얼 게임과 리듬 게임에서 시작해 소셜 아바타 앱과 발성 교정용 디지털치료기기까지, 플랫폼은 바뀌었지만 문제는 같았습니다. 프레임 예산 안에서 무엇을 포기하고 무엇을 지킬지 정하는 일입니다.",
  },
  {
    label: "온디바이스 AI",
    text: "AI 아바타 생성 서비스를 3년 넘게 만들면서, 모델을 쓰는 쪽에 있으면서도 모델 자체를 다루지 못하는 한계를 느꼈고, 그 부분을 메우려고 7개월 AI 엔지니어 과정을 선택했습니다. 온디바이스 AI는 제가 16년 동안 풀어 온 것과 같은 문제였습니다. 의료영상 분류 모델을 세 가지 포맷으로 뽑아 같은 테스트셋으로 비교하고, 검증 정확도가 가장 높은 쪽 대신 위음성이 0인 쪽을 골랐습니다. 과정 밖에서는 llama.cpp를 Unity에 직접 붙여 Galaxy S25에서 문서 질의응답 앱을 돌렸습니다.",
  },
  {
    label: "두 팀 테크리드",
    text: "지난 8월에는 두 팀 프로젝트를 동시에 테크리드로 맡았습니다. 의사결정의 근거를 저장소에 고정해 팀원과 코드 에이전트가 같은 규칙으로 작업하게 만들었고, 두 팀 다 제출했으며 해커톤 쪽은 고용노동부장관상을 받았습니다. 실시간 클라이언트를 만드는 일과, 만드는 절차를 팀이 반복할 수 있게 하는 일. 이 두 가지를 함께 쓸 수 있는 자리에서 일하고 싶습니다.",
  },
] as const;

const CAREER = [
  {
    company: "일루니",
    title: "개발팀장",
    period: "2022.05 ~ 2025.08",
    items: [
      "소셜 아바타 앱 Moii 개발팀 리딩. 주니어 4명과 3년 4개월, 개발 4명으로 4개월 만에 프로토타입, 1년 만에 오픈 베타",
      "누적 다운로드 30만, 사용자 평점 4.7 / 5.0, 주요 업데이트와 비정기 핫픽스 운영",
      "아바타 순차 생성 최적화: 조합 부위 18개 이상, 10인 이상이 동시에 참여하는 그룹 콘텐츠에서 평균 30fps 이상 유지",
      "Agora 더블 버퍼링 녹음으로 렌더링 프레임을 지키면서 실시간 음성 전송과 녹음을 동시 처리",
      "MVP 프레임워크를 도입해 신규 기능 개발 절차를 표준화",
      "「아바타 생성 장치 및 방법」 특허 공동발명(5인). 과기정통부 실감콘텐츠핵심기술개발 과제 「문장으로부터의 3차원 동영상 자동 생성 기술」 참여",
    ],
  },
  {
    company: "뉴냅스",
    title: "개발팀 수석",
    period: "2025.09 ~ 2026.01",
    items: [
      "발성 교정용 디지털치료기기의 Unity 실시간 음성 녹음 모듈 개발. 실시간 음성 버퍼에 직접 접근해 청크 단위 녹음, dB 측정, 파형 출력으로 기능을 분리",
      "Android 음성 어시스턴트 호출 시 오디오 세션이 깨지는 문제를 OnAudioFilterRead 경로 대신 기본 Microphone 버퍼 접근으로 구조를 바꿔 해결",
      "녹음 모듈을 별도 앱으로 분리해 음성 분석 모델을 맡은 AI 팀에 전달, 협업 인터페이스 확보",
      "음성 모듈 설계 문서 작성과 규제 서류 대응. 필드 테스트 이슈를 팀원에게 할당하고 관리해 2개월간 핫픽스 6회",
    ],
  },
  {
    company: "컵케이크소프트",
    title: "티쓰리엔터테인먼트 자회사 · 사원",
    period: "2020.06 ~ 2022.04",
    items: [
      "영어 학습 앱 개발. 12년 된 32bit 온라인 앱 오잉글리시를 64bit 오프라인 반숙영어 앱으로 3개월 만에 1인 전환, 시리즈 4종을 1개월 간격으로 출시",
    ],
  },
  {
    company: "티쓰리엔터테인먼트",
    title: "오잉글리시팀 · 사원",
    period: "2017.06 ~ 2020.06",
    items: [
      "영어 학습 앱 클라이언트 개발. 「학습자가 선택한 동영상을 학습 콘텐츠로 활용하는 외국어 학습시스템」 특허 공동발명(4인)",
    ],
  },
  {
    company: "네오위즈 게임온스튜디오",
    title: "개발1실 · 사원",
    period: "2015.12 ~ 2017.01",
    items: [
      "시스타 카지노 한글화 클라이언트, 캅사 수순(Capsa Susun) 클라이언트 개발",
    ],
  },
  {
    company: "중소 게임 개발사",
    title: "사원",
    period: "2009.10 ~ 2015.11",
    items: ["캐주얼 게임, 리듬 게임, 2D MO RPG 클라이언트 개발"],
  },
] as const;

const AWARDS = [
  {
    title: "제8회 K-디지털 트레이닝 해커톤 장려상",
    sub: "고용노동부장관상",
    date: "2026.09",
    text: "4인 팀 SAVERS Tech Lead, 본선 진출 20개 팀",
  },
] as const;

const PATENTS = [
  {
    title: "아바타 생성 장치 및 방법",
    meta: "공동발명(5인) · 권리자 (주)일루니",
    date: "2024 ~ 2025 등록",
    note: "과기정통부 실감콘텐츠핵심기술개발 「문장으로부터의 3차원 동영상 자동 생성 기술」 과제 결과물",
    registrations: [
      {
        label: "KR 10-2652652 (2024.03.26 등록)",
        href: "https://patents.google.com/patent/KR102652652B1/ko",
      },
      {
        label: "KR 10-2876336 (2025.10.21 등록)",
        href: "https://patents.google.com/patent/KR102876336B1/ko",
      },
      {
        label: "US 12,223,576 B2 (2025.02.11 등록)",
        href: "https://patents.google.com/patent/US12223576B2/en",
      },
    ],
  },
  {
    title: "학습자가 선택한 동영상을 학습 콘텐츠로 활용하는 외국어 학습시스템",
    meta: "공동발명(4인) · 권리자 (주)티쓰리엔터테인먼트",
    date: "2020.03 등록",
    note: "후속 출원 5건에 피인용",
    registrations: [
      {
        label: "KR 10-2093938 (2020.03.20 등록)",
        href: "https://patents.google.com/patent/KR102093938B1/ko",
      },
    ],
  },
] as const;

const EDUCATION = [
  {
    label: "교육",
    items: [
      "코드잇 스프린트 AI 엔지니어 부트캠프 (K-DT 10기), 2026.02 ~ 2026.08 수료",
      "부산 게임 아카데미 프로그래밍 과정, 2008.02 ~ 2009.02",
    ],
  },
  {
    label: "학력",
    items: ["동의대학교 게임공학 졸업, 2005.03 ~ 2010.03"],
  },
] as const;

const SKILLS = [
  {
    label: "언어",
    value:
      "C#(주력, 멀티스레드), C/C++(llama.cpp C-ABI 래퍼 작성), Objective-C, Python, JavaScript, Lua",
  },
  {
    label: "엔진과 툴",
    value:
      "Unity(6.3 LTS 포함), Unity Sentis, Visual Studio, Xcode, Android Studio, Android NDK, CMake, llvm-mingw 교차컴파일, Git, SVN",
  },
  {
    label: "실시간 오디오",
    value:
      "Agora 더블 버퍼링 녹음, Unity Microphone 실시간 버퍼 청크 처리, dB 측정, 파형 출력",
  },
  {
    label: "AI 모델과 배포",
    value:
      "PyTorch, ONNX(opset 17), PTQ 정적 양자화(INT8, fbgemm), FP16 경량화, llama.cpp / GGUF, RAG, LangChain / LangGraph, HuggingFace Transformers, IL2CPP / AOT 대응, vLLM, Nvidia Triton, TensorRT, TensorFlow Lite",
  },
  {
    label: "AI 제품 파이프라인",
    value:
      "OpenAPI 계약 우선 설계, 프롬프트 설계와 출력 가드레일, 골든셋 on/off 대조와 LLM 채점 하네스, gpt-image-2 / gpt-5 API 연동, SDXL + IP-Adapter 로컬 탐색",
  },
  {
    label: "웹과 운영",
    value:
      "FastAPI, Next.js, TypeScript, Tailwind, Cloudflare Workers / Durable Objects, docker compose, GCP / AWS VM, GitHub Actions, pre-commit(ruff, mypy, pytest), Playwright E2E",
  },
  {
    label: "협업 운영",
    value:
      "AGENTS.md / CLAUDE.md 기반 코드 에이전트 규칙, ADR, 회의록 기반 의사결정, CODEOWNERS",
  },
] as const;

const CONTACT = [
  {
    label: "Email",
    text: "seenjeonga@gmail.com",
    href: "mailto:seenjeonga@gmail.com",
    external: false,
  },
  {
    label: "GitHub",
    text: "github.com/Yopkigom",
    href: "https://github.com/Yopkigom",
    external: true,
  },
] as const;

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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">About</h2>
          <p className="text-lg text-zinc-600">경력 · 특허 · 수상 · 교육 · 기술 스택</p>
        </div>
        <a href={RESUME_PDF_PATH} download={RESUME_PDF_FILENAME} className={BUTTON_PRIMARY_CLASS}>
          <DownloadIcon />
          이력서 PDF 다운로드
        </a>
      </header>

      <section className={SHEET_CLASS}>
        <div className={SHEET_HEAD_CLASS}>
          <h2 className={SHEET_TITLE_CLASS}>Overview</h2>
          <p className="text-sm leading-relaxed sm:text-right">
            <b>숫자로 보는 핵심 역량.</b>
            <br />
            모든 수치의 근거와 맥락은 아래 상세와 프로젝트 페이지에 있습니다.
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

      <ResumeFrame>
        <ResumeSection en="Summary" ko="요약" caption="실시간 클라이언트 16년, AI 제품 개발 리드">
          {SUMMARY.map((item, index) => (
            <ResumeRow key={item.label} label={item.label} index={index}>
              <p>{item.text}</p>
            </ResumeRow>
          ))}
        </ResumeSection>

        <ResumeSection en="Introduction" ko="자기소개" caption="같은 문제를 16년째 풀고 있습니다">
          {INTRO.map((item, index) => (
            <ResumeRow key={item.label} label={item.label} index={index}>
              <p>{item.text}</p>
            </ResumeRow>
          ))}
        </ResumeSection>

        <ResumeSection en="Experience" ko="경력" caption="2009 ~ 2026 경력 정리">
          {CAREER.map((job, index) => (
            <ResumeRow
              key={`${job.company}-${job.period}`}
              label={job.company}
              sub={job.title}
              date={job.period}
              index={index}
            >
              <ul className="space-y-1">
                {job.items.map((item) => (
                  <li key={item} className={BULLET_CLASS}>
                    {item}
                  </li>
                ))}
              </ul>
            </ResumeRow>
          ))}
        </ResumeSection>

        <ResumeSection en="Awards & Patents" ko="수상 · 특허" caption="등록특허 4건, 국가연구개발사업 참여">
          {AWARDS.map((award, index) => (
            <ResumeRow
              key={award.title}
              label={award.title}
              sub={award.sub}
              date={award.date}
              index={index}
            >
              <p>{award.text}</p>
            </ResumeRow>
          ))}
          {PATENTS.map((patent, index) => (
            <ResumeRow
              key={patent.title}
              label={patent.title}
              sub={patent.meta}
              date={patent.date}
              index={AWARDS.length + index}
            >
              <ul className="space-y-1">
                {patent.registrations.map((registration) => (
                  <li key={registration.href} className={BULLET_CLASS}>
                    <a
                      href={registration.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASS}
                    >
                      {registration.label}
                    </a>
                  </li>
                ))}
                <li className={BULLET_CLASS}>{patent.note}</li>
              </ul>
            </ResumeRow>
          ))}
        </ResumeSection>

        <ResumeSection en="Education" ko="교육 · 학력" caption="게임공학 전공, AI 엔지니어 과정 수료">
          {EDUCATION.map((entry, index) => (
            <ResumeRow key={entry.label} label={entry.label} index={index}>
              <ul className="space-y-1">
                {entry.items.map((item) => (
                  <li key={item} className={BULLET_CLASS}>
                    {item}
                  </li>
                ))}
              </ul>
            </ResumeRow>
          ))}
        </ResumeSection>

        <ResumeSection en="Tech Stack" ko="기술 스택" caption="주력 C# / Unity, AI 모델 배포">
          {SKILLS.map((skill, index) => (
            <ResumeRow key={skill.label} label={skill.label} index={index}>
              <p>{skill.value}</p>
            </ResumeRow>
          ))}
        </ResumeSection>

        <ResumeSection en="Contact" ko="연락처" caption="이메일과 GitHub">
          {CONTACT.map((entry, index) => (
            <ResumeRow key={entry.label} label={entry.label} index={index}>
              <a
                href={entry.href}
                className={LINK_CLASS}
                {...(entry.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {entry.text}
              </a>
            </ResumeRow>
          ))}
        </ResumeSection>

        <ResumeFoot left="신호정 / seenjeonga@gmail.com" right="prweb.yopkigom.workers.dev" />
      </ResumeFrame>
    </div>
  );
}
