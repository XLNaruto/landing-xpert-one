"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { Tilt } from "@/components/motion/tilt"
import { PlanRequestDialog } from "@/components/forms/plan-request-dialog"
import type { BillingCycle, Plan } from "@/types"
import { isCancelled } from "@/lib/api-client"
import { fetchPlans } from "@/lib/plans"
import { cn } from "@/lib/utils"

const cycles: { id: BillingCycle; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Yearly" },
]

const ctaClass =
  "mt-8 h-11 w-full rounded-full text-sm font-semibold hover:-translate-y-px"

/**
 * The billing switch has to own the plan grid, since flipping it re-prices
 * every card. Kept out of the section file so the section itself — heading,
 * lead, footnote — stays a Server Component.
 */
export function PricingPlans({ plans: builtPlans }: { plans: Plan[] }) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly")
  /* The build's plans render straight away; the live catalog replaces them
     once it answers. A failure leaves the built ones — no spinner, no gap. */
  const [plans, setPlans] = useState(builtPlans)

  useEffect(() => {
    const controller = new AbortController()
    fetchPlans(controller.signal)
      .then(setPlans)
      .catch((error: unknown) => {
        if (isCancelled(error)) return
        console.warn("[plans] live catalog unavailable, keeping the built plans", error)
      })
    return () => controller.abort()
  }, [])

  return (
    <>
      {/* Segmented control: a recessed neutral track with the active segment
          raised as a plain card, sliding between halves. Equal fixed widths
          and no gap are what let `translate-x-full` land it exactly on the
          second half. */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <div
          role="group"
          aria-label="Billing period"
          className="relative flex w-fit rounded-full bg-muted p-1 inset-shadow-2xs inset-ring inset-ring-border/60"
        >
          <span
            aria-hidden
            className={cn(
              /* Same frosted pill as the module CTAs in Solutions: a light
                 brand tint, not a solid fill. */
              "absolute inset-y-1 left-1 w-28 rounded-full border border-brand/25 bg-linear-to-b from-brand/25 to-brand/5 shadow-lg shadow-brand/10 ring-1 ring-white/50 backdrop-blur-md ring-inset transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] sm:w-32",
              cycle === "annual" && "translate-x-full",
            )}
          />

          {cycles.map(({ id, label }) => {
            const active = cycle === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setCycle(id)}
                aria-pressed={active}
                className={cn(
                  "relative w-28 cursor-pointer rounded-full py-2.5 text-sm transition-all duration-200 outline-none active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring/50 sm:w-32",
                  active
                    ? "font-semibold text-accent-foreground"
                    : "font-medium text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Keyed so the line re-enters when the cycle flips, rather than the
            text swapping in place. */}
        <p
          key={cycle}
          className="animate-in fade-in slide-in-from-bottom-1 text-xs text-muted-foreground duration-300"
        >
          {cycle === "annual"
            ? "Ten months billed instead of twelve"
            : "Switch to yearly and save two months"}
        </p>
      </div>

      {/* The plans fade up in sequence once, like the demo section's list,
          and then stay put — no scroll-linked tilt in or out. */}
      <Stagger className="mx-auto mt-12 grid max-w-lg items-stretch gap-6 lg:max-w-none lg:grid-cols-3">
        {plans.map((plan) => {
          const { price, period } = plan[cycle]
          /* "Let's talk" is a sentence, not a figure — it can't carry the
             same display size as "₹70" without shouting. */
          const isFigure = /\d/.test(price)

          return (
            <StaggerItem
              key={plan.id}
              className={cn("h-full", plan.featured && "lg:-mt-5")}
            >
              {/* <Tilt> owns the transform, so the plain card's old
                  `hover:-translate-y-1` lift is now the lean instead. The
                  featured card tilts a touch less: it is already raised, and
                  a wide card swinging as far as a small one looks unstable. */}
              <Tilt
                max={plan.featured ? 5 : 7}
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition-[border-color,box-shadow] duration-300",
                  plan.featured
                    ? "border-brand/60 shadow-xl shadow-brand/15 ring-1 ring-brand/20"
                    : "border-border shadow-xs hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10",
                )}
              >
                {/* The featured plan gets a brand cap instead of a louder
                  border, so the emphasis survives dark mode. */}
                {plan.featured && (
                  <span
                    aria-hidden
                    className="block h-1.5 w-full bg-linear-to-r from-brand to-brand/60"
                  />
                )}

                <div
                  className={cn(
                    "p-6 md:p-8",
                    plan.featured && "bg-brand-muted/30",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold tracking-tight uppercase">
                      {plan.name}
                    </h3>
                    {plan.featured && (
                      <span className="rounded-full bg-brand px-2.5 py-1 text-[0.6875rem] font-bold tracking-wide text-brand-foreground uppercase shadow-sm shadow-brand/25">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <p className="mt-5 flex flex-wrap items-baseline gap-x-2">
                    <span
                      className={cn(
                        "font-semibold tracking-tight tabular-nums",
                        isFigure ? "text-4xl md:text-5xl" : "text-3xl",
                      )}
                    >
                      {price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {period}
                    </span>
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="flex flex-1 flex-col border-t border-border p-6 md:p-8">
                  <ul className="flex-1 space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm">
                        <span
                          className={cn(
                            "mt-px grid size-5 shrink-0 place-items-center rounded-full",
                            plan.featured
                              ? "bg-brand text-brand-foreground"
                              : "bg-brand-muted text-accent-foreground",
                          )}
                          aria-hidden
                        >
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                        <span className="text-pretty">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Every CTA opens the request dialog: a priced plan
                      sends a plan request, a quoted one goes to sales. */}
                  <PlanRequestDialog
                    plan={plan}
                    cycle={cycle}
                    className={ctaClass}
                  />
                </div>
              </Tilt>
            </StaggerItem>
          )
        })}
      </Stagger>
    </>
  )
}
