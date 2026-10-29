"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
} from "framer-motion"
import { useRef, type ReactNode } from "react"

type ScrollInOutProps = {
  children: ReactNode
  className?: string
}

/* Arriving, settled, still settled, leaving — one pass through the viewport. */
const BEATS = [0, 0.3, 0.7, 1]

/**
 * A block that tips up out of the page as it scrolls in, sits flat while it
 * is being read, and sinks back as it scrolls out the top. Scroll-linked both
 * ways, so scrolling up replays it in reverse.
 *
 * For a whole band that already has its own inner motion (a carousel): the
 * wrapper moves the band, and leaves what happens inside it alone.
 */
export function ScrollInOut({ children, className }: ScrollInOutProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, BEATS, [100, 0, 0, -50])
  const rotateX = useTransform(scrollYProgress, BEATS, [24, 0, 0, -10])
  const scale = useTransform(scrollYProgress, BEATS, [0.88, 1, 1, 0.94])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3])

  return (
    <motion.div
      ref={ref}
      className={className}
      /* Neutral values, not a dropped prop, under reduced motion — the
         server render starts tipped back and has to be put upright. */
      style={
        (reduceMotion
          ? { y: 0, rotateX: 0, scale: 1, opacity: 1 }
          : {
              y,
              rotateX,
              scale,
              opacity,
              transformPerspective: 1200,
              transformOrigin: "50% 100%",
            }) as MotionStyle
      }
    >
      {children}
    </motion.div>
  )
}
