import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "../../lib/projects";
import {
  BUTTON_PRIMARY_CLASS,
  ResumeFoot,
  ResumeFrame,
  ResumeRow,
  ResumeSection,
  TAG_CLASS,
} from "../../components/resume-layout";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const featured = projects.filter((project) => project.featured);
  const others = projects.filter((project) => !project.featured);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            온디바이스 AI, 생성 AI 제품 테크리드, 실시간 클라이언트. 항목을 누르면 문제 · 역할 · 성과와
            기술 상세로 이어집니다.
          </p>
        </div>
        <Link href="/ask/" className={BUTTON_PRIMARY_CLASS}>
          Ask AI에게 질문하기
        </Link>
      </header>

      <ResumeFrame>
        <ResumeSection en="Featured" ko="주요 프로젝트" caption={`${featured.length}건`}>
          {featured.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index} />
          ))}
        </ResumeSection>

        <ResumeSection en="More" ko="그 외 프로젝트와 글" caption={`${others.length}건`}>
          {others.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index} />
          ))}
        </ResumeSection>

        <ResumeFoot left="신호정 / seenjeonga@gmail.com" right={`${projects.length}건`} />
      </ResumeFrame>
    </div>
  );
}

type ProjectRowProps = {
  project: ReturnType<typeof getAllProjects>[number];
  index: number;
};

function ProjectRow({ project, index }: ProjectRowProps) {
  const href = `/projects/${project.slug}/`;
  return (
    <ResumeRow
      label={
        <Link href={href} className="underline-offset-4 hover:underline">
          {project.title}
        </Link>
      }
      date={project.period !== "" ? project.period : undefined}
      index={index}
    >
      <p>{project.hook}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className={TAG_CLASS}>
            {tag}
          </span>
        ))}
        <Link
          href={href}
          aria-label={`${project.title} 상세 보기`}
          className="ml-auto font-serif text-xs italic text-brand underline underline-offset-4 dark:text-blue-300"
        >
          상세 보기
        </Link>
      </div>
    </ResumeRow>
  );
}
