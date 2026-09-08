import type { MetadataRoute } from "next"
import { env } from "@/lib/env"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  /* The dev deploy is the same site on another host. Crawling it would put a
     duplicate of every page in the index competing with production, so it is
     closed off entirely rather than merely de-prioritised. */
  if (!env.isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] }
  }

  return {
    /* /thank-you/ is a post-submit page with no standalone value — keeping it
       out of the index stops it competing with the landing page. */
    rules: [{ userAgent: "*", allow: "/", disallow: "/thank-you/" }],
    sitemap: `${env.siteUrl}/sitemap.xml`,
    host: env.siteUrl,
  }
}
