import type { Viewport } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@/components/analytics"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { HashScroll } from "@/components/layout/hash-scroll"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { JsonLd } from "@/components/seo/json-ld"
import { defaultMetadata } from "@/lib/seo"
import { graph, organizationSchema, websiteSchema } from "@/lib/structured-data"
import "./globals.css"

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata = defaultMetadata

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${sans.variable} h-full scroll-smooth antialiased`}
    >
      {/* Browser extensions (Grammarly and friends) stamp their own
          `data-*` attributes onto <body> before React hydrates, which reads
          as a hydration mismatch. This suppresses the warning for <body>'s
          own attributes only — children still hydrate strictly. */}
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        {/* Site-wide identity: who publishes this and what the site is. Page
            level schema (the product, the FAQ) is added per route. */}
        <JsonLd data={graph(organizationSchema, websiteSchema)} />
        <HashScroll />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  )
}
