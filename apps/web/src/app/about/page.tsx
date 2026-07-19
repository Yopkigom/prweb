import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

const PATENTS = [
  {
    label: "특허 (2018)",
    href: "http://doi.org/10.8080/1020180001302",
  },
  {
    label: "Moii",
    href: "https://doi.org/10.8080/1020240040821",
  },
  {
    label: "Moii (U.S.)",
    href: "https://patents.google.com/patent/US20240177389A1/en?oq=18%2F071%2C640",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          저는 신호정입니다.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          그리고 프로그래머입니다.
        </p>
      </header>

      <section className="space-y-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p>
          실용성과 성능을 중시하는 15년차 시니어 Unity 개발자입니다. 복잡한
          문제를 단순하게 풀어내는 구조 설계와 최적화에 강점을 가지고 있습니다.
          Unity3D와 C# 기반의 모바일 프로젝트를 중심으로 서비스 로직 설계 및
          구현, Video와 Audio 처리, Networking 등의 다양한 기술 스택을 실전에서
          경험하며 안정적이고 확장 가능한 시스템을 구현해 왔습니다.
        </p>
        <p>
          특히 실시간 처리, 버퍼링 최적화, 복잡한 아바타 조합 로직 등 단위
          기술부터 아키텍처 전반까지 폭넓은 기술 영역에서 팀의 실질적인 문제
          해결을 이끌어 왔습니다. 다양한 조건의 모바일 환경에서의 개발 경험이
          서비스 전반의 운영 효율에 큰 기여를 하는 것도 빼놓을 수 없겠네요.
        </p>
        <p>
          저는 기술적 해결에 그치지 않고, 팀원들과의 지식 공유와 논의를 통해 더
          나은 방향을 함께 모색하는 것을 중요하게 생각합니다. 목표를 설정할 때
          저는 항상 팀원들에게 이 목표를 달성함으로써 우리가 얻을 수 있는 성취에
          대해 설명합니다. 그리고 목표에 도달했을 때, 팀원들과 함께 얻은 성취와
          반성을 재공유합니다.
        </p>
        <p>
          함께 성장할 수 있는 팀과 프로젝트에서, 실질적인 성과로 보답하겠습니다.
        </p>
      </section>

      <section className="space-y-3 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="text-xl font-semibold tracking-tight">직무 특허</h2>
        <ul className="space-y-1 text-sm">
          {PATENTS.map((patent) => (
            <li key={patent.href}>
              <a
                href={patent.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {patent.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
