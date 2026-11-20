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
  /**
   * Quoted, not bought ("Let's talk"): the CTA sends a `sales` request
   * instead of a `plan` request.
   */
  request?: boolean
  /** The plan's id in the XpertOne catalog, when it came from the API. */
  catalogId?: number
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

/* ── Site assistant (bot.xpertoneindia.com) ─────────────────────────────
   Shapes of the bot server's API — see lib/chat.ts. */

/** One button in a `choices` block. Exactly one of the action keys is set. */
export type ChatOption = {
  label: string
  /** Answer to the block's question: sent as `action: { node, values }`. */
  value?: string
  /** A ready-made question, sent as if typed. */
  send?: string
  /** Jump to another flow (the demo form): `action: { goto }`. */
  goto?: string
  /** Close the block without sending anything. */
  dismiss?: boolean
}

export type ChatChoicesUi = {
  kind: "choices"
  /** Absent on a row of follow-up suggestions under an answer. */
  node?: string
  multi?: boolean
  text?: string
  /** Label of the multi-select submit button. */
  submit?: string
  options: ChatOption[]
}

export type ChatInputUi = {
  kind: "input"
  node: string
  text?: string
  placeholder?: string
  required?: boolean
  max?: number
  skip?: string
}

export type ChatFormField = {
  name: string
  type: "text" | "email" | "tel" | "number" | "textarea" | "select" | "checkbox"
  label: string
  required?: boolean
  max?: number
  placeholder?: string
  options?: string[]
  value?: string | boolean
  error?: string
}

export type ChatFormUi = {
  kind: "form"
  node: string
  text?: string
  submit: string
  fields: ChatFormField[]
}

export type ChatUi = ChatChoicesUi | ChatInputUi | ChatFormUi

/** What the visitor answered, when it wasn't a typed question. */
export type ChatAction =
  | { node: string; values: string[] }
  | { goto: string }
  | { node: string; text: string }
  | { node: string; form: Record<string, string | boolean> }

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
  found?: boolean
  ui?: ChatUi | null
  /** The block has been answered and must not be drawn again. */
  used?: boolean
}

export type ChatConfig = {
  bot_name: string
  welcome_message: string
  contact_url: string
  suggested_questions: string[]
  max_question_chars: number
  start_ui: ChatUi | null
  turnstile_sitekey: string
}

/** The final event of a reply (`done`), or the whole `/chat` response. */
export type ChatReply = {
  answer: string
  found: boolean
  kind?: string
  language?: string
  ui?: ChatUi | null
  conversation_id?: string
  error?: string
}
