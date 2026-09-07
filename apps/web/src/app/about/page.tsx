import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

// Every number below mirrors the master resume. Change both or neither.
const SUMMARY = [
  "실시간 클라이언트를 16년 만들어 온 개발자. 지금은 AI 모델을 제품 안에서 돌아가게 만드는 일을 합니다",
  "소셜 아바타 앱 개발팀장 3년 4개월. 개발 4명으로 4개월 만에 프로토타입, 1년 만에 오픈 베타. 누적 다운로드 30만, 사용자 평점 4.7",
  "2026년 8월 두 팀 프로젝트를 동시에 테크리드로 이끌어 둘 다 제출, 제8회 K-디지털 트레이닝 해커톤 장려상(고용노동부장관상) 수상",
  "의료영상 분류 모델을 INT8 양자화로 3.64배 압축, ONNX 변환으로 추론 지연 2.15배 단축, 위음성 0 유지 검증",
  "llama.cpp를 Unity에 직접 통합해 Galaxy S25에서 문서 질의응답(RAG) 앱 구동",
  "등록특허 4건(국내 3건, 미국 1건), 국가연구개발사업 참여",
] as const;

const CAREER = [
  {
    company: "일루니",
    title: "개발팀장",
    period: "2022.05 ~ 2025.08",
    items: [
      "소셜 아바타 앱 Moii 개발팀 리딩. 주니어 4명과 3년 4개월, 개발 4명으로 4개월 만에 프로토타입, 1년 만에 오픈 베타",
      "누적 다운로드 30만, 사용자 평점 4.7 / 5.0, 주요 업데이트 12회와 비정기 핫픽스",
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
      "VR 기반 디지털치료기기의 Unity 실시간 음성 녹음 모듈 개발. 실시간 음성 버퍼에 직접 접근해 청크 단위 녹음, dB 측정, 파형 출력으로 기능을 분리",
      "Android 음성 어시스턴트 호출 시 오디오 세션이 깨지는 문제를 OnAudioFilterRead 경로 대신 기본 Microphone 버퍼 접근으로 구조를 바꿔 해결",
      "녹음 모듈을 별도 앱으로 분리해 음성 분석 모델을 맡은 AI 팀에 전달, 협업 인터페이스 확보",
      "음성 모듈 설계 문서 작성과 규제 서류 대응. 필드 테스트 이슈를 팀원에게 할당하고 관리해 2개월간 핫픽스 6회",
    ],
  },
  {
    company: "컵케이크소프트 (티쓰리엔터테인먼트 자회사)",
    title: "사원",
    period: "2020.06 ~ 2022.04",
    items: [
      "영어 학습 앱 개발. 12년 된 32bit 온라인 앱 반숙영어를 64bit 오프라인 앱으로 3개월 만에 1인 전환, 시리즈 4종을 1개월 간격으로 출시",
    ],
  },
  {
    company: "티쓰리엔터테인먼트 오잉글리시팀",
    title: "사원",
    period: "2017.06 ~ 2020.06",
    items: [
      "영어 학습 앱 클라이언트 개발. 「학습자가 선택한 동영상을 학습 콘텐츠로 활용하는 외국어 학습시스템」 특허 공동발명(4인)",
    ],
  },
  {
    company: "네오위즈 게임온스튜디오 개발1실",
    title: "사원",
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

const PATENTS = [
  {
    title: "아바타 생성 장치 및 방법",
    meta: "공동발명(5인) · 권리자 (주)일루니",
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
    note: "후속 출원 5건에 피인용",
    registrations: [
      {
        label: "KR 10-2093938 (2020.03.20 등록)",
        href: "https://patents.google.com/patent/KR102093938B1/ko",
      },
    ],
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

const LINK_CLASS =
  "text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";

const SECTION_CLASS =
  "space-y-4 border-t border-zinc-200 pt-8 dark:border-zinc-800";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">신호정</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Unity 실시간 클라이언트 16년, AI 제품 개발 리드
        </p>
      </header>

      <section className="space-y-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p>
          16년 동안 제한된 단말에서 실시간을 지키는 일을 해 왔습니다. 캐주얼
          게임과 리듬 게임에서 시작해 소셜 아바타 앱과 VR 디지털치료기기까지,
          플랫폼은 바뀌었지만 문제는 같았습니다. 프레임 예산 안에서 무엇을
          포기하고 무엇을 지킬지 정하는 일입니다.
        </p>
        <p>
          AI 아바타 생성 서비스를 3년 넘게 만들면서, 모델을 쓰는 쪽에 있으면서도
          모델 자체를 다루지 못하는 한계를 느꼈고, 그 부분을 메우려고 7개월 AI
          엔지니어 과정을 선택했습니다. 온디바이스 AI는 제가 16년 동안 풀어 온
          것과 같은 문제였습니다. 의료영상 분류 모델을 세 가지 포맷으로 뽑아
          같은 테스트셋으로 비교하고, 검증 정확도가 가장 높은 쪽 대신 위음성이
          0인 쪽을 골랐습니다. 과정 밖에서는 llama.cpp를 Unity에 직접 붙여
          Galaxy S25에서 문서 질의응답 앱을 돌렸습니다.
        </p>
        <p>
          지난 8월에는 두 팀 프로젝트를 동시에 테크리드로 맡았습니다.
          의사결정의 근거를 저장소에 고정해 팀원과 코드 에이전트가 같은 규칙으로
          작업하게 만들었고, 두 팀 다 제출했으며 해커톤 쪽은
          고용노동부장관상을 받았습니다. 실시간 클라이언트를 만드는 일과, 만드는
          절차를 팀이 반복할 수 있게 하는 일. 이 두 가지를 함께 쓸 수 있는
          자리에서 일하고 싶습니다.
        </p>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="text-xl font-semibold tracking-tight">요약</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          {SUMMARY.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="text-xl font-semibold tracking-tight">경력</h2>
        <ol className="space-y-6">
          {CAREER.map((job) => (
            <li key={`${job.company}-${job.period}`} className="space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold">
                  {job.company}
                  <span className="ml-2 font-normal text-zinc-500">
                    {job.title}
                  </span>
                </h3>
                <span className="text-sm text-zinc-500">{job.period}</span>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {job.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="text-xl font-semibold tracking-tight">수상</h2>
        <ul className="space-y-1 text-sm">
          <li>
            제8회 K-디지털 트레이닝 해커톤 장려상(고용노동부장관상), 2026.09 —
            4인 팀 SAVERS Tech Lead, 본선 진출 20개 팀
          </li>
        </ul>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="text-xl font-semibold tracking-tight">특허</h2>
        <ul className="space-y-5">
          {PATENTS.map((patent) => (
            <li key={patent.title} className="space-y-1 text-sm">
              <div className="font-medium">{patent.title}</div>
              <div className="text-zinc-500">{patent.meta}</div>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {patent.registrations.map((registration) => (
                  <li key={registration.href}>
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
              </ul>
              <div className="text-zinc-500">{patent.note}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="text-xl font-semibold tracking-tight">교육 · 학력</h2>
        <ul className="space-y-1 text-sm">
          <li>코드잇 스프린트 AI 엔지니어 부트캠프 (K-DT 10기), 2026.02 ~ 2026.08 수료</li>
          <li>부산 게임 아카데미 프로그래밍 과정, 2008.02 ~ 2009.02</li>
          <li>동의대학교 게임공학 졸업, 2005.03 ~ 2010.03</li>
        </ul>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="text-xl font-semibold tracking-tight">기술 스택</h2>
        <dl className="space-y-3 text-sm">
          {SKILLS.map((skill) => (
            <div key={skill.label} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
              <dt className="font-medium text-zinc-500">{skill.label}</dt>
              <dd className="leading-relaxed">{skill.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="text-xl font-semibold tracking-tight">연락처</h2>
        <ul className="space-y-1 text-sm">
          <li>
            <a href="mailto:seenjeonga@gmail.com" className={LINK_CLASS}>
              seenjeonga@gmail.com
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Yopkigom"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              github.com/Yopkigom
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
