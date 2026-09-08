import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

type MarqueeProps = {
  children: ReactNode
  className?: string
  /** Seconds for one full pass. Longer = calmer. */
  duration?: number
  /**
   * How many times the row is repeated inside each track. A track shorter
   * than the viewport would leave a visible gap at the end of its pass, and
   * CSS can't measure the viewport — so repeat enough to cover a wide screen.
   */
  repeat?: number
}

/**
 * CSS-only infinite marquee — no client JS, so whatever it wraps stays a
 * Server Component. Two identical tracks each travel their own full width,
 * which is what makes the loop seamless; the second is aria-hidden so a
 * screen reader hears the list once.
 *
 * Under `prefers-reduced-motion` the animation stops and the row becomes a
 * plain scrollable strip instead of sliding on its own.
 */
export function Marquee({
  children,
  className,
  duration = 30,
  repeat = 3,
}: MarqueeProps) {
  const track =
    "flex shrink-0 items-center gap-4 pr-4 animate-marquee transform-gpu will-change-transform backface-hidden [animation-duration:var(--marquee-duration)] group-hover:[animation-play-state:paused] motion-reduce:animate-none md:gap-6 md:pr-6"

  const row = Array.from({ length: repeat }, (_, i) => (
    <div key={i} className="flex shrink-0 items-center gap-4 md:gap-6">
      {children}
    </div>
  ))

  return (
    <div
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      className={cn(
        "group relative flex w-full overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        "motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]",
        className,
      )}
    >
      <div className={track}>{row}</div>
      <div aria-hidden className={track}>
        {row}
      </div>
    </div>
  )
}
