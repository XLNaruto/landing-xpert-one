"use client"

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"

/**
 * A hairline across the top of the viewport that fills as the reader moves
 * down the page — a quiet "you are here" for a long single-page site.
 *
 * Under `prefers-reduced-motion` it is not rendered at all: it carries no
 * information the scrollbar doesn't already give.
 */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    restDelta: 0.001,
  })

  if (reduceMotion) return null

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-linear-to-r from-brand via-accent-2 to-brand"
      style={{ scaleX }}
    />
  )
}
