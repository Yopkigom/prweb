# 유지보수 가이드

이 문서는 향후 이 리포로 돌아왔을 때(자신이든, 다른 세션의 Claude든) 막힘없이 작업을 이어갈 수 있도록 만든 운영 매뉴얼입니다. 아키텍처와 설계 이유는 [PLAN.md](./PLAN.md)와 [README.md](../README.md)를 참고하고, 이 문서는 "실제로 손을 댈 때 무엇을 어떻게 하는가"에 집중합니다.

## 1. 리포/서비스 지도

| 이름 | 위치 | 배포 대상 | 역할 |
|---|---|---|---|
| `web` | `apps/web/` | Worker `prweb` → `prweb.yopkigom.workers.dev` | Next.js static export, 콘텐츠 사이트 |
| `chat-worker` | `apps/chat-worker/` | Worker `prweb-chat` → `prweb-chat.yopkigom.workers.dev` | 챗봇 API (Hono, SSE) |

- GitHub: `Yopkigom/prweb` (public)
- Cloudflare 계정: `Seenjeonga@gmail.com's Account`
- 배포: **main 브랜치 push → GitHub Actions(`deploy.yml`)가 두 Worker를 자동 배포**. 수동 배포는 각 앱 디렉터리에서 `npx wrangler deploy`.

## 2. 콘텐츠 수정하기

### 프로젝트 카드/요약(L1·L2) 수정

`apps/web/src/data/projects.json` 편집. 스키마:

```jsonc
{
  "slug": "url-slug",
  "title": "카드 제목",
  "hook": "L1 한 줄 훅",
  "tags": ["태그1", "태그2"],
  "featured": true,          // 메인 페이지 노출 여부
  "summary": { "problem": "...", "role": "...", "outcome": "..." },  // L2
  "metrics": [{ "label": "지표명", "value": "수치" }],
  "video": "https://...",     // 선택
  "diagram": "https://...",   // 선택
  "deepDive": "slug"           // src/content/index.ts의 키와 일치해야 함
}
```

### 딥다이브(L3) 수정/추가

1. `apps/web/src/content/projects/<slug>.mdx` 작성 (또는 기존 파일 수정)
2. `apps/web/src/content/index.ts`에 import + `deepDives` 맵 등록
3. `projects.json`에 해당 프로젝트가 없다면 항목 추가, `deepDive` 필드를 slug와 일치시킬 것

새 프로젝트를 완전히 추가하는 순서: ① `projects.json`에 항목 추가 → ② `.mdx` 작성 → ③ `content/index.ts`에 등록 → ④ `npm run build`로 정적 생성 확인 → ⑤ `npm run test:e2e`로 회귀 확인 → **⑥ `apps/chat-worker/src/context.json`에 같은 프로젝트를 추가**(누락 시 챗봇이 신규 프로젝트를 모른다).

`.mdx`가 아직 없는 프로젝트는 `deepDive` 값을 slug로 두되 `content/index.ts`에 등록하지 않으면 L1·L2만 렌더링된다. 공개 저장소가 있으면 `repo` 필드에 URL을 넣는다(상세 페이지에 "GitHub 저장소" 버튼).

YouTube 임베드는 `youtube.com`이 아니라 **`youtube-nocookie.com`**을 쓸 것 (서드파티 쿠키 이슈 완화, Lighthouse best-practices 감점 방지).

### 챗봇이 아는 내용 갱신

`apps/chat-worker/src/context.json`을 편집하고 재배포. 이 파일 전체가 시스템 프롬프트에 그대로 주입되므로, 사실관계가 바뀌면(이직, 새 프로젝트 등) 반드시 이 파일도 함께 갱신해야 챗봇이 최신 정보로 답합니다. **길이 주의**: 렌더링된 프롬프트가 약 7K자를 넘으면 70B fp8 모델이 무의미한 텍스트를 뱉는다(5절 참고). 항목을 추가하면 다른 항목을 줄인다.

### 홈 (이력서 1~3쪽 양식)

