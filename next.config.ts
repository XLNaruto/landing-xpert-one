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
  /* Deliberately NOT using experimental.inlineCss to clear the
     render-blocking-resources audit: React also writes the inlined CSS into
     the flight payload, so 82 KB of stylesheet landed in the document roughly
     three times over and the gzipped page went from 32 KB to 73 KB. Two
     cacheable, parallel, HTTP/2 stylesheet requests cost less than that. */
};

export default nextConfig;
