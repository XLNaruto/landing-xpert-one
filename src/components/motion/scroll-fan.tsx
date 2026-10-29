"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion"
import {
  Children,
  isValidElement,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

type ScrollFanProps = {
  children: ReactNode
  className?: string
}

type ScrollFanItemProps = {
  children: ReactNode
  className?: string
}

const WIDE = "(min-width: 1024px)"

function subscribeWide(callback: () => void) {
  const query = window.matchMedia(WIDE)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

/*
 * Scroll progress across one full pass of the element through the viewport,
 * split into four beats: arriving, settled in, still settled, leaving.
 */
const BEATS = [0, 0.3, 0.7, 1]

/**
 * A row of cards dealt out like a hand and gathered back up with the scroll.
 *
 * From `lg:` the outer cards start tucked behind the middle one — slid in
 * toward it, tipped and shrunk — and fan out to their places as the row
 * arrives, while the middle card rises to the front. As the row leaves the
 * top of the screen the hand closes again. Below `lg:` the cards are a
 * single column, so each one simply rises in and sinks back out on its own
 * scroll position.
 *
 * Scroll-linked both ways, so scrolling back up replays it in reverse.
 * Renders a <ul>; wrap each card in <ScrollFanItem>, which becomes its <li>.
 */
export function ScrollFan({ children, className }: ScrollFanProps) {
  const ref = useRef<HTMLUListElement>(null)
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  )
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const items = Children.toArray(children)

  return (
    <ul ref={ref} className={className}>
      {items.map((child, index) => (
        <FanCard
          key={isValidElement(child) ? (child.key ?? index) : index}
          /* -1 left, 0 middle, 1 right (for a row of three). */
          side={index - (items.length - 1) / 2}
          wide={wide}
          rowProgress={scrollYProgress}
          className={
            isValidElement<ScrollFanItemProps>(child)
              ? child.props.className
              : undefined
          }
        >
          {isValidElement<ScrollFanItemProps>(child)
            ? child.props.children
            : child}
        </FanCard>
      ))}
    </ul>
  )
}

/** Marks one card in a <ScrollFan>; its className lands on the <li>. */
export function ScrollFanItem({ children }: ScrollFanItemProps) {
  return <>{children}</>
}

function FanCard({
  children,
  side,
  wide,
  rowProgress,
  className,
}: {
  children: ReactNode
  side: number
  wide: boolean
  rowProgress: MotionValue<number>
  className?: string
}) {
  const ref = useRef<HTMLLIElement>(null)
  const reduceMotion = useReducedMotion()
  /* Stacked on a phone, each card is far from its neighbours, so it follows
     its own pass through the viewport rather than the row's. */
  const { scrollYProgress: ownProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const progress = wide ? rowProgress : ownProgress
  const fan = wide ? side : 0

  /* Tucked in behind the middle card at the start, open in the middle beats,
     drawn a quarter of the way back in as it leaves. */
  const x = useTransform(progress, BEATS, [
    `${-fan * 100}%`,
    "0%",
    "0%",
    `${-fan * 25}%`,
  ])
  const y = useTransform(progress, BEATS, [
    fan === 0 ? 120 : 60,
    0,
    0,
    -40,
  ])
  const rotate = useTransform(progress, BEATS, [fan * 10, 0, 0, -fan * 4])
  const scale = useTransform(progress, BEATS, [0.85, 1, 1, 0.92])
  const opacity = useTransform(progress, [0, 0.15, 0.8, 1], [0, 1, 1, 0.35])

  return (
    <motion.li
      ref={ref}
      /* The middle card is dealt on top of the others. */
      className={cn("relative origin-bottom", fan === 0 ? "z-10" : "z-0", className)}
      /* Neutral values, not a dropped prop, under reduced motion — the
         server render starts tucked in and has to be put back. */
      style={
        (reduceMotion
          ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
          : { x, y, rotate, scale, opacity }) as MotionStyle
      }
    >
      {children}
    </motion.li>
  )
}
