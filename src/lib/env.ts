/**
 * The single place env vars are read. Anything the browser needs must be
 * NEXT_PUBLIC_ and must not be a secret.
 *
 * The site is a static export: there is no server at runtime, so every value
 * here is inlined into the bundle at build time.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://xpertone.xpertlab.com"

export const env = {
  siteUrl,
  /**
   * Where demo requests are POSTed, from the visitor's browser. It ships in
   * the client bundle, so it must be a public, rate-limited intake endpoint —
   * never a private Slack/Zapier webhook. Unset in dev: submissions are logged
   * to the browser console instead.
   */
  leadEndpoint: process.env.NEXT_PUBLIC_LEAD_ENDPOINT,
} as const
