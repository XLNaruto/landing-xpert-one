import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

type RevealProps = {
  children: ReactNode
  className?: string
  /** Seconds to wait before this element animates. */
  delay?: number
  /** "none" fades in place, matching <FadeIn from="none">. */
  from?: "bottom" | "none"
  as?: "div" | "section" | "p" | "li" | "span"
}

/**
 * The above-the-fold counterpart of <FadeIn>: same entrance, done entirely in
 * CSS, so it is a Server Component and ships no JavaScript.
 *
 * <FadeIn> is Framer Motion, which means its children are server-rendered at
 * `opacity: 0` and stay invisible until the bundle has downloaded, parsed and
 * hydrated. For anything below the fold that is fine — it is off-screen
 * anyway. For the hero it was fatal: the <h1> is the Largest Contentful Paint
 * element, so LCP was being measured from the end of hydration rather than
 * from first paint (10.7s against Google's 2.5s target).
 *
 * A CSS animation starts on the first frame the element is painted, with no
 * JavaScript in the path at all.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "bottom",
  as: Component = "div",
}: RevealProps) {
  return (
    <Component
      className={cn(from === "none" ? "reveal-fade" : "reveal", className)}
      style={
        delay ? ({ animationDelay: `${delay}s` } as CSSProperties) : undefined
      }
    >
      {children}
    </Component>
  )
}
