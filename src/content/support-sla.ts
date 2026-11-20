/**
 * How a plan's support-response promises read on screen — mirrors the
 * SLA_* constants in app-xpert-one's billing feature, so a plan reads the
 * same on the landing page as on the in-app billing page.
 */

export const SLA_TICKET_LABELS: Record<string, string> = {
  technical: "Technical",
  billing: "Billing",
}

export const SLA_PRIORITY_LABELS: Record<string, string> = {
  normal: "Normal",
  medium: "Medium",
  high: "High",
  critical: "Critical",
}

/** Least to most urgent — the API returns SLAs in storage order. */
export const SLA_PRIORITY_ORDER = ["normal", "medium", "high", "critical"] as const

/** Technical before billing — the one people look up first goes first. */
export const SLA_TICKET_ORDER = ["technical", "billing"] as const

/** How a priority paints, rising with urgency. */
export const SLA_PRIORITY_VARIANTS: Record<string, string> = {
  normal: "bg-muted text-muted-foreground",
  medium: "bg-brand-muted text-accent-foreground",
  high: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  critical: "bg-destructive/12 text-destructive",
}
