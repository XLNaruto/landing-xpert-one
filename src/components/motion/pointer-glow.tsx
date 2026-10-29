"use client"

import { motion, useReducedMotion, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * A large soft light that trails the pointer across its positioned parent —
 * the aurora that follows the reader around the hero. Purely decorative.
 *
 * Inert on touch screens and under `prefers-reduced-motion`: it simply
 * rests where the layout puts it.
 */
export function PointerGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const spring = { stiffness: 60, damping: 20, mass: 0.8 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  useEffect(() => {
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent || reduceMotion) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    const onPointerMove = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect()
      x.set(event.clientX - rect.left - el.offsetWidth / 2)
      y.set(event.clientY - rect.top - el.offsetHeight / 2)
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", onPointerMove)
  }, [reduceMotion, x, y])

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{ x, y }}
      className={cn(
        "pointer-events-none absolute top-0 left-0 size-[36rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--brand)_35%,transparent),transparent_65%)] blur-2xl",
        className,
      )}
    />
  )
}
