"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ScrollTextProps = {
  children: ReactNode
  className?: string
  /** 1 slides left as the page scrolls down, -1 slides right. */
  direction?: 1 | -1
}

/**
 * A row that slides sideways as the reader scrolls — the page's vertical
 * movement turned into horizontal drift. Pair two with opposite directions.
 * The row must be wider than the viewport; its parent clips it.
 */
export function ScrollText({ children, className, direction = 1 }: ScrollTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 1 ? ["0%", "-30%"] : ["-30%", "0%"],
  )

  return (
    <motion.div
      ref={ref}
      style={{ x: reduceMotion ? "-15%" : x }}
      className={cn("flex w-max", className)}
    >
      {children}
    </motion.div>
  )
}
