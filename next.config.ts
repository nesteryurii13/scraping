import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export to `out/` — deployed to Netlify as plain files.
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
