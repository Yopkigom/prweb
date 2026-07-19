import projectsData from "../data/projects.json";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectSummary {
  problem: string;
  role: string;
  outcome: string;
}

export interface Project {
  slug: string;
  title: string;
  hook: string;
  tags: string[];
  period: string;
  featured: boolean;
  summary: ProjectSummary;
  metrics: ProjectMetric[];
  video?: string;
  diagram?: string;
  deepDive: string;
}

export function getAllProjects(): Project[] {
  return projectsData.projects as Project[];
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}
