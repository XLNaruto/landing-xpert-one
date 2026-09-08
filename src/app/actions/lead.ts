"use server"

import { redirect } from "next/navigation"
import { env } from "@/lib/env"

export type LeadFieldErrors = {
  name?: string
  email?: string
}

export type LeadState = {
  /** Something went wrong that isn't about one field (network, webhook). */
  error?: string
  /** Per-field messages, rendered under the field they belong to. */
  fieldErrors?: LeadFieldErrors
  /** Echoed back so a rejected submit doesn't wipe what was typed. */
  values?: { name: string; email: string; company: string; note: string }
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const company = String(formData.get("company") ?? "").trim()
  const note = String(formData.get("note") ?? "").trim()
  const values = { name, email, company, note }

  /* Every field is checked in one pass, so the form can show all the
     messages at once rather than one per submit. */
  const fieldErrors: LeadFieldErrors = {}
  if (!name) fieldErrors.name = "Your name is required."
  else if (name.length < 2) fieldErrors.name = "Please enter your full name."
  if (!email) fieldErrors.email = "Work email is required."
  else if (!emailPattern.test(email))
    fieldErrors.email = "That email doesn't look right."

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors, values }

  if (env.leadWebhookUrl) {
    try {
      const response = await fetch(env.leadWebhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, company, note, source: "landing" }),
      })
      if (!response.ok) throw new Error(`Webhook responded ${response.status}`)
    } catch {
      return {
        error: "We couldn't send that just now. Please try again.",
        values,
      }
    }
  } else {
    console.info("[lead] no LEAD_WEBHOOK_URL configured", {
      name,
      email,
      company,
      note,
    })
  }

  redirect("/thank-you")
}
