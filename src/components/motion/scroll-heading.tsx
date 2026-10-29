"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
} from "framer-motion"
import { useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ScrollHeadingProps = {
  children: ReactNode
  className?: string
}

/* Arriving, settled, still settled, leaving — one pass through the viewport. */
const BEATS = [0, 0.3, 0.7, 1]

/**
 * A section header (eyebrow, title, lead) that rises in as it scrolls into
 * view and lifts away fading as it scrolls out the top. The title's words
 * animate on their own inside it (<WordReveal>); this moves the block as a
 * whole. Scroll-linked both ways.
 */
export function ScrollHeading({ children, className }: ScrollHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, BEATS, [60, 0, 0, -40])
  const scale = useTransform(scrollYProgress, BEATS, [0.96, 1, 1, 0.97])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [0, 1, 1, 0.2])

  return (
    <motion.div
      ref={ref}
      className={cn("origin-bottom", className)}
      /* Neutral values, not a dropped prop, under reduced motion — the
         server render starts lowered and has to be put back. */
      style={
        (reduceMotion
          ? { y: 0, scale: 1, opacity: 1 }
          : { y, scale, opacity }) as MotionStyle
      }
    >
      {children}
    </motion.div>
  )
}
