"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * The "request received" badge: the disc springs in, a ring ripples out from
 * it, then the circle and the tick draw themselves. With reduced motion it
 * simply appears, fully drawn.
 */
export function SuccessCheck({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const t = (delay: number, duration: number) =>
    reduceMotion ? { duration: 0 } : { delay, duration, ease: "easeOut" as const }

  return (
    <span className={cn("relative grid size-16 place-items-center", className)}>
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-brand/25"
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: "easeOut" }}
        />
      )}

      <motion.span
        className="relative grid size-16 place-items-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-brand/30"
        initial={reduceMotion ? false : { scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={
          reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 16 }
        }
      >
        <svg viewBox="0 0 24 24" className="size-9" fill="none" aria-hidden>
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            initial={{ pathLength: reduceMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={t(0.2, 0.5)}
          />
          <motion.path
            d="M7.5 12.5l3 3 6-6.5"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduceMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={t(0.45, 0.4)}
          />
        </svg>
      </motion.span>
    </span>
  )
}
