"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion"
import { Children, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ScrollStepsProps = {
  children: ReactNode
  className?: string
  /** Applied to each generated <li>. */
  itemClassName?: string
}

/**
 * A numbered process that builds itself as the reader scrolls: a line draws
 * through the step badges — across on `md:` and up, down the column below
 * it — and each card rises and snaps onto the line as the line reaches it.
 * Scroll-linked, so scrolling back up takes the sequence apart again.
 *
 * The line runs from the first badge's centre to the last one's, which
 * assumes badges centred 2.875rem in from each card's top-left corner (1.5rem
 * card padding + half a 2.75rem badge) and a 2.5rem grid gap from `md:`.
 * Cards are opaque, so only the stretches between them show.
 *
 * Each <li> also gets `--step-on`, 0 → 1 as its card lands, for the content to
 * light up with (the badge ring, in the how-it-works section).
 *
 * Renders a <ul>; each child becomes an <li>.
 */
export function ScrollSteps({
  children,
  className,
  itemClassName,
}: ScrollStepsProps) {
  const ref = useRef<HTMLUListElement>(null)
  const reduceMotion = useReducedMotion()
  const items = Children.toArray(children)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  })
  const progress = reduceMotion ? 1 : scrollYProgress

  const line =
    "pointer-events-none absolute top-[2.875rem] left-[2.875rem] w-0.5 md:h-0.5 bottom-[2.875rem] md:bottom-auto md:w-[calc((100%-5rem)*2/3+5rem)]"

  return (
    <motion.ul
      ref={ref}
      className={cn("relative", className)}
      style={{ "--line": progress } as MotionStyle}
    >
      <span aria-hidden className={cn(line, "rounded-full bg-border")} />
      <span
        aria-hidden
        className={cn(
          line,
          "origin-top rounded-full shadow-[0_0_12px_var(--brand)] bg-linear-to-b from-brand to-accent-2 [transform:scaleY(var(--line))] md:origin-left md:bg-linear-to-r md:[transform:scaleX(var(--line))]",
        )}
      />

      {items.map((child, index) => (
        <StepItem
          key={index}
          index={index}
          total={items.length}
          progress={scrollYProgress}
          reduceMotion={!!reduceMotion}
          className={itemClassName}
        >
          {child}
        </StepItem>
      ))}
    </motion.ul>
  )
}

function StepItem({
  children,
  index,
  total,
  progress,
  reduceMotion,
  className,
}: {
  children: ReactNode
  index: number
  total: number
  progress: MotionValue<number>
  reduceMotion: boolean
  className?: string
}) {
  /* Each card owns an even slice of the line's travel and lands just as the
     line arrives at its badge. */
  const end = (index + 1) / total
  const range = [Math.max(0, end - 0.45), end]

  const y = useTransform(progress, range, [90, 0])
  const scale = useTransform(progress, range, [0.88, 1])
  const rotateX = useTransform(progress, range, [22, 0])
  const opacity = useTransform(progress, [range[0], range[0] + 0.2], [0, 1])
  /* The ring flares only in the last stretch, so it reads as the snap. */
  const on = useTransform(progress, [end - 0.08, end], [0, 1])

  return (
    <motion.li
      className={cn("relative z-10 origin-bottom", className)}
      style={
        reduceMotion
          ? ({ y: 0, scale: 1, rotateX: 0, opacity: 1, "--step-on": 1 } as MotionStyle)
          : ({
              y,
              scale,
              rotateX,
              opacity,
              transformPerspective: 1000,
              "--step-on": on,
            } as MotionStyle)
      }
    >
      {children}
    </motion.li>
  )
}
