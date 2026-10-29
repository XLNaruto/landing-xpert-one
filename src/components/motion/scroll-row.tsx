"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
} from "framer-motion"
import { useRef, type ReactNode } from "react"

type ScrollRowProps = {
  children: ReactNode
  className?: string
  /** Position in its list — even rows come in from the left, odd from the right. */
  index: number
}

/* Arriving, settled, still settled, leaving — one pass through the viewport. */
const BEATS = [0, 0.25, 0.75, 1]

/**
 * One row of a list that weaves in with the scroll: rows rise into place
 * from alternating sides, and drift back the way they came as they leave the
 * top. Each row follows its own position on screen, so a long list fills in
 * line by line. Scroll-linked both ways.
 *
 * A plain wrapper <div> — safe around items that get their state from
 * context (accordion items), not from being direct children.
 */
export function ScrollRow({ children, className, index }: ScrollRowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const side = index % 2 === 0 ? -1 : 1

  const x = useTransform(scrollYProgress, BEATS, [side * 80, 0, 0, side * 40])
  const y = useTransform(scrollYProgress, BEATS, [40, 0, 0, -20])
  const opacity = useTransform(scrollYProgress, BEATS, [0, 1, 1, 0.2])
  const filter = useTransform(
    scrollYProgress,
    BEATS,
    ["blur(6px)", "blur(0px)", "blur(0px)", "blur(4px)"],
  )

  return (
    <motion.div
      ref={ref}
      className={className}
      /* Neutral values, not a dropped prop, under reduced motion — the
         server render starts offset and has to be put back. */
      style={
        (reduceMotion
          ? { x: 0, y: 0, opacity: 1, filter: "none" }
          : { x, y, opacity, filter }) as MotionStyle
      }
    >
      {children}
    </motion.div>
  )
}