`apps/web/src/app/page.tsx`는 디자인 이력서의 1쪽(파란 포스터: 제목·사진·Applying For·Contact·Introduction·Experience·Awards·AI Projects·Tech Stack) → 2쪽(Overview 숫자 타일) → 3쪽(Showcase 저장소 카드 + 시연 영상) 순서를 그대로 따른다. 각 블록은 파일 상단의 데이터 배열(`EXPERIENCE`, `AWARDS`, `AI_PROJECTS`, `STACK`, `OVERVIEW`, `DEMO_VIDEOS`, `SHOWCASE_REPO`)만 고친다. 수치는 마스터 이력서와 같이 바꾼다.

- 사진은 `public/photo.jpg`(웹용 PDF와 같은 사진, CSS로 흑백 처리), Showcase 썸네일은 `public/showcase-ad.jpg`.
- `DEMO_VIDEOS`(YouTube ID·제목·설명·연결 프로젝트 slug)의 임베드는 `youtube-nocookie.com`. 같은 영상을 프로젝트 카드의 `video` 필드와 `chat-worker/src/context.json`의 `links.demo_videos`에도 함께 넣는다.
- 공용 레이아웃(`ResumeFrame`/`ResumeSection`/`ResumeRow`/`ResumeFoot`/`StatTile`, 버튼·태그 클래스)은 `apps/web/src/components/resume-layout.tsx`. 색 토큰(`brand`, `brand-dark`, `brand-deep`, `cream`, `ink`)은 `globals.css`.
- Projects 목록(`projects/page.tsx`)은 `featured` 여부로 Featured / More 두 절로 나뉘고, 상세(`projects/[slug]/page.tsx`)는 문제·역할·성과 띠 + Key Numbers 타일 + Technical Deep Dive 순서다.

### About / 연락처

`apps/web/src/app/about/page.tsx`, 푸터는 `apps/web/src/app/layout.tsx`. About은 디자인 이력서와 같은
양식(좌측 파란 띠 라벨 + 우측 흰색·크림 교대 상자)이며, 상단 데이터 배열(`SUMMARY`, `CAREER`, …)만 고치면
렌더링은 `ResumeSection` / `ResumeRow`가 처리한다. 수치는 마스터 이력서와 같이 바꾼다.

### 이력서 PDF 다운로드 (`/resume.pdf`)

- About 우상단 버튼이 `public/resume.pdf`를 `신호정_웹_이력서.pdf` 이름으로 내려준다.
- 원본은 job-hunt 저장소에서 `python -X utf8 resume/design/build.py --web`으로 만든
  `resume/derived/신호정_웹_이력서.pdf`(휴대폰 번호 제외, 사진 유지). 이력서가 바뀌면 다시 빌드해서
  `public/resume.pdf`로 덮어쓴다. **제출용(`신호정_이력서.pdf`, 휴대폰 포함)을 올리지 않는다.**
- 검색 노출 차단: `public/_headers`가 `X-Robots-Tag: noindex, nofollow`를 붙인다. `robots.ts`에서 **disallow하지
  않는다**(크롤러가 파일을 가져와야 noindex 헤더를 읽는다). 접근 통제는 공개 링크뿐이다.
- E2E(`e2e/site.spec.ts`)가 버튼·`download` 속성·PDF 200 응답을 확인한다.

## 3. 로컬 개발

```bash
# 사이트
cd apps/web && npm install && npm run dev

# 챗봇 Worker (Workers AI는 원격 바인딩으로 실제 호출됨 — 과금은 없지만 무료 한도 소모)
cd apps/chat-worker && npm install && npm run dev
```

챗봇을 로컬 UI에서 테스트하려면 `chat-client.tsx`의 `CHAT_ENDPOINT`를 로컬 Worker 주소로 임시 변경해야 합니다(현재는 프로덕션 Worker URL이 하드코딩되어 있음). Turnstile 위젯은 `localhost`/`127.0.0.1` 도메인이 이미 허용 목록에 있어 로컬에서도 정상 렌더링됩니다.

## 4. 배포 전 체크리스트 (CI가 자동으로 강제함)

