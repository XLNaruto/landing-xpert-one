"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
} from "framer-motion"
import { useEffect, useRef, type ReactNode } from "react"

type ParallaxProps = {
  /** Optional: a pure decoration layer is often the className alone. */
  children?: ReactNode
  className?: string
  /**
   * Pixels of travel across a full pass through the viewport. Positive drifts
   * the layer up (it lags the page); negative pushes it the other way — mix
   * signs between layers to pull them apart in depth.
   */
  distance?: number
  /** Also pushed back along Z, so it sits behind its siblings in the stack. */
  depth?: number
  as?: "div" | "span" | "li"
  /** Forwarded, since most parallax layers are pure decoration. */
  "aria-hidden"?: boolean
}

/**
 * A layer that scrolls at its own speed.
 *
 * Two things keep it safe over content that matters for LCP. It only ever
 * *translates* — it never starts hidden, so the server HTML paints in place.
 * And the travel is measured from wherever the layer is when it first paints,
 * not from an absolute position in the page: a layer that is already on
 * screen at load stays exactly where the layout put it and drifts from there,
 * instead of jumping to a computed offset one frame after hydration.
 *
 * Pairs with Lenis — the scroll position is already eased, so there is no
 * spring on top of it.
 */
export function Parallax({
  children,
  className,
  distance = 60,
  depth = 0,
  as = "div",
  "aria-hidden": ariaHidden,
}: ParallaxProps) {
  /* The three tags share every prop this component sets; the cast just
     collapses their ref types so one `useRef` fits all of them. */
  const Component = motion[as] as typeof motion.div
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const y = useMotionValue(0)

  /* 0 as the layer's top meets the bottom of the viewport, 1 as its bottom
     leaves the top — one full pass, whatever the element's height. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  useEffect(() => {
    if (reduceMotion) return

    const origin = scrollYProgress.get()
    const update = (progress: number) =>
      y.set((origin - progress) * distance * 2)

    update(origin)
    return scrollYProgress.on("change", update)
  }, [distance, reduceMotion, scrollYProgress, y])

  return (
    <Component
      ref={ref}
      aria-hidden={ariaHidden}
      className={className}
      style={
        reduceMotion
          ? undefined
          : { y, z: depth, transformPerspective: depth ? 1200 : undefined }
      }
    >
      {children}
    </Component>
  )
}
