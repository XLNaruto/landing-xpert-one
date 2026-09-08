/**
 * Demo-request submission. The site is a static export, so this runs in the
 * visitor's browser rather than in a Server Action.
 */
import { env } from "@/lib/env"

export type LeadValues = {
  name: string
  email: string
  company: string
  note: string
}

export type LeadFieldErrors = {
  name?: string
  email?: string
}

export type LeadState = {
  /** Something went wrong that isn't about one field (network, endpoint). */
  error?: string
  /** Per-field messages, rendered under the field they belong to. */
  fieldErrors?: LeadFieldErrors
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function readLeadValues(formData: FormData): LeadValues {
  const read = (key: string) => String(formData.get(key) ?? "").trim()
  return {
    name: read("name"),
    email: read("email"),
    company: read("company"),
    note: read("note"),
  }
}

/** Every field is checked in one pass, so the form can show all the messages
    at once rather than one per submit. */
export function validateLead(values: LeadValues): LeadFieldErrors {
  const fieldErrors: LeadFieldErrors = {}

  if (!values.name) fieldErrors.name = "Your name is required."
  else if (values.name.length < 2)
    fieldErrors.name = "Please enter your full name."

  if (!values.email) fieldErrors.email = "Work email is required."
  else if (!emailPattern.test(values.email))
    fieldErrors.email = "That email doesn't look right."

  return fieldErrors
}

export async function submitLead(values: LeadValues): Promise<LeadState> {
  const fieldErrors = validateLead(values)
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors }

  if (!env.leadEndpoint) {
    console.info("[lead] no NEXT_PUBLIC_LEAD_ENDPOINT configured", values)
    return {}
  }

  try {
    const response = await fetch(env.leadEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...values, source: "landing" }),
    })
    if (!response.ok) throw new Error(`Endpoint responded ${response.status}`)
  } catch {
    return { error: "We couldn't send that just now. Please try again." }
  }

  return {}
}
