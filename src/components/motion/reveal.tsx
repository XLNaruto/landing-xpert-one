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

type RevealWordsProps = {
  text: string
  /** A tail of `text` set in the animated brand gradient. */
  accent?: string
  /** Seconds before the first word. */
  delay?: number
  /** Seconds between one word and the next. */
  step?: number
}

/**
 * The hero headline's word-by-word entrance — each word rises out of a blur
 * in turn. CSS only, like <Reveal>, because this is the LCP element: the
 * words start animating on first paint, not after hydration.
 */
export function RevealWords({
  text,
  accent,
  delay = 0,
  step = 0.07,
}: RevealWordsProps) {
  const lead = accent ? text.replace(accent, "").trim() : text
  const words = [
    ...lead.split(" ").map((word) => ({ word, accent: false })),
    ...(accent ? accent.split(" ") : []).map((word) => ({ word, accent: true })),
  ]

  return words.map(({ word, accent: isAccent }, index) => (
    <span key={index}>
      <span
        className="reveal-word"
        style={{ animationDelay: `${delay + index * step}s` } as CSSProperties}
      >
        {isAccent ? <span className="text-gradient">{word}</span> : word}
      </span>
      {index < words.length - 1 && " "}
    </span>
  ))
}
