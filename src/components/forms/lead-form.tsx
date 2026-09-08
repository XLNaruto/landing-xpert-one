"use client"

import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { submitLead, type LeadState } from "@/app/actions/lead"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const initialState: LeadState = {}

const fieldClass =
  "w-full rounded-lg border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3"

const inputClass = `${fieldClass} h-11`
const neutralBorder =
  "border-border focus-visible:border-ring focus-visible:ring-ring/50"

export function LeadForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialState)
  const errors = state.fieldErrors ?? {}

  return (
    /* `noValidate` turns off the browser's own validation bubbles — the
       messages below each field are the single source of truth, and they
       survive a round trip through the Server Action. */
    <form action={formAction} noValidate className="w-full max-w-md">
      <div className="grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">
            Your name <span className="text-destructive">*</span>
          </span>
          <input
            name="name"
            type="text"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "lead-name-error" : undefined}
            autoComplete="name"
            placeholder="John Doe"
            defaultValue={state.values?.name}
            className={cn(
              inputClass,
              errors.name
                ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"
                : neutralBorder,
            )}
          />
          {errors.name && (
            <span
              id="lead-name-error"
              role="alert"
              className="text-xs font-medium text-destructive"
            >
              {errors.name}
            </span>
          )}
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium">
            Work email <span className="text-destructive">*</span>
          </span>
          <input
            name="email"
            type="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "lead-email-error" : undefined}
            autoComplete="email"
            placeholder="you@company.com"
            defaultValue={state.values?.email}
            className={cn(
              inputClass,
              errors.email
                ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"
                : neutralBorder,
            )}
          />
          {errors.email && (
            <span
              id="lead-email-error"
              role="alert"
              className="text-xs font-medium text-destructive"
            >
              {errors.email}
            </span>
          )}
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Company</span>
          <input
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Company name"
            defaultValue={state.values?.company}
            className={cn(inputClass, neutralBorder)}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Note</span>
          <textarea
            name="note"
            rows={3}
            placeholder="How do you run attendance and payroll today?"
            defaultValue={state.values?.note}
            className={cn(fieldClass, neutralBorder, "min-h-24 resize-y py-2.5")}
          />
        </label>
      </div>

      {state.error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        variant="glass"
        disabled={pending}
        className="mt-4 h-11 w-full rounded-full text-base"
      >
        {pending && <Loader2 className="animate-spin" aria-hidden />}
        {pending ? "Sending…" : "Book a demo"}
      </Button>

      <p className="mt-3 text-xs text-muted-foreground">
        <span className="text-destructive">*</span> Required. We reply within one
        working day — no newsletter, no reselling your data.
      </p>
    </form>
  )
}
