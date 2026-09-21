"use client"

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion"
import { useEffect, useState, type PointerEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type TiltProps = {
  children: ReactNode
  className?: string
  /** Maximum rotation in degrees at the corners of the card. */
  max?: number
  /** A light sheen that tracks the pointer across the surface. */
  glare?: boolean
}

/**
 * A card that leans toward the pointer.
 *
 * Deliberately inert unless the input device can actually hover: on a
 * touchscreen a tilt either never fires or fires on tap and reads as a bug,
 * so `(pointer: fine)` gates the whole thing and phones get the plain card.
 * Same for `prefers-reduced-motion`.
 *
 * The rotation is spring-damped rather than transitioned so a fast pointer
 * sweep trails slightly instead of snapping between frames.
 */
export function Tilt({
  children,
  className,
  max = 7,
  glare = true,
}: TiltProps) {
  const reduceMotion = useReducedMotion()
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)")
    const sync = () => setCanHover(query.matches)

    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  /* -0.5 … 0.5 across each axis of the card. */
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 220, damping: 22, mass: 0.6 }
  const rotateX = useSpring(0, spring)
  const rotateY = useSpring(0, spring)
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 20 })
  const glareBackground = useMotionTemplate`radial-gradient(22rem circle at ${px}px ${py}px, rgb(255 255 255 / 0.28), transparent 60%)`

  const active = canHover && !reduceMotion

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!active) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    px.set(x)
    py.set(y)
    rotateY.set((x / rect.width - 0.5) * max * 2)
    rotateX.set(-(y / rect.height - 0.5) * max * 2)
    glareOpacity.set(1)
  }

  const onPointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    glareOpacity.set(0)
  }

  return (
    <motion.div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={
        active
          ? {
              rotateX,
              rotateY,
              transformPerspective: 900,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      className={cn("relative", className)}
    >
      {children}

      {glare && active && (
        <motion.span
          aria-hidden
          /* Sits above the card's own content but inherits its rounding from
             the card, so the sheen stops at the border like a real highlight. */
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-soft-light"
          style={{ opacity: glareOpacity, background: glareBackground }}
        />
      )}
    </motion.div>
  )
}
