"use client"

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from "framer-motion"
import { useEffect, useRef } from "react"

type CountUpProps = {
  /** The final figure as content writes it — "10", "10,000+", "99%". */
  value: string
  className?: string
  /** Seconds the count takes to land. */
  duration?: number
}

/**
 * Counts a stat up from zero the first time it scrolls into view.
 *
 * The server HTML carries the final value, so the figure is correct before
 * hydration, for crawlers, and under `prefers-reduced-motion`. Only the
 * leading number animates; any prefix or suffix ("+", "%") stays put.
 */
export function CountUp({ value, className, duration = 1.4 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduceMotion = useReducedMotion()

  const match = value.match(/^(\D*)([\d,]+)(.*)$/)
  const prefix = match?.[1] ?? ""
  const target = match ? Number(match[2].replaceAll(",", "")) : 0
  const suffix = match?.[3] ?? ""
  const numeric = match !== null

  const count = useMotionValue(target)
  const display = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString("en-IN"),
  )

  useEffect(() => {
    if (!numeric || !inView || reduceMotion) return
    count.set(0)
    const controls = animate(count, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [count, duration, inView, numeric, reduceMotion, target])

  if (!numeric) return <span className={className}>{value}</span>

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}
