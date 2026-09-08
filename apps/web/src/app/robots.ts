import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // resume.pdf is public by link only; public/_headers also sets X-Robots-Tag: noindex.
    rules: { userAgent: "*", allow: "/", disallow: "/resume.pdf" },
    sitemap: "https://prweb.yopkigom.workers.dev/sitemap.xml",
  };
}
