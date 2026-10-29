import type { Viewport } from "next"
import type { ReactNode } from "react"
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@/components/analytics"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { HashScroll } from "@/components/layout/hash-scroll"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { ScrollProgress } from "@/components/motion/scroll-progress"
import { SmoothScroll } from "@/components/motion/smooth-scroll"
import { JsonLd } from "@/components/seo/json-ld"
import { defaultMetadata } from "@/lib/seo"
import { themeScript } from "@/lib/theme"
import { graph, organizationSchema, websiteSchema } from "@/lib/structured-data"
import "./globals.css"

/* Two faces: a warm, open sans for reading, and a characterful grotesque
   with optical sizing for headings — the contrast between them is what keeps
   the page from reading as a plain template. */
const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})
const heading = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
})

export const metadata = defaultMetadata

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  colorScheme: "light dark",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${sans.variable} ${heading.variable} h-full antialiased`}
      /* The theme script below sets `class="dark"` and `color-scheme` on
         <html> before hydration, so its attributes differ from the server's
         by design. */
      suppressHydrationWarning
    >
      <head>
        {/* Light, dark or the OS setting, applied before first paint so a
            dark-mode reader never sees a white flash. A raw blocking script,
            not next/script: `beforeInteractive` is queued until the Next
            runtime loads, which is after the first paint. See lib/theme.ts. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Browser extensions (Grammarly and friends) stamp their own
          `data-*` attributes onto <body> before React hydrates, which reads
          as a hydration mismatch. This suppresses the warning for <body>'s
          own attributes only — children still hydrate strictly. */}
      {/* `min-h-dvh`, not `min-h-full`: Lenis relaxes <html> to `height: auto`
          while it is running, which would leave a percentage min-height with
          nothing to resolve against and drop the footer up the page on short
          routes (404, /thank-you). */}
      <body suppressHydrationWarning className="flex min-h-dvh flex-col">
        {/* The browser restores the previous scroll offset on a reload, and
            it does so from a position Lenis has been driving — the two
            disagree by whatever the momentum had not yet settled, so a
            refresh near the top landed the reader a hundred pixels down the
            hero. A landing page has no reading position worth restoring:
            take the restore into our own hands, and a refresh starts at the
            top (or at the hash, which <HashScroll> handles). It has to run
            before first paint, hence a raw pre-hydration script rather than
            an effect — by the time React mounts, the jump has happened. */}
        <Script id="scroll-restoration" strategy="beforeInteractive">
          {`if("scrollRestoration" in history)history.scrollRestoration="manual"`}
        </Script>

        {/* Site-wide identity: who publishes this and what the site is. Page
            level schema (the product, the FAQ) is added per route. */}
        <JsonLd data={graph(organizationSchema, websiteSchema)} />
        <SmoothScroll />
        <HashScroll />
        <ScrollProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  )
}
