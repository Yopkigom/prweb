import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // resume.pdf stays crawlable on purpose: crawlers must fetch it to see the
    // X-Robots-Tag: noindex header set in public/_headers. A disallow here would
    // hide that header and let the bare URL get indexed if linked externally.
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://prweb.yopkigom.workers.dev/sitemap.xml",
  };
}
