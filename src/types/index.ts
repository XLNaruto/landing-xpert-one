import type { LucideIcon } from "lucide-react"

export type NavLink = {
  label: string
  href: string
}

/** One of the three pillars the product is sold as. */
export type Solution = {
  id: string
  icon: LucideIcon
  name: string
  tagline: string
  description: string
  /** What the module actually does, in the buyer's words. */
  capabilities: string[]
  /** Label on the module's CTA — names the thing, not "learn more". */
  cta: string
}

export type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

/** One billing period's figure, e.g. "₹40" + "per employee / month". */
export type PlanPrice = {
  price: string
  period: string
}

export type BillingCycle = "monthly" | "annual"

export type Plan = {
  id: string
  name: string
  /** Priced per billing cycle — the pricing toggle switches between these. */
  monthly: PlanPrice
  annual: PlanPrice
  description: string
  features: string[]
  cta: string
  featured?: boolean
}

export type Faq = {
  question: string
  answer: string
}

export type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
}

/** A client wordmark in the trust strip. Swap `src` when a real logo lands. */
export type ClientLogo = {
  name: string
  src: string
  width: number
  height: number
}

export type Step = {
  title: string
  description: string
}

export type Stat = {
  value: string
  label: string
}
