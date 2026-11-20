import type { MetadataRoute } from "next"
import { env } from "@/lib/env"
import { loadLegalDocument } from "@/lib/legal"

export const dynamic = "force-static"

/** Must match the canonical URLs — the export serves directory paths. */
const url = (path: string) => new URL(path, env.siteUrl).toString()

/** A published document's own date; the build's date otherwise. */
function modified(iso: string | undefined, fallback: Date): Date {
  const date = iso ? new Date(iso) : null
  return date && !Number.isNaN(date.getTime()) ? date : fallback
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const [privacy, terms] = await Promise.all([
    loadLegalDocument("privacy-policy"),
    loadLegalDocument("terms-of-service"),
  ])

  return [
    { url: url("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    { url: url("/privacy/"), lastModified: modified(privacy?.updatedAt, lastModified), changeFrequency: "yearly", priority: 0.3 },
    { url: url("/terms/"), lastModified: modified(terms?.updatedAt, lastModified), changeFrequency: "yearly", priority: 0.3 },
  ]
}
