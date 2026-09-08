import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The site is deployed as static HTML to S3 + CloudFront, so the export is
     what `npm run build` must produce. Nothing that needs a Node runtime
     (Server Actions, route handlers, ISR) can live in this app. */
  output: "export",
  /* CloudFront serves /privacy/ as /privacy/index.html — without this the
     export emits /privacy.html and the directory URL 404s. */
  trailingSlash: true,
  /* No image optimizer in a static export. */
  images: { unoptimized: true },
};

export default nextConfig;
