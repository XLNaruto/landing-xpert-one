import type { MetadataRoute } from "next"
import { env } from "@/lib/env"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: env.siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${env.siteUrl}/privacy`, lastModified, priority: 0.3 },
    { url: `${env.siteUrl}/terms`, lastModified, priority: 0.3 },
  ]
}
