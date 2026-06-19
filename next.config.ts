import type { NextConfig } from "next";

// Static export for GitHub Pages. The site is served from
// https://muhfauziazhar.github.io/job-aggregator, so in production all asset
// and route paths must be prefixed with /job-aggregator. In dev we serve from
// the root so `next dev` works normally.
const repo = "job-aggregator";
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true,
  images: {
    // GitHub Pages has no image optimization server.
    unoptimized: true,
  },
  // Exposed to the client so fetches for /data/*.json resolve under basePath.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
