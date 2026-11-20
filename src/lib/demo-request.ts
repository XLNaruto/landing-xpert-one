/**
 * Demo / plan / sales requests — `POST /demo-requests` on the XpertOne
 * API (see docs: "Demo / Plan / Sales Request API"). One endpoint takes every
 * "contact me" form on the site:
 *
 *   Book a demo (CTA form)          → request_type "demo"
 *   Start with <plan> (pricing)     → request_type "plan" + plan_id + billing_cycle
 *   Talk to sales (Custom plan)     → request_type "sales"
 *
 * The site is a static export, so this runs in the visitor's browser. No key
 * is sent: the route is public, and `X-Bot-Key` belongs to the help bot only —
 * it must never appear in this bundle.
 */
import { AxiosError } from "axios"
import { apiClient } from "@/lib/api-client"
import { endpoints } from "@/lib/endpoints"
import type { BillingCycle, Plan } from "@/types"

/** The API's enum — the dash is an EN DASH (U+2013), not a hyphen. */
export const EMPLOYEE_RANGES = ["1–5", "6–50", "51–200", "200+"] as const

export type DemoRequestType = "demo" | "plan" | "sales"

/** What the request is about — decides `request_type` and the plan fields. */
export type DemoRequestTopic =
  | { type: "demo" }
  | { type: "sales" }
  | { type: "plan"; planId: number; cycle: BillingCycle }

export type DemoRequestField =
  | "name"
  | "company"
  | "mobile"
  | "email"
  | "employees"
  | "city"
  | "message"
  | "consent"

export type DemoRequestValues = Record<Exclude<DemoRequestField, "consent">, string> & {
  consent: boolean
}

export type DemoRequestFieldErrors = Partial<Record<DemoRequestField, string>>

export type DemoRequestOutcome = "created" | "merged" | "already_scheduled"

/** The 200/201 body. */
export type DemoRequestResult = {
  id: number
  reference: string
  outcome: DemoRequestOutcome
  /** What the request is about NOW — a merge can keep an earlier plan. */
  request_type: DemoRequestType
  plan_name: string | null
  scheduled_at: string | null
}

export type DemoRequestState = {
  result?: DemoRequestResult
  /** Not about one field: network, rate limit, server, an unknown plan. */
  error?: string
  fieldErrors?: DemoRequestFieldErrors
  /** Rate-limited: the form should stop offering to submit. */
  locked?: boolean
  /**
   * The attempt may not have reached the API (network error, 5xx), so the
   * next submit must reuse the same idempotency key.
   */
  retrySameKey?: boolean
}

const GENERIC_ERROR = "Something went wrong. Please try again."
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function readDemoRequestValues(formData: FormData): DemoRequestValues {
  const read = (key: string) => String(formData.get(key) ?? "").trim()
  return {
    name: read("name"),
    company: read("company"),
    mobile: read("mobile"),
    email: read("email"),
    employees: read("employees"),
    city: read("city"),
    message: read("message"),
    consent: formData.get("consent") === "on",
  }
}

/** The rules of the API's §3, checked in one pass so every message shows. */
export function validateDemoRequest(values: DemoRequestValues): DemoRequestFieldErrors {
  const errors: DemoRequestFieldErrors = {}

  if (!values.name) errors.name = "Your name is required."
  else if (values.name.length < 2) errors.name = "Please enter your full name."
  else if (values.name.length > 80) errors.name = "Please keep your name under 80 characters."

  if (!values.company) errors.company = "Company name is required."
  else if (values.company.length < 2) errors.company = "Please enter the company's full name."
  else if (values.company.length > 120)
    errors.company = "Please keep the company name under 120 characters."

  if (!values.mobile) errors.mobile = "Mobile number is required."
  /* The field takes exactly 10 digits — an Indian mobile starts with 6–9. */
  else if (!/^[6-9]\d{9}$/.test(values.mobile))
    errors.mobile = "Please enter a valid 10-digit Indian mobile number."

  if (values.email && (values.email.length > 254 || !emailPattern.test(values.email)))
    errors.email = "That email doesn't look right."

  if (
    values.employees &&
    !(EMPLOYEE_RANGES as readonly string[]).includes(values.employees)
  )
    errors.employees = "Pick one of the listed ranges."

  if (values.city.length > 60) errors.city = "Please keep the city under 60 characters."
  if (values.message.length > 1000)
    errors.message = "Please keep the message under 1000 characters."

  if (!values.consent) errors.consent = "Please agree to be contacted."

  return errors
}

/** A fresh key per submit (API §5.4). */
export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  /* Non-secure contexts (plain-http preview) lack randomUUID. */
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

/**
 * The JSON body. Optional fields are left out rather than sent empty, and the
 * plan fields only appear on a `plan` request — the API refuses them otherwise.
 */
