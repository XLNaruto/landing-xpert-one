import type { Metadata } from "next"
import { site } from "@/content/site"
import { env } from "@/lib/env"

export const defaultMetadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "HR software",
    "employee management",
    "attendance management",
    "face recognition attendance",
    "payroll software India",
    "PF ESIC PT LWF",
    "XpertLab",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    url: env.siteUrl,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  // Social images come from app/opengraph-image.tsx (file convention).
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  icons: {
    icon: [{ url: "/media/logos/xo-logo.png", type: "image/png", sizes: "100x100" }],
    shortcut: "/media/logos/xo-logo.png",
    apple: "/media/logos/xo-logo.png",
  },
  robots: { index: true, follow: true },
}

/** Per-page metadata: title + description only, everything else inherited. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: new URL(path, env.siteUrl).toString(),
    },
    twitter: { title: `${title} · ${site.name}`, description },
  }
}
