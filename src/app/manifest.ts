import type { MetadataRoute } from "next"
import { site } from "@/content/site"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.seoDescription,
    start_url: "/",
    display: "browser",
    background_color: "#f8fafc",
    theme_color: "#f8fafc",
    icons: [
      { src: "/media/logos/xo-logo.png", sizes: "100x100", type: "image/png" },
    ],
  }
}
