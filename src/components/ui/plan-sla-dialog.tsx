"use client"

import { ChevronRight, Clock, Headphones } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  SLA_PRIORITY_LABELS,
  SLA_PRIORITY_VARIANTS,
} from "@/content/support-sla"
import { groupSlas, slaLabel } from "@/lib/support-sla"
import { cn } from "@/lib/utils"
import type { Plan } from "@/types"

/**
 * The plan card's "Support response · N promises" row and the table it opens
 * — the landing counterpart of app-xpert-one's PlanCard row + PlanSlaDialog.
 *
 * The full table lives in a dialog rather than on the card: one plan can
 * carry eight promises and the next two, and eight rows against two would
 * turn the comparison grid into a column of ragged cards.
 */
export function PlanSlaDialog({ plan }: { plan: Plan }) {
  const slas = plan.supportSlas ?? []
  if (slas.length === 0) return null

  const groups = groupSlas(slas)

  return (
    <Dialog>
      <DialogTrigger className="mt-6 flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border-t border-border px-1 pt-4 text-left transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <Headphones className="size-3.5" aria-hidden />
          Support response
        </span>
        <span className="inline-flex items-center gap-1 text-[0.6875rem] font-medium whitespace-nowrap text-accent-foreground">
          {slas.length} promise{slas.length === 1 ? "" : "s"}
          <ChevronRight className="size-3.5" aria-hidden />
        </span>
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] p-5 sm:max-w-lg md:p-6">
        <DialogHeader className="pr-8">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-muted text-accent-foreground">
              <Headphones className="size-4" aria-hidden />
            </span>
            Support response
          </DialogTitle>
          <DialogDescription className="text-pretty">
            How quickly {plan.name} promises to respond, by ticket type and
            urgency.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 max-h-[60vh] space-y-5 overflow-y-auto pr-1">
          {groups.map((group) => (
            <div key={group.ticketType}>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {group.label}
              </p>
              <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
                {group.slas.map((sla) => (
                  <li
                    key={`${sla.ticketType}-${sla.priority}`}
                    className="flex items-center justify-between gap-3 px-3 py-2.5"
                  >
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[0.6875rem] font-medium",
                        SLA_PRIORITY_VARIANTS[sla.priority] ??
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {SLA_PRIORITY_LABELS[sla.priority] ?? sla.priority}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <Clock className="size-3.5 text-muted-foreground" aria-hidden />
                      {slaLabel(sla)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
