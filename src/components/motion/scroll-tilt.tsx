"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"

type ScrollTiltProps = {
  children: ReactNode
  className?: string
  /** Degrees it is laid back by before the reader scrolls to it. */
  angle?: number
}

/**
 * A product shot that starts laid back like a screen on a desk and stands up
 * to face the reader as it scrolls into place. Scroll-linked, not a one-off
 * entrance, so scrolling back up lays it down again.
 *
 * It never starts hidden — the server HTML paints it tilted but visible.
 */
export function ScrollTilt({ children, className, angle = 24 }: ScrollTiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.3"],
  })
  const rotateX = useTransform(scrollYProgress, [0, 1], [angle, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])

  return (
    <motion.div
      ref={ref}
      className={className}
      /* Neutral values rather than no style: the server render is already
         tilted, and dropping the prop after hydration would leave it so. */
      style={{
        rotateX: reduceMotion ? 0 : rotateX,
        scale: reduceMotion ? 1 : scale,
        transformPerspective: 1200,
        transformOrigin: "50% 0%",
      }}
    >
      {children}
    </motion.div>
  )
}
