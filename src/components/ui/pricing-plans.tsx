"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { buttonVariants } from "@/components/ui/button"
import type { BillingCycle, Plan } from "@/types"
import { cn } from "@/lib/utils"

const cycles: { id: BillingCycle; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Yearly" },
]

/**
 * The billing switch has to own the plan grid, since flipping it re-prices
 * every card. Kept out of the section file so the section itself — heading,
 * lead, footnote — stays a Server Component.
 */
export function PricingPlans({ plans }: { plans: Plan[] }) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly")

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
          className="relative flex w-fit rounded-full bg-muted p-1 inset-shadow-2xs inset-ring inset-ring-border/60 dark:bg-white/5 dark:inset-ring-white/10"
        >
          <span
            aria-hidden
            className={cn(
              /* Same frosted pill as the module CTAs in Solutions: a light
                 brand tint, not a solid fill. */
              "absolute inset-y-1 left-1 w-28 rounded-full border border-brand/25 bg-linear-to-b from-brand/25 to-brand/5 shadow-lg shadow-brand/10 ring-1 ring-white/50 backdrop-blur-md ring-inset transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] sm:w-32 dark:border-white/15 dark:from-white/20 dark:to-white/5 dark:ring-white/10",
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

      <Stagger as="ul" className="mx-auto mt-12 grid max-w-lg items-stretch gap-6 lg:max-w-none lg:grid-cols-3">
        {plans.map((plan) => {
          const { price, period } = plan[cycle]
          /* "Let's talk" is a sentence, not a figure — it can't carry the
             same display size as "₹70" without shouting. */
          const isFigure = /\d/.test(price)

          return (
            <StaggerItem
              as="li"
              key={plan.id}
              className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition-all duration-300",
                plan.featured
                  ? "border-brand/60 shadow-xl shadow-brand/15 ring-1 ring-brand/20 lg:-mt-5"
                  : "border-border shadow-xs hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10",
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
                className={cn("p-6 md:p-8", plan.featured && "bg-brand-muted/30")}
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
                  <span className="text-sm text-muted-foreground">{period}</span>
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

                <Link
                  href="/#cta"
                  className={cn(
                    buttonVariants({
                      variant: plan.featured ? "glass" : "glass-muted",
                    }),
                    "mt-8 h-11 w-full rounded-full text-sm font-semibold hover:-translate-y-px",
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            </StaggerItem>
          )
        })}
      </Stagger>
    </>
  )
}