`apps/web`을 건드렸다면 push 전에:

```bash
cd apps/web
npm run lint
npm run build
npm run test:e2e   # playwright, out/ 빌드 결과에 대해 실행됨
```

`apps/chat-worker`를 건드렸다면:

```bash
cd apps/chat-worker
npm run typecheck
```

GitHub Actions(`deploy.yml`)가 lint → build → **E2E(웹만)** → deploy 순으로 실행하며, E2E가 실패하면 배포되지 않습니다. 로컬에서 위 명령이 통과하면 CI도 통과합니다.

### E2E 테스트 (`apps/web/e2e/site.spec.ts`)

정적 빌드(`out/`)를 `serve`로 띄워 그 위에서 실행합니다. 현재 커버리지: 홈 히어로, 내비게이션 전체 경로, 프로젝트 상세(L2/L3 섹션 존재), 404, 테마 토글(라이트/다크 전환·새로고침 후 유지), Ask 페이지 레이아웃(가로 스크롤 없음, 입력창 활성화 로직).

**의도적으로 테스트하지 않는 것**: 실제 챗봇 메시지 왕복(Turnstile 챌린지 + 실제 LLM 호출). CI에서 실행할 때마다 프로덕션 NVIDIA 크레딧/Workers AI 무료 한도를 소모하고, 헤드리스 브라우저의 Turnstile 통과 여부가 불안정해 플레이키해지기 때문입니다. UI 구조(입력창, 버튼 활성화 조건)만 검증합니다.

### Lighthouse (수동, 정기 점검용)

CI에는 없음 — 필요할 때 로컬에서:

```bash
cd apps/web && npm run build
npx serve out -l 4173 &
CHROME_PATH=$(find ~/.cache/ms-playwright -name chrome -type f | head -1) \
  npx lighthouse http://127.0.0.1:4173/ --chrome-flags="--headless=new --no-sandbox"
```

마지막 측정(2026-07-20): 전 페이지 accessibility 100 / performance 97~100 / SEO 100 / best-practices 92~96 (남은 감점은 로컬 테스트 환경의 CORS 아티팩트와 YouTube 임베드의 불가피한 쿠키 이슈 — 아래 5절 참고).

## 5. 알려진 함정 (다시 겪지 않도록)

| 증상 | 원인 | 대응 |
|---|---|---|
| NVIDIA 응답이 60초 넘게 안 옴 | 모델별로 무료 티어 대기열 편차가 큼. `llama-3.3-70b-instruct`는 무한 대기 확인됨 | `nvidia/llama-3.3-nemotron-super-49b-v1.5` 사용 중. 모델 교체 시 반드시 엣지에서 직접 격리 테스트(무인증 GET→POST→인증 POST) 후 반영 |
| Workers `unsafe` ratelimit 바인딩이 요청을 거부 안 함 | 실측 결과 40회 연타까지 전부 통과 — 신뢰 금지 | Rate limit은 **Durable Object**(`RateLimiterDO`, SQLite 슬라이딩 윈도우)로 구현되어 있음. 새 rate limit이 필요해도 이 패턴 재사용 |
| 배포 직후 새 기능이 반영 안 된 것처럼 보임 | Cloudflare 엣지 전파 지연 (수십 초) | 배포 직후 검증은 반드시 30~60초 대기 후 재확인. 즉시 검증은 거짓 음성을 만듦 |
| `pkill -f "<패턴>"`이 즉시 셸을 죽임 | 패턴이 pkill을 실행 중인 셸 자신의 명령행과 매칭됨 | 포트로 죽일 것: `fuser -k <port>/tcp` |
| 로컬 Lighthouse 실행 후 리포에 `C:\Users\...` 폴더가 생김 | WSL에서 Chrome이 임시 프로필 경로를 잘못 해석해 cwd에 리터럴 폴더 생성 | `.gitignore`에 `C:*` 추가되어 있음. 커밋 전 `git status`로 항상 확인 |
| CI 배포 실패: `Missing entry-point` | `wrangler-action`의 기본 wrangler(3.90)가 assets 전용 Worker 설정을 인식 못함 | `deploy.yml`에 `wranglerVersion: "4.112.0"` 고정되어 있음. 건드리지 말 것 |
| Ask 페이지가 세로로 긴 화면에서 스크롤이 깨짐 | flex 자식의 기본 `min-height: auto`가 overflow를 무시함 | 스크롤 가능한 컨테이너에는 항상 `min-h-0` + `overflow-y-auto`를 함께 줄 것 |
| 챗봇이 영어 단어 뭉치(무의미 텍스트)를 반복 출력 | 시스템 프롬프트가 너무 길어짐(2026-09-07, `context.json` 20KB 들여쓰기 JSON 주입 시 Workers AI 70B fp8-fast가 출력 붕괴) | `context.json`은 렌더링 결과 **약 7K자 이하**로 유지. `index.ts`의 `renderProfile`이 JSON 대신 압축 텍스트로 주입하며, 프로필을 늘릴 때는 같은 함수로 길이를 먼저 잰다 |

