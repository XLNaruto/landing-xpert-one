"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type RotatingWordProps = {
  words: readonly string[]
  className?: string
  /** Milliseconds each word holds before the next rolls in. */
  interval?: number
}

/**
 * One slot that rolls through a list of words. Every word sits in the same
 * grid cell (invisibly, bar the current one), so the slot is always as wide
 * as the longest word and the line around it never jumps.
 *
 * The server renders the first word; screen readers get the whole list once
 * instead of a word that changes under them. Holds still under
 * `prefers-reduced-motion`.
 */
export function RotatingWord({
  words,
  className,
  interval = 2200,
}: RotatingWordProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion || words.length < 2) return
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % words.length),
      interval,
    )
    return () => clearInterval(timer)
  }, [interval, reduceMotion, words.length])

  return (
    <span
      className={cn(
        "relative inline-grid justify-items-start overflow-hidden text-left",
        className,
      )}
    >
      <span className="sr-only">{words.join(", ")}</span>
      {words.map((word) => (
        <span key={word} aria-hidden className="invisible [grid-area:1/1]">
          {word}
        </span>
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          aria-hidden
          className="[grid-area:1/1]"
          initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
