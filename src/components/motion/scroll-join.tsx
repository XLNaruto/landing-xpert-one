"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion"
import { useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ScrollJoinProps = {
  left: ReactNode
  right: ReactNode
  className?: string
  leftClassName?: string
  rightClassName?: string
}

/* A firm spring: the scroll drives the travel, the spring adds the snap. */
const SNAP = { stiffness: 260, damping: 24, mass: 0.6 }

/**
 * Two panels that assemble into one card in two scroll beats: the left one
 * swipes in from its side first, then the right one slides in and snaps onto
 * it, with a flash of light along the seam as they join. Scroll-linked, so
 * scrolling back up pulls them apart in reverse.
 *
 * Each panel draws its own background, border and outer corners — there is
 * no shared card behind them, since that would show through while they are
 * apart. Stacked below `lg:` the same beats run top half, then bottom half.
 */
export function ScrollJoin({
  left,
  right,
  className,
  leftClassName,
  rightClassName,
}: ScrollJoinProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  /* 0 as the card's top enters the viewport, 1 once its centre reaches the
     centre of the screen. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })

  /* Beat one: the left panel swipes in. */
  const leftX = useSpring(
    useTransform(scrollYProgress, [0, 0.45], ["-70%", "0%"]),
    SNAP,
  )
  const leftRotate = useSpring(
    useTransform(scrollYProgress, [0, 0.45], [-6, 0]),
    SNAP,
  )
  const leftOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  /* Beat two: the right panel arrives and attaches. */
  const rightX = useSpring(
    useTransform(scrollYProgress, [0.45, 0.9], ["70%", "0%"]),
    SNAP,
  )
  const rightRotate = useSpring(
    useTransform(scrollYProgress, [0.45, 0.9], [6, 0]),
    SNAP,
  )
  const rightOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1])

  /* The seam lights up at the moment of contact, then fades. */
  const seam = useTransform(scrollYProgress, [0.82, 0.9, 1], [0, 1, 0])

  const neutral = { x: 0, rotate: 0, opacity: 1 } as MotionStyle

  return (
    <div ref={ref} className={cn("relative grid lg:grid-cols-2", className)}>
      <motion.div
        className={cn("relative z-10 origin-bottom-left", leftClassName)}
        style={
          reduceMotion
            ? neutral
            : ({ x: leftX, rotate: leftRotate, opacity: leftOpacity } as MotionStyle)
        }
      >
        {left}
      </motion.div>

      <motion.div
        className={cn("relative origin-bottom-right", rightClassName)}
        style={
          reduceMotion
            ? neutral
            : ({
                x: rightX,
                rotate: rightRotate,
                opacity: rightOpacity,
              } as MotionStyle)
        }
      >
        {right}
      </motion.div>

      {!reduceMotion && (
        <motion.span
          aria-hidden
          style={{ opacity: seam }}
          className="pointer-events-none absolute z-20 bg-linear-to-r from-transparent via-brand to-transparent shadow-[0_0_24px_4px_var(--brand)] max-lg:inset-x-[10%] max-lg:top-1/2 max-lg:h-0.5 lg:inset-y-[10%] lg:left-1/2 lg:w-0.5 lg:-translate-x-1/2 lg:bg-linear-to-b"
        />
      )}
    </div>
  )
}
