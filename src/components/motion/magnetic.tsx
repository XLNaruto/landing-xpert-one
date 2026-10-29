"use client"

import { motion, useReducedMotion, useSpring } from "framer-motion"
import type { PointerEvent, ReactNode } from "react"
import { cn } from "@/lib/utils"

type MagneticProps = {
  children: ReactNode
  className?: string
  /** Share of the pointer's offset from centre the child follows. */
  strength?: number
}

/**
 * Pulls its child toward the pointer while hovered and springs it home on
 * leave — a CTA that leans into the hand reaching for it.
 *
 * Only a mouse pulls it — a touch drag or tap leaves it still — and never
 * under `prefers-reduced-motion`.
 */
export function Magnetic({ children, className, strength = 0.3 }: MagneticProps) {
  const reduceMotion = useReducedMotion()
  const spring = { stiffness: 180, damping: 14, mass: 0.4 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    /* A touch "move" is a drag or a tap — only a real mouse pulls. */
    if (reduceMotion || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * strength)
    y.set((event.clientY - rect.top - rect.height / 2) * strength)
  }

  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={reduceMotion ? undefined : { x, y }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  )
}
