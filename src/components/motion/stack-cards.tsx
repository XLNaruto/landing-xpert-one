"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { Children, useRef, type CSSProperties, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type StackCardsProps = {
  children: ReactNode
  className?: string
}

/**
 * Cards that stack as the reader scrolls: each one pins under the header, the
 * next slides up over it, and the ones underneath shrink back a step so the
 * pile reads as depth. Every pinned card sits a little lower than the last,
 * leaving the top edge of each one showing.
 *
 * Desktop only (`lg:`). Below that a card is taller than the screen, and a
 * pinned card that tall would hide its own lower half under the next one — so
 * small screens get the plain column.
 *
 * The scale travels through a CSS variable rather than `transform` directly,
 * so the breakpoint can decide whether it applies at all.
 */
export function StackCards({ children, className }: StackCardsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const items = Children.toArray(children)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  return (
    <div ref={ref} className={cn("flex flex-col gap-8 md:gap-10", className)}>
      {items.map((child, index) => (
        <StackItem
          key={index}
          index={index}
          total={items.length}
          progress={scrollYProgress}
        >
          {child}
        </StackItem>
      ))}
    </div>
  )
}

function StackItem({
  children,
  index,
  total,
  progress,
}: {
  children: ReactNode
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const reduceMotion = useReducedMotion()
  /* The first card ends smallest — it has the most cards on top of it. */
  const targetScale = 1 - (total - 1 - index) * 0.05
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])

  return (
    <motion.div
      className="origin-top lg:sticky lg:top-[var(--stack-top)] lg:[transform:scale(var(--stack-scale))]"
      style={
        {
          "--stack-top": `${6 + index * 1.75}rem`,
          "--stack-scale": reduceMotion ? 1 : scale,
        } as CSSProperties
      }
    >
      {children}
    </motion.div>
  )
}
