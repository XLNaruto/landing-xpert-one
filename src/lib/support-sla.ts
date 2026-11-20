/**
 * Support-response promises: parsing the catalog's `support_slas` and
 * grouping them for the plan card's dialog. Ported from app-xpert-one's
 * `billing-mappers.ts` (`toSupportSla`, `slaLabel`, `groupSlas`).
 */
import {
  SLA_PRIORITY_ORDER,
  SLA_TICKET_LABELS,
  SLA_TICKET_ORDER,
} from "@/content/support-sla"
import type { SupportSla } from "@/types"

/** Light shape check in place of the app's zod schema (no zod here). */
export function toSupportSlas(raw: unknown): SupportSla[] {
  if (!Array.isArray(raw)) return []

  return raw.flatMap((item): SupportSla[] => {
    if (typeof item !== "object" || item === null) return []
    const v = item as Record<string, unknown>
    if (
      typeof v.ticket_type !== "string" ||
      typeof v.priority !== "string" ||
      typeof v.sla_value !== "number" ||
      (v.sla_unit !== "hours" && v.sla_unit !== "days")
    ) {
      return []
    }
    return [
      {
        ticketType: v.ticket_type,
        priority: v.priority,
        value: v.sla_value,
        unit: v.sla_unit,
      },
    ]
  })
}

/** "2 days" / "1 hour" — the promise in the unit it was made in. */
export function slaLabel(sla: SupportSla): string {
  const unit = sla.value === 1 ? sla.unit.replace(/s$/, "") : sla.unit
  return `${sla.value} ${unit}`
}

export type SlaGroup = {
  ticketType: string
  label: string
  slas: SupportSla[]
}

/**
 * SLAs grouped by ticket type, sorted by urgency within each. A ticket type
 * with no promises is dropped rather than shown as an empty heading; one the
 * API adds later still shows, after the known ones.
 */
export function groupSlas(slas: SupportSla[]): SlaGroup[] {
  const rank = (priority: string) => {
    const index = (SLA_PRIORITY_ORDER as readonly string[]).indexOf(priority)
    return index === -1 ? SLA_PRIORITY_ORDER.length : index
  }

  const known = SLA_TICKET_ORDER as readonly string[]
  const extra = [...new Set(slas.map((sla) => sla.ticketType))].filter(
    (type) => !known.includes(type),
  )

  return [...known, ...extra]
    .map((ticketType) => ({
      ticketType,
      label: SLA_TICKET_LABELS[ticketType] ?? ticketType,
      slas: slas
        .filter((sla) => sla.ticketType === ticketType)
        .sort((a, b) => rank(a.priority) - rank(b.priority)),
    }))
    .filter((group) => group.slas.length > 0)
}
