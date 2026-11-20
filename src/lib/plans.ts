/**
 * The pricing grid's plans — read from the XpertOne public plan catalog
 * (`GET /plans`, no sign-in), mapped the way the app's
 * `toPlan` does (prices arrive in paise).
 *
 * Called twice, by design:
 *  1. at BUILD time (`loadPlans`, from the pricing section's Server
 *     Component) — the prices are baked into the exported HTML, so the page
 *     renders fully with no request and nothing spins;
 *  2. in the BROWSER after load (`fetchPlans`, from <PricingPlans>) — picks up
 *     catalog changes made since the build and swaps them in place.
 *
 * Any failure — API down, 401, a shape we don't recognise — keeps what is
 * already there: the hand-written plans in `content/plans.ts` at build time,
 * the built HTML in the browser.
 */
import { plans as contentPlans } from "@/content/plans"
import { http, toApiError } from "@/lib/api-client"
import { endpoints } from "@/lib/endpoints"
import { env } from "@/lib/env"
import { toSupportSlas } from "@/lib/support-sla"
import type { Plan } from "@/types"

/** One plan as `GET /plans` returns it (the fields the grid reads). */
type PlanResponse = {
  id: number
  name: string
  description: string | null
  max_employees: number
  max_companies: number
  month_price_paise: number
  year_price_paise: number
  month_price_per_employee_paise: number | null
  year_price_per_employee_paise: number | null
  is_trial: boolean
  trial_duration_days: number | null
  support_slas: unknown[]
  is_custom: boolean
}

const PAISE_PER_RUPEE = 100

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

function formatPaise(paise: number): string {
  return rupees.format(paise / PAISE_PER_RUPEE)
}

/** Light shape check in place of the app's zod schema (no zod here). */
function isPlanResponse(value: unknown): value is PlanResponse {
  if (typeof value !== "object" || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === "number" &&
    typeof v.name === "string" &&
    typeof v.month_price_paise === "number" &&
    typeof v.year_price_paise === "number" &&
    typeof v.max_employees === "number" &&
    typeof v.max_companies === "number"
  )
}

/** Same-named plan in content/ — its marketing copy rides along. */
function findContentPlan(name: string): Plan | undefined {
  const key = name.trim().toLowerCase()
  /* A quoted ("Let's talk") card is never a catalog plan's copy — it is its
     own card, even when the catalog has a priced plan of the same name. */
  return contentPlans.find(
    (plan) => !plan.request && plan.name.toLowerCase() === key,
  )
}

/**
 * The price a card shows. A per-employee plan is quoted at its rate (what the
 * grid has always said: "₹40 employee / month"); a flat-fee plan at its total.
 */
function toPrice(total: number, perEmployee: number | null, unit: string) {
  return perEmployee === null
    ? { price: formatPaise(total), period: `per ${unit}` }
    : { price: formatPaise(perEmployee), period: `employee / ${unit}` }
}

function count(n: number, one: string, many: string) {
  return `${n.toLocaleString("en-IN")} ${n === 1 ? one : many}`
}

/** The allowances the app's PlanCard lists, as bullet lines. */
function catalogFeatures(plan: PlanResponse): string[] {
  const features = [
    `Up to ${count(plan.max_employees, "employee", "employees")}`,
    `Up to ${count(plan.max_companies, "company", "companies")}`,
  ]
  if (plan.is_trial && plan.trial_duration_days !== null) {
    features.push(`Free for ${plan.trial_duration_days} days`)
  }
  return features
}

/** API plan → the grid's Plan, enriched with matching content copy. */
function toPlan(response: PlanResponse): Plan {
  const copy = findContentPlan(response.name)

  return {
    id: copy?.id ?? `plan-${response.id}`,
    catalogId: response.id,
    name: response.name,
    monthly: toPrice(
      response.month_price_paise,
      response.month_price_per_employee_paise,
      "month",
    ),
    annual: toPrice(
      response.year_price_paise,
      response.year_price_per_employee_paise,
      "year",
    ),
    description: response.description ?? copy?.description ?? "",
    /* The catalog's limits come first: they're the facts. The curated
       bullets, when the plan has some, follow. */
    features: [...catalogFeatures(response), ...(copy?.features ?? [])],
    cta: copy?.cta ?? `Start with ${response.name}`,
    /* Shown as the card's "Support response" row, not as a bullet. */
    supportSlas: toSupportSlas(response.support_slas),
    featured: copy?.featured,
    request: copy?.request,
  }
}

/**
 * GET the plan catalog — the public counterpart of `fetchPlans` in the app's
 * `billing-api.ts`. Unpaginated: the whole catalog arrives in one read.
 */
async function fetchCatalog(signal?: AbortSignal): Promise<PlanResponse[]> {
  try {
    const raw = await http.get<unknown>(endpoints.BILLING.PLANS, { signal })
    const items = (raw as { items?: unknown } | null)?.items
    if (!Array.isArray(items)) throw new Error("No `items` array in the response.")
    return items.filter(isPlanResponse)
  } catch (error) {
    throw toApiError(error, "Couldn't Load the Available Plans.")
  }
}

/**
 * The catalog as grid plans — throws when there's nothing usable. Safe to call
 * from the browser: everything it reads is public.
 */
export async function fetchPlans(signal?: AbortSignal): Promise<Plan[]> {
  /* A custom plan is built for one organization — not a public offer. */
  const catalog = (await fetchCatalog(signal)).filter((plan) => !plan.is_custom)
  if (catalog.length === 0) throw new Error("the catalog is empty")

  /* Every catalog plan gets a card; the "Let's talk" cards from content/
     are always added after them — they are quoted, never catalogued. */
  const quoted = contentPlans.filter((plan) => plan.request)

  return [...catalog.map(toPlan), ...quoted]
}

/** Build-time read: the catalog, or content/plans.ts if it can't be had. */
export async function loadPlans(): Promise<Plan[]> {
  try {
    return await fetchPlans()
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    console.warn(
      `[plans] ${env.apiUrl}${endpoints.BILLING.PLANS} unavailable (${reason}); using content/plans.ts`,
    )
    return contentPlans
  }
}
