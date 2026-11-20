"use client"

import { useState } from "react"
import { DemoRequestForm } from "@/components/forms/demo-request-form"
import { RequestSuccess } from "@/components/forms/request-success"
import { Button } from "@/components/ui/button"
import type { DemoRequestResult } from "@/lib/demo-request"

/**
 * The CTA section's "Book a demo" form — a `demo` request. The answer is
 * shown in place rather than on /thank-you, because what it says depends on
 * the API's `outcome` (new, already on file, already booked).
 */
export function LeadForm() {
  const [result, setResult] = useState<DemoRequestResult | null>(null)
  const [formKey, setFormKey] = useState(0)

  if (result) {
    return (
      <div className="w-full max-w-md">
        <RequestSuccess
          result={result}
          action={
            <Button
              type="button"
              variant="glass-muted"
              className="mt-2 h-11 rounded-full px-8 font-semibold"
              onClick={() => {
                setResult(null)
                setFormKey((k) => k + 1)
              }}
            >
              Send another request
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <DemoRequestForm
        key={formKey}
        idPrefix="lead"
        topic={{ type: "demo" }}
        submitLabel="Book a demo"
        messagePlaceholder="Tell us about your current attendance and payroll process"
        onSuccess={setResult}
      />
    </div>
  )
}
