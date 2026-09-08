import Script from "next/script"
import { env } from "@/lib/env"

/**
 * Google Analytics, loaded only when a measurement ID is configured and only
 * on the production stage — the dev deploy must not pollute the property with
 * its own traffic.
 *
 * `afterInteractive` keeps the tag out of the critical path: it is fetched
 * once the page is usable, so it can't delay first paint.
 */
export function Analytics() {
  const id = env.analyticsId

  if (!env.isProduction || !id) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}')`}
      </Script>
    </>
  )
}
