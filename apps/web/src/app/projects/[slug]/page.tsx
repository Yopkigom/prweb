import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deepDives } from "../../../content";
import { getAllProjects, getProjectBySlug } from "../../../lib/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

const LINK_BUTTON_CLASS =
  "rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900 transition-colors";

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

  return (
    <article className="mx-auto max-w-3xl space-y-12">
      {/* L2: problem / role / outcome — the recruiter-facing layer */}
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          {project.hook}
        </p>
        {project.period !== "" && (
          <p className="text-sm text-zinc-500">{project.period}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-500">문제</h2>
          <p className="mt-2 text-sm">{project.summary.problem}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-500">역할</h2>
          <p className="mt-2 text-sm">{project.summary.role}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-500">성과</h2>
          <p className="mt-2 text-sm">{project.summary.outcome}</p>
        </div>
      </section>

      {project.metrics.length > 0 && (
        <section className="flex flex-wrap gap-8">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm text-zinc-500">{metric.label}</div>
            </div>
          ))}
        </section>
      )}

      {hasLinks && (
        <section className="flex flex-wrap gap-3">
          {project.repo !== undefined && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_BUTTON_CLASS}
            >
              GitHub 저장소
            </a>
          )}
          {project.video !== undefined && (
            <a
              href={project.video}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_BUTTON_CLASS}
            >
              ▶ 시연 영상
            </a>
          )}
          {project.diagram !== undefined && (
            <a
              href={project.diagram}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_BUTTON_CLASS}
            >
              워크 다이어그램 (Figma)
            </a>
          )}
        </section>
      )}

      {(() => {
        const DeepDive = deepDives[project.deepDive];
        if (DeepDive === undefined) {
          return null;
        }
        return (
          <section className="space-y-4 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold tracking-tight">
              Technical Deep Dive
            </h2>
            <div className="prose prose-zinc max-w-none dark:prose-invert prose-a:underline-offset-4">
              <DeepDive />
            </div>
          </section>
        );
      })()}
    </article>
  );
}