## 6. 비용/한도 모니터링

- **NVIDIA Build API**: 기본 크레딧 소진형(요청 성격상 `pr_general` 라우트에서만 소모). [build.nvidia.com](https://build.nvidia.com)에서 잔여 크레딧 확인
- **Workers AI**: 무료 일일 한도 존재. 초과 시 코드상 NVIDIA로 자동 폴백되므로 서비스는 끊기지 않음
- **Turnstile + Durable Object**: 메시지당 단일 사용 토큰 + IP당 10회/분으로 남용 방지. 한도를 조정하려면 `apps/chat-worker/src/index.ts`의 `RATE_LIMIT_MAX_REQUESTS`/`RATE_LIMIT_WINDOW_MS`
- 운영비는 설계상 0원/년 — 위 한도를 벗어나는 트래픽이 발생하면 먼저 원인(봇/크롤러)을 파악할 것, 유료 전환은 최후 수단

## 7. 시크릿 목록

| 이름 | 위치 | 용도 |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | GitHub Actions secret | CI 배포 |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions secret | CI 배포 |
| `NVIDIA_API_KEY` | `wrangler secret` (chat-worker) | NVIDIA Build API 인증 |
| `TURNSTILE_SECRET` | `wrangler secret` (chat-worker) | Turnstile siteverify |

로테이션 시: GitHub는 리포 Settings → Secrets, Worker는 해당 앱 디렉터리에서 `npx wrangler secret put <이름>`.

## 8. 로드맵

`PLAN.md`의 단계별 계획은 5단계(마감)까지 완료됐고, 2026-09에 콘텐츠를 마스터 이력서 기준으로 재정렬했습니다(About 리라이트, AI 제품·온디바이스 프로젝트 카드 4건 추가, 챗봇 컨텍스트 재작성, 특허 링크를 등록번호 기준으로 교체). 후속 후보:

- **딥다이브(L3) 보강**: 2026-09에 추가한 4건(광고 소재 생성, SAVERS, Unity 온디바이스 RAG, 모델 경량화)은 현재 L1·L2만 있음. 순서는 모델 경량화 → 광고 소재 생성 → SAVERS → RAG(실측 수치 정리 후)
- **개발 운영 체계 에세이**: 개인 프로젝트의 계획 게이트(`CLAUDE.md` + `PROJECT_PLAN.md`)와 두 팀의 `AGENTS.md` 근거 등급 운영을 한 편으로
- **Projects 그룹 재편**: `category` 필드 + 목록 컴포넌트 (On-Device / AI Product / Realtime Audio / Production Unity / Engineering Notes)
- **브라우저 온디바이스 데모**: transformers.js(WebGPU)로 방문자 브라우저에서 소형 모델 추론을 직접 체험시키는 섹션
- **RAG 전환**: 딥다이브가 10편 이상으로 늘어나면 `context.json` 단순 주입 대신 Supabase Vector 또는 Cloudflare Vectorize 검토
- **다국어(i18n)**: 해외/외국계 지원 시점에
