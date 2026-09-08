/**
 * The single place env vars are read. Anything the browser needs must be
 * NEXT_PUBLIC_ and must not be a secret.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://xpertone.xpertlab.com"

export const env = {
  siteUrl,
  /** Where lead submissions are forwarded. Server-only, optional in dev. */
  leadWebhookUrl: process.env.LEAD_WEBHOOK_URL,
} as const
