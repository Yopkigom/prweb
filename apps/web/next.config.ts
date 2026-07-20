import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: emits plain HTML/CSS/JS into `out/`,
  // served by a Cloudflare Worker as static assets.
  output: "export",
  trailingSlash: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    // No image optimization server in static export.
    unoptimized: true,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
