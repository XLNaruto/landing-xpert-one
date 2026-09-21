"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

type Reveal3dProps = {
  children: ReactNode
  className?: string
  /** Seconds to wait before this element animates. */
  delay?: number
  /** Degrees of X-rotation it starts tipped back by. */
  angle?: number
  as?: "div" | "section" | "li" | "article"
}

/**
 * <FadeIn> with depth: the block starts tipped away from the reader and
 * pushed back along Z, then rights itself as it enters the viewport.
 *
 * The perspective is per-element (`transformPerspective`) rather than on a
 * shared parent, so every card gets its own vanishing point and a row of
 * three tips identically instead of fanning out from the grid's centre.
 *
 * For a whole grid of cards use <Stagger depth> — this one is for the single
 * large panels (a solution row, the demo panel) that enter on their own.
 */
export function Reveal3d({
  children,
  className,
  delay = 0,
  angle = 12,
  as = "div",
}: Reveal3dProps) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]

  if (reduceMotion) {
    return <Component className={className}>{children}</Component>
  }

  return (
    <Component
      className={className}
      initial={{
        opacity: 0,
        rotateX: angle,
        y: 40,
        z: -120,
        transformPerspective: 1400,
      }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0, z: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      /* A long, soft ease-out — the tip-up should settle, not snap. */
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "50% 100%" }}
    >
      {children}
    </Component>
  )
}
