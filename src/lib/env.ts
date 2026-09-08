/**
 * The single place env vars are read — the counterpart of `src/config/env.ts`
 * in app-xpert-one, minus zod (this site has no schema-shaped config).
 *
 * The site is a static export: there is no server at runtime, so every value
 * here is inlined into the bundle at build time. The *build* therefore decides
 * which deployment the output belongs to, and `NEXT_PUBLIC_APP_STAGE` is how
 * it says so — the same role `--mode` plays for Vite.
 *
 *   npm run build       → development → https://dev.xpertoneindia.com
 *   npm run build:prod  → production  → https://xpertoneindia.com
 *
 * Anything the browser needs must be NEXT_PUBLIC_ and must not be a secret.
 */

export type Stage = "development" | "production"

/**
 * The host each stage is deployed to — the source of truth, since the
 * `.env.<stage>` files are untracked and a CI build never sees one.
 */
export const SITE_URLS: Record<Stage, string> = {
  development: "https://dev.xpertoneindia.com",
  production: "https://xpertoneindia.com",
}

function readStage(): Stage {
  /* Inline `NEXT_PUBLIC_APP_STAGE=…` in the script wins over the .env file,
     which is what lets `npm run build` emit a development artefact even though
     `next build` loads .env.production. */
  const stage = process.env.NEXT_PUBLIC_APP_STAGE

  if (stage === "development" || stage === "production") return stage
  if (stage) {
    throw new Error(
      `NEXT_PUBLIC_APP_STAGE must be "development" or "production", got "${stage}".`,
    )
  }

  /* Unset: `next build` is the real site, `next dev` is the dev deployment. */
  return process.env.NODE_ENV === "production" ? "production" : "development"
}

/** Canonical URLs are compared as strings, so the host must be exact. */
function normalise(url: string): string {
  return url.trim().replace(/\/+$/, "")
}

const stage = readStage()

/**
 * The stage's host, unless this build explicitly names another one (a preview
 * served from somewhere else). `||` on purpose: the build scripts pin the
 * variable to "" when the stage doesn't override it.
 */
const siteUrl = normalise(process.env.NEXT_PUBLIC_SITE_URL || SITE_URLS[stage])

export const env = {
  stage,
  siteUrl,
  /**
   * Only the production stage may be indexed. The dev deploy serves the same
   * pages, so leaving it crawlable would put a second copy of every URL in
   * front of search engines and split the ranking signals between them.
   */
  isProduction: stage === "production",
  /**
   * Google Analytics measurement ID (G-XXXXXXXXXX). Unset: no tag is loaded.
   * Only honoured on the production stage — see components/analytics.tsx.
   */
  analyticsId: process.env.NEXT_PUBLIC_GA_ID,
  /**
   * Where demo requests are POSTed, from the visitor's browser. It ships in
   * the client bundle, so it must be a public, rate-limited intake endpoint —
   * never a private Slack/Zapier webhook. Unset: submissions are logged to the
   * browser console instead.
   */
  leadEndpoint: process.env.NEXT_PUBLIC_LEAD_ENDPOINT,
} as const
