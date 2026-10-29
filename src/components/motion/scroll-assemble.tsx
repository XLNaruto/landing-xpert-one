"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import {
  Children,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

type ScrollAssembleProps = {
  children: ReactNode
  className?: string
  /** Applied to each generated <li>. */
  itemClassName?: string
  /** Columns at `lg:` — decides which side each card swings in from. */
  columns?: number
}

const WIDE = "(min-width: 1024px)"

function subscribeWide(callback: () => void) {
  const query = window.matchMedia(WIDE)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

/**
 * A grid that puts itself together as the reader scrolls. On a wide screen the
 * outer columns swing in from their own side, tipped outward, while the middle
 * column rises from below; on a phone each card simply rises into place.
 *
 * Scroll-linked rather than a one-off entrance: every card is tied to its own
 * position on screen, so rows assemble in turn and scrolling back up takes
 * them apart again. Renders a <ul>; each child becomes an <li>.
 */
export function ScrollAssemble({
  children,
  className,
  itemClassName,
  columns = 3,
}: ScrollAssembleProps) {
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  )

  return (
    <ul className={className}>
      {Children.toArray(children).map((child, index) => (
        <AssembleItem
          key={index}
          /* -1 left column, 0 middle, 1 right column. */
          side={wide ? (index % columns) - (columns - 1) / 2 : 0}
          className={itemClassName}
        >
          {child}
        </AssembleItem>
      ))}
    </ul>
  )
}

function AssembleItem({
  children,
  side,
  className,
}: {
  children: ReactNode
  side: number
  className?: string
}) {
  const ref = useRef<HTMLLIElement>(null)
  const reduceMotion = useReducedMotion()
  /* 0 as the card's top enters the bottom of the screen, 1 once it has
     travelled up to 60% of the way. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.6"],
  })
  /* The middle card lands first; the outer ones trail it slightly, so each
     row closes in from the edges. */
  const start = Math.abs(side) * 0.12
  const range = [start, 1]

  const x = useTransform(scrollYProgress, range, [side * 160, 0])
  const y = useTransform(scrollYProgress, range, [side === 0 ? 120 : 60, 0])
  const rotate = useTransform(scrollYProgress, range, [side * 8, 0])
  const rotateX = useTransform(scrollYProgress, range, [side === 0 ? 25 : 0, 0])
  const scale = useTransform(scrollYProgress, range, [0.85, 1])
  const opacity = useTransform(scrollYProgress, [start, start + 0.5], [0, 1])

  return (
    <motion.li
      ref={ref}
      className={cn("origin-bottom", className)}
      /* Neutral values, not a dropped prop, under reduced motion — the
         server render starts scattered and has to be put back. */
      style={
        reduceMotion
          ? { x: 0, y: 0, rotate: 0, rotateX: 0, scale: 1, opacity: 1 }
          : { x, y, rotate, rotateX, scale, opacity, transformPerspective: 1000 }
      }
    >
      {children}
    </motion.li>
  )
}
