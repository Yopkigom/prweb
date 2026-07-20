import type { MetadataRoute } from "next";
import { getAllProjects } from "../lib/projects";

export const dynamic = "force-static";

const SITE_URL = "https://prweb.yopkigom.workers.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages = ["", "/projects/", "/about/", "/ask/"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
  }));

  const projectPages = getAllProjects().map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}/`,
    lastModified,
  }));

  return [...staticPages, ...projectPages];
}
