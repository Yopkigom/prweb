import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deepDives } from "../../../content";
import { getAllProjects, getProjectBySlug } from "../../../lib/projects";
import {
  BUTTON_PRIMARY_CLASS,
  BUTTON_SECONDARY_CLASS,
  ResumeFoot,
  ResumeFrame,
  ResumeRow,
  ResumeSection,
  SERIF_HEADING_CLASS,
  StatTile,
  TAG_CLASS,
} from "../../../components/resume-layout";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (project === undefined) {
    notFound();
  }

  const hasLinks =
    project.video !== undefined ||
    project.diagram !== undefined ||
    project.repo !== undefined;

  const summaryRows = [
    { label: "문제", text: project.summary.problem },
    { label: "역할", text: project.summary.role },
    { label: "성과", text: project.summary.outcome },
  ] as const;

  const DeepDive = deepDives[project.deepDive];

  return (
    <article className="space-y-8">
      {/* L2: problem / role / outcome — the recruiter-facing layer */}
      <header className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
        <p className="text-lg text-zinc-600">{project.hook}</p>
        {project.period !== "" && (
          <p className="font-serif text-sm italic text-brand">{project.period}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className={TAG_CLASS}>
              {tag}
            </span>
          ))}
        </div>
        {hasLinks && (
          <div className="flex flex-wrap gap-3 pt-2">
            {project.repo !== undefined && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={BUTTON_PRIMARY_CLASS}
              >
                GitHub 저장소
              </a>
            )}
            {project.video !== undefined && (
              <a
                href={project.video}
                target="_blank"
                rel="noopener noreferrer"
                className={BUTTON_SECONDARY_CLASS}
              >
                ▶ 시연 영상
              </a>
            )}
            {project.diagram !== undefined && (
              <a
                href={project.diagram}
                target="_blank"
                rel="noopener noreferrer"
                className={BUTTON_SECONDARY_CLASS}
              >
                워크 다이어그램 (Figma)
              </a>
            )}
          </div>
        )}
      </header>

      <ResumeFrame>
        <ResumeSection
          en="Summary"
          ko="요약"
          caption={project.period !== "" ? project.period : project.tags[0] ?? ""}
        >
          {summaryRows.map((row, index) => (
            <ResumeRow key={row.label} label={<h2>{row.label}</h2>} index={index}>
              <p>{row.text}</p>
            </ResumeRow>
          ))}
        </ResumeSection>

        {project.metrics.length > 0 && (
          <section className="bg-brand px-6 py-6 text-white">
            <h2 className={`${SERIF_HEADING_CLASS} mb-5`}>Key Numbers</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
              {project.metrics.map((metric) => (
                <StatTile key={metric.label} value={metric.value} label={metric.label} />
              ))}
            </div>
          </section>
        )}

        <ResumeFoot left="신호정 / seenjeonga@gmail.com" right={project.title} />
      </ResumeFrame>

      {DeepDive !== undefined && (
        <section className="space-y-4 pt-4">
          <h2 className={`${SERIF_HEADING_CLASS} text-brand`}>
            Technical Deep Dive
          </h2>
          <div className="prose prose-zinc max-w-none prose-a:underline-offset-4 prose-headings:font-semibold">
            <DeepDive />
          </div>
        </section>
      )}
    </article>
  );
}