function toBody(
  values: DemoRequestValues,
  topic: DemoRequestTopic,
  idempotencyKey: string,
  contextNote?: string,
) {
  const message = [contextNote, values.message].filter(Boolean).join("\n\n").slice(0, 1000)

  return {
    name: values.name,
    company: values.company,
    mobile: values.mobile,
    ...(values.email && { email: values.email }),
    ...(values.employees && { employees: values.employees }),
    ...(values.city && { city: values.city }),
    request_type: topic.type,
    ...(topic.type === "plan" && {
      plan_id: topic.planId,
      billing_cycle: topic.cycle === "annual" ? "yearly" : "monthly",
    }),
    ...(message && { message }),
    consent: true,
    idempotency_key: idempotencyKey,
  }
}

type ApiErrorBody = {
  code?: string
  message?: string
  details?: { instancePath?: string; message?: string }[] | string
}

const formFields = new Set<string>([
  "name",
  "company",
  "mobile",
  "email",
  "employees",
  "city",
  "message",
  "consent",
])

/** API §7 → what the form shows. */
function toErrorState(error: unknown): DemoRequestState {
  if (!(error instanceof AxiosError) || !error.response) {
    /* Never reached the API, or no answer: retry with the same key. */
    return { error: "Network problem. Please try again.", retrySameKey: true }
  }

  const { status, data } = error.response
  const body = (typeof data === "object" && data !== null ? data : {}) as ApiErrorBody

  /* AWS WAF: an HTML body, not JSON. */
  if (status === 403) {
    return { error: "Too many attempts. Please try again in a few minutes." }
  }

  if (status === 429) {
    return {
      error: body.message || "Too many requests from this number today. Our team will contact you soon.",
      locked: true,
    }
  }

  if (status >= 500) {
    return { error: GENERIC_ERROR, retrySameKey: true }
  }

  if (body.code === "VALIDATION" && Array.isArray(body.details)) {
    const fieldErrors: DemoRequestFieldErrors = {}
    const other: string[] = []
    for (const detail of body.details) {
      const field = detail.instancePath?.replace(/^\//, "") ?? ""
      if (!detail.message) continue
      if (formFields.has(field)) fieldErrors[field as DemoRequestField] ??= detail.message
      else other.push(detail.message)
    }
    return {
      fieldErrors,
      error: other.length > 0 ? other.join(" ") : Object.keys(fieldErrors).length ? undefined : body.message,
    }
  }

  /* `message` is written for the visitor (e.g. the mobile or plan refusals). */
  if (body.message && /mobile/i.test(body.message)) {
    return { fieldErrors: { mobile: body.message } }
  }
  return { error: body.message || GENERIC_ERROR }
}

export async function submitDemoRequest(
  values: DemoRequestValues,
  topic: DemoRequestTopic,
  idempotencyKey: string,
  /** Prefixed to the visitor's message, e.g. which plan they were looking at. */
  contextNote?: string,
): Promise<DemoRequestState> {
  const fieldErrors = validateDemoRequest(values)
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  try {
    const { data } = await apiClient.post<DemoRequestResult>(
      endpoints.DEMO_REQUESTS,
      toBody(values, topic, idempotencyKey, contextNote),
    )
    return { result: data }
  } catch (error) {
    return toErrorState(error)
  }
}

/** The headline over the success message. */
export function successTitle(result: DemoRequestResult): string {
  if (result.outcome === "already_scheduled") return "You're already booked"
  if (result.outcome === "merged") return "We already have your request"
  return "Request received"
}

/** What to tell the visitor, worded by `outcome` (API §5). */
export function successText(result: DemoRequestResult): string {
  const isDemo = result.request_type === "demo"

  if (result.outcome === "already_scheduled" && result.scheduled_at) {
    const when = new Date(result.scheduled_at).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    })
    return `Your ${isDemo ? "demo" : "call"} is already scheduled for ${when} (IST).`
  }

  if (result.outcome === "merged") {
    return `We already have your request ${result.reference}. Our team will contact you soon.`
  }

  const what = result.plan_name
    ? ` for the ${result.plan_name} plan`
    : result.request_type === "sales"
      ? " for our sales team"
      : isDemo
        ? " for a demo"
        : ""
  return `Thank you! Your request ${result.reference}${what} has been received. Our team will call you shortly.`
}

/** What a pricing card's request sends. */
export type RequestSelection = {
  topic: DemoRequestTopic
  /** Shown above the form, e.g. "Business plan · Monthly". */
  label: string
  contextNote?: string
}


/**
 * A quoted plan ("Let's talk") is a sales request. A catalogued plan is a
 * plan request with its catalog id — and when the grid is still showing the
 * hand-written fallback (no id), it goes to sales with the plan named in the
 * message, so nothing is lost.
 */
export function selectionForPlan(plan: Plan, cycle: BillingCycle): RequestSelection {
  const cycleLabel = cycle === "annual" ? "Yearly" : "Monthly"
  if (plan.request) return { topic: { type: "sales" }, label: `Talk to sales · ${plan.name}` }
  if (plan.catalogId !== undefined) {
    return {
      topic: { type: "plan", planId: plan.catalogId, cycle },
      label: `${plan.name} plan · ${cycleLabel}`,
    }
  }
  return {
    topic: { type: "sales" },
    label: `${plan.name} plan · ${cycleLabel}`,
    contextNote: `Interested in the ${plan.name} plan (${cycleLabel.toLowerCase()} billing).`,
  }
}
