# PR 홈페이지 구현 계획 (확정본, 2026-07-19)

## 목표

Unity 15년 + 팀장 경력 + K-DT AI 역량을 어필하는 개인 PR 홈페이지.
타깃 독자: 인사담당자(L1·L2), 기술 면접관(L3).

## 확정 결정

| 항목 | 결정 |
|---|---|
| 배포 | Next.js **static export** + 챗봇 전용 Worker 분리 (Cloudflare Pages 미사용) |
| 도메인 | 무료 `*.yopkigom.workers.dev` (site: `prweb.*`, chat: `prweb-chat.*`) |
| 챗봇 LLM | **Workers AI 1차**, NVIDIA Build API 폴백. 단, 도메인 밖 + PR 범위 질문은 NVIDIA 직행 |
| CI/CD | GitHub Actions → `wrangler-action` (main push 시 두 Worker 배포) |
| 챗봇 컨텍스트 | static JSON 주입 (초기 RAG 없음, 향후 Supabase Vector) |
| 예산 | 현재 구성 0원/년 (도메인 미구입) |

## 3단 깊이 구조

- **L1 (직관적·쉬움)**: 메인 카드 — 한 줄 훅 + 태그 3개
- **L2 (구체적·간략)**: 상세 페이지 상단 — 문제 / 역할 / 성과(수치) 3블록
- **L3 (자세·세밀)**: 같은 페이지 하단 Technical Deep Dive (MDX)

## 챗봇 라우팅

```
질문 → 소형 모델 분류 (llama-3.2-3b, 실패 시 portfolio로 fail-open)
  ├─ portfolio   → Workers AI 70B (무료 일일 한도 보존 우선) → 실패 시 NVIDIA
  ├─ pr_general  → NVIDIA 70B (크레딧 사용) → 실패 시 Workers AI
  └─ off_limits  → 정적 거절 응답 (개인 신상 조사 차단)
둘 다 실패 → 정적 안내 메시지
```

## 리포 구조

```
apps/web/          Next.js 16 + TS + Tailwind v4, output: 'export' → out/
  src/data/projects.json   L1·L2 메타 (콘텐츠 스키마)
  src/lib/projects.ts      타입 + 조회 헬퍼
  wrangler.jsonc           assets-only Worker "prweb"
apps/chat-worker/  Hono + Workers AI 바인딩, Worker "prweb-chat"
  src/context.json         챗봇 주입용 프로필 요약
.github/workflows/deploy.yml
```

## 단계별 진행 상황

- [x] **0. 스캐폴드**: 리포 구조, Next.js static export, 페이지 라우트, 챗봇 Worker 스켈레톤, CI 워크플로
- [x] **1. 콘텐츠**: 노션 원문 복원(`docs/content-source/`), `projects.json` L1/L2 반영, About 페이지, 챗봇 `context.json` (남은 것: L3 MDX 딥다이브)
- [x] **2. 페이지 완성**: MDX 딥다이브 6편 렌더링, 라이트/다크/시스템 테마 토글
- [x] **3. 배포**: GitHub 리포(`Yopkigom/prweb`, public), 서브도메인 `yopkigom`, CI 시크릿 등록, 자동 배포 green 확인 (2026-07-20)
- [x] **4. 챗봇 완성**: Ask AI 채팅 UI(스트리밍·중단 버튼·마크다운 렌더링·후속 질문 추천), Turnstile(위젯 `prweb-ask-ai`) + Durable Object rate limit(10회/분), `NVIDIA_API_KEY` 등록
- [x] **5. 마감**: OG 이미지, SEO 메타, sitemap/robots, Cloudflare Web Analytics, "Ask AI 제작기" 딥다이브 글, 연락처
- [x] **B3. E2E**: Playwright 6개 시나리오(내비게이션·프로젝트 상세·404·테마 토글·Ask 레이아웃), CI에서 빌드 후 배포 전 게이트
- [x] **B4. 성능/접근성 점검**: Lighthouse 전 페이지 accessibility 100, performance 97~100, SEO 100 달성

### 운영 기록 (2026-07-20)

- NVIDIA `meta/llama-3.3-70b-instruct`는 무료 티어에서 응답 없이 무한 대기 → `nvidia/llama-3.3-nemotron-super-49b-v1.5`로 교체 (엣지 실측 0.6초)
- wrangler-action 기본 wrangler 3.90은 assets 전용 Worker 미지원 → `wranglerVersion: 4.112.0` 고정
- Workers `unsafe` ratelimit 바인딩과 인메모리 카운터 모두 실효 없음(실측: isolate 분산) → **Durable Object(SQLite) 슬라이딩 윈도우**로 확정, Turnstile이 1차 방어선
- Turnstile: 매 메시지마다 단일 사용 토큰 검증 (siteverify), 위젯 도메인: workers.dev + localhost

### 운영 기록 (2026-07-20, 계속)

- 챗봇 세로 긴 뷰포트 스크롤 버그: `flex-1` 컨테이너에 `min-h-0` 누락이 원인 (flex item의 기본 `min-height: auto`가 내용 크기로 고정되어 overflow가 무시됨). `min-h-0` 추가 + `h-[min(70dvh,720px)]`로 해결
- 다크모드: Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *))` + next-themes(`attribute="class"`)로 전환, 기존 `prefers-color-scheme` 미디어쿼리 방식에서 클래스 기반으로 변경
- Lighthouse 접근성 100 달성 경로: 헤더 로고 링크 터치 타겟 확대(`-m-2 p-2`), 챗봇 캡션 텍스트 대비(`zinc-400`→`zinc-500`), YouTube 임베드를 `youtube-nocookie.com`으로 전환(서드파티 쿠키 이슈 완화)
- 로컬 Lighthouse 측정 시 Cloudflare beacon이 CORS 오류를 남기는 것은 127.0.0.1 도메인이 비콘 토큰 등록 도메인과 달라 발생하는 로컬 전용 아티팩트 — 프로덕션 도메인에서는 발생하지 않음(확인됨)
- `pkill -f "<pattern>"`이 자기 자신의 명령행과 매칭되어 즉시 종료되는 함정 발견 → 포트 기준 `fuser -k <port>/tcp`로 대체

## 운영 시 주의

- NVIDIA Build API: 기본 1,000 크레딧(소진형) + 40 RPM → 남용 방지 없이는 수일 내 소진 가능. Turnstile/rate limit 적용 전에는 챗봇 공개 금지.
- Workers AI 무료 티어: 일일 한도(neurons) 존재 → 초과 시 NVIDIA 폴백 경로가 자동으로 흡수.
- `next-on-pages`는 deprecated — Pages로 회귀하지 말 것.
