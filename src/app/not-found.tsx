import type { Metadata } from "next"
import Link from "next/link"
import { RedirectHome } from "@/components/layout/redirect-home"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
}

/**
 * Any unknown path sends the reader back to the landing page. The site is a
 * static export, so this renders to 404.html and the redirect has to happen
 * in the browser: a meta refresh (works without JS) plus a client
 * `router.replace` so the bad URL doesn't stay in history.
 */
export default function NotFound() {
  return (
    <section className="section">
      <meta httpEquiv="refresh" content="0;url=/" />
      <RedirectHome />
      <div className="section-inner flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-muted-foreground">Redirecting to the home page…</p>
        <Link href="/" className="font-medium text-brand underline-offset-4 hover:underline">
          Go to home
        </Link>
      </div>
    </section>
  )
}
