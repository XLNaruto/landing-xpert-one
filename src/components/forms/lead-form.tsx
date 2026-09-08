"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { readLeadValues, submitLead, type LeadState } from "@/lib/lead"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const fieldClass =
  "w-full rounded-lg border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3"

const inputClass = `${fieldClass} h-11`
const neutralBorder =
  "border-border focus-visible:border-ring focus-visible:ring-ring/50"

export function LeadForm() {
  const router = useRouter()
  const [state, setState] = useState<LeadState>({})
  const [pending, setPending] = useState(false)
  const errors = state.fieldErrors ?? {}

  /* The site is a static export, so there is no Server Action to post to:
     the browser validates, POSTs to the intake endpoint and navigates. */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    /* The inputs stay uncontrolled, so a rejected submit leaves what was
       typed sitting in the DOM — nothing to echo back. */
    const submitted = readLeadValues(new FormData(event.currentTarget))
    setPending(true)
    const result = await submitLead(submitted)

    if (result.error || result.fieldErrors) {
      setState(result)
      setPending(false)
      return
    }

    router.push("/thank-you")
  }

  return (
    /* `noValidate` turns off the browser's own validation bubbles — the
       messages below each field are the single source of truth. */
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-md">
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
            className={cn(inputClass, neutralBorder)}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-sm font-medium">Note</span>
          <textarea
            name="note"
            rows={3}
            placeholder="How do you run attendance and payroll today?"
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
