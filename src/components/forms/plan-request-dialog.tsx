"use client"

import { useState } from "react"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DemoRequestForm } from "@/components/forms/demo-request-form"
import { RequestSuccess } from "@/components/forms/request-success"
import { selectionForPlan, type DemoRequestResult } from "@/lib/demo-request"
import { cn } from "@/lib/utils"
import type { BillingCycle, Plan } from "@/types"

/**
 * A pricing card's CTA and the request dialog it opens. A priced plan sends
 * a `plan` request (its catalog id + the cycle on the toggle); a quoted one
 * ("Let's talk") goes to sales. Once sent, the dialog shows the animated
 * confirmation in place of the form.
 */
export function PlanRequestDialog({
  plan,
  cycle,
  className,
}: {
  plan: Plan
  cycle: BillingCycle
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<DemoRequestResult | null>(null)
  /* Remounts the form on each open, so it starts empty with a fresh key. */
  const [formKey, setFormKey] = useState(0)
  const { topic, contextNote } = selectionForPlan(plan, cycle)
  const cycleLabel = cycle === "annual" ? "yearly" : "monthly"

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      /* Reset once the closing animation is out of sight. */
      setTimeout(() => {
        setResult(null)
        setFormKey((k) => k + 1)
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: plan.featured ? "glass" : "glass-muted" }),
          className,
        )}
      >
        {plan.cta}
      </DialogTrigger>

      <DialogContent
        /* Lenis would otherwise swallow the wheel inside a tall dialog. */
        data-lenis-prevent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-5 sm:max-w-lg md:p-6"
      >
        {result ? (
          <RequestSuccess
            result={result}
            titleAs={DialogTitle}
            descriptionAs={DialogDescription}
            action={
              <DialogClose
                className={cn(
                  buttonVariants({ variant: "glass-muted" }),
                  "mt-2 h-11 rounded-full px-8 font-semibold",
                )}
              >
                Done
              </DialogClose>
            }
          />
        ) : (
          <>
            <DialogHeader className="pr-8">
              <DialogTitle className="text-lg font-semibold">
                {topic.type === "plan" ? `Start with ${plan.name}` : "Talk to sales"}
              </DialogTitle>
              <DialogDescription className="text-pretty">
                {topic.type === "plan"
                  ? `Tell us about your organisation and our team will call you to set up the ${plan.name} plan on ${cycleLabel} billing.`
                  : "Tell us about your companies and how you work, and our team will put together a proposal for you."}
              </DialogDescription>
            </DialogHeader>

            <DemoRequestForm
              key={formKey}
              idPrefix={`plan-${plan.id}`}
              topic={topic}
              contextNote={contextNote}
              submitLabel="Send request"
              messageLabel="What do you need?"
              messagePlaceholder="Companies, branches, integrations, deployment…"
              onSuccess={setResult}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
