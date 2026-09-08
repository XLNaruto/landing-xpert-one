"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

type FadeInProps = {
  children: ReactNode
  className?: string
  /** Seconds to wait before this element animates. */
  delay?: number
  /** Direction the element travels in from. */
  from?: "bottom" | "left" | "right" | "none"
  as?: "div" | "section" | "li" | "span"
}

const offsets = {
  bottom: { x: 0, y: 24 },
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
  none: { x: 0, y: 0 },
}

/**
 * Thin client boundary: whatever it wraps stays a Server Component.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  from = "bottom",
  as = "div",
}: FadeInProps) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]
  const offset = reduceMotion ? offsets.none : offsets[from]

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </Component>
  )
}
