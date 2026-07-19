import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: emits plain HTML/CSS/JS into `out/`,
  // served by a Cloudflare Worker as static assets.
  output: "export",
  trailingSlash: true,
  images: {
    // No image optimization server in static export.
    unoptimized: true,
  },
};

export default nextConfig;
