/**
 * XpertOne API paths the landing site calls, relative to `env.apiUrl` — the
 * counterpart of `src/lib/endpoints.ts` in app-xpert-one.
 */
export const endpoints = {
  BILLING: {
    /**
     * The public plan catalog — no sign-in. Read at build time for the
     * pricing grid and again in the browser; each plan's `id` is the
     * `plan_id` a plan request sends. Ids differ between dev and prod, so
     * they are never hardcoded.
     */
    PLANS: "/plans",
  },
  /**
   * `POST` — every "contact me" form (demo, plan, sales). Public, no key;
   * see lib/demo-request.ts.
   */
  DEMO_REQUESTS: "/demo-requests",
  /**
   * `GET` — public. `{ code, name }` of the active salesperson a referral
   * code belongs to, or a 400 when there is none. Sent as `ref_code` on a
   * demo request; the organization made from it counts toward their target.
   */
  SALES_REFERRAL: (code: string) => `/sales-referrals/${encodeURIComponent(code)}`,
  LEGAL: {
    /**
     * `GET /legal/{document}` — public, no sign-in. Returns
     * `{ document, title, content (HTML), updated_at }`, or 404 until the
     * document is first published from the console.
     */
    DOCUMENT: (document: "privacy-policy" | "terms-of-service") =>
      `/legal/${document}`,
  },
} as const
