import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects, type Project } from "../../lib/projects";
import {
  CREAM_FRAME_CLASS,
  SHEET_CLASS,
  SHEET_HEAD_CLASS,
  SHEET_SUBTITLE_CLASS,
  SHEET_TITLE_CLASS,
} from "../../components/resume-layout";

export const metadata: Metadata = {
  title: "Projects",
};

// Same layout the home page used for its project list: a blue sheet with one
// cream-framed list per group. Rows link to the detail page.
export default function ProjectsPage() {
  const projects = getAllProjects();
  const featured = projects.filter((project) => project.featured);
  const others = projects.filter((project) => !project.featured);

  return (
    <section className={SHEET_CLASS}>
      <div className={`${SHEET_HEAD_CLASS} mb-8`}>
        <h2 className={SHEET_TITLE_CLASS}>
          Projects
          <span className={SHEET_SUBTITLE_CLASS}>주요 프로젝트</span>
        </h2>
        <p className="text-sm leading-relaxed sm:text-right">
          <b>문제 · 역할 · 성과와 기술 상세.</b>
          <br />
          항목을 누르면 상세 페이지로 이동합니다.
        </p>
      </div>
      <ProjectList projects={featured} />

      <div className={`${SHEET_HEAD_CLASS} mt-12 mb-8`}>
        <h2 className={SHEET_TITLE_CLASS}>
          More
          <span className={SHEET_SUBTITLE_CLASS}>그 외 프로젝트와 글</span>
        </h2>
        <p className="text-sm leading-relaxed sm:text-right">
          모델 경량화 실험, 챗봇 설계기, 팀장 회고, 작업 방식.
        </p>
      </div>
      <ProjectList projects={others} />
    </section>
  );
}

type ProjectListProps = {
  projects: Project[];
};

function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className={CREAM_FRAME_CLASS}>
      <ul className="divide-y divide-cream bg-white text-ink">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}/`}
              className="group grid gap-2 px-5 py-4 transition-colors hover:bg-cream/50 sm:grid-cols-[16rem_minmax(0,1fr)] sm:gap-6"
            >
              <div>
                <h3 className="font-bold leading-snug group-hover:underline">{project.title}</h3>
                {project.period !== "" && (
                  <div className="mt-1 font-serif text-xs italic text-brand">{project.period}</div>
                )}
              </div>
              <div>
                <p className="text-sm leading-relaxed text-ink/80">{project.hook}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-sm border border-brand/40 px-2 py-0.5 text-xs text-brand">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
