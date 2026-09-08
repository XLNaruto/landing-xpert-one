import type { Metadata } from "next"
import { site } from "@/content/site"
import { env } from "@/lib/env"

/**
 * The export uses `trailingSlash: true`, so every canonical and sitemap URL
 * must carry the slash — otherwise the URL we advertise is a redirect to the
 * one that actually serves the page.
 */
export function canonicalPath(path: string): string {
  if (path === "/") return "/"
  return path.endsWith("/") ? path : `${path}/`
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.seoDescription,
  applicationName: site.name,
  authors: [{ name: site.company, url: site.companyUrl }],
  creator: site.company,
  publisher: site.company,
  category: "technology",
  keywords: [
    "HR software",
    "employee management",
    "attendance management",
    "face recognition attendance",
    "payroll software India",
    "PF ESIC PT LWF",
    "XpertLab",
  ],
  /* Inherited by any route that doesn't call pageMetadata. */
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    url: env.siteUrl,
    locale: "en_IN",
    title: `${site.name} — ${site.tagline}`,
    description: site.seoDescription,
  },
  // Social images come from app/opengraph-image.tsx (file convention).
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.seoDescription,
  },
  icons: {
    icon: [{ url: "/media/logos/xo-logo.png", type: "image/png", sizes: "100x100" }],
    shortcut: "/media/logos/xo-logo.png",
    apple: "/media/logos/xo-logo.png",
  },
  /* Stops iOS Safari turning stray numbers in the copy into tel: links. */
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
  const canonical = canonicalPath(path)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: new URL(canonical, env.siteUrl).toString(),
    },
    twitter: { title: `${title} · ${site.name}`, description },
  }
}
