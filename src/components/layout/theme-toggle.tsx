"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useSyncExternalStore } from "react"
import { readTheme, setTheme, subscribeTheme, type Theme } from "@/lib/theme"
import { cn } from "@/lib/utils"

/* Each click moves one step round the cycle. */
const modes: Record<Theme, { icon: typeof Sun; label: string; next: Theme }> =
  {
    light: { icon: Sun, label: "Light", next: "dark" },
    dark: { icon: Moon, label: "Dark", next: "system" },
    system: { icon: Monitor, label: "System", next: "light" },
  }

/**
 * A round button that cycles light → dark → system. The icon shows the mode
 * in force; the tooltip says what a click will switch to.
 *
 * The server can't know the reader's cookie, so it renders "system" and the
 * real choice takes over on hydration — the page colours are already right by
 * then, set by the pre-paint script in the root layout.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readTheme,
    () => "system" as const,
  )
  const { icon: Icon, label, next } = modes[theme]
  const nextLabel = modes[next].label

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${label}. Switch to ${nextLabel}`}
      className={cn(
        "group/theme relative grid size-9 cursor-pointer place-items-center rounded-full border border-border bg-card/70 text-brand shadow-sm backdrop-blur transition-all duration-300 outline-none hover:border-brand/40 hover:shadow-md hover:shadow-brand/15 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      {/* Keyed on the mode, so each switch replays the little spin-in. */}
      <Icon
        key={theme}
        className="size-4.5 animate-in duration-500 spin-in-90 fade-in"
        aria-hidden
      />

      <span
        aria-hidden
        className="pointer-events-none absolute top-full right-1/2 mt-2 translate-x-1/2 translate-y-1 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-all duration-200 group-hover/theme:translate-y-0 group-hover/theme:opacity-100 group-focus-visible/theme:translate-y-0 group-focus-visible/theme:opacity-100"
      >
        Switch to {nextLabel}
      </span>
    </button>
  )
}
