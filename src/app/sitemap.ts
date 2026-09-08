import type { MetadataRoute } from "next"
import { env } from "@/lib/env"

export const dynamic = "force-static"

/** Must match the canonical URLs — the export serves directory paths. */
const url = (path: string) => new URL(path, env.siteUrl).toString()

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: url("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: url("/privacy/"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/terms/"), lastModified, changeFrequency: "yearly", priority: 0.3 },
  ]
}
