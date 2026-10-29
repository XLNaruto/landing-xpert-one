"use client"

import type { PointerEvent, ReactNode } from "react"
import { cn } from "@/lib/utils"

type SpotlightProps = {
  children: ReactNode
  className?: string
  id?: string
  as?: "div" | "article"
}

/**
 * A card lit from wherever the pointer is: it writes the pointer position to
 * `--spot-x` / `--spot-y`, and the `.spotlight` rules in globals.css paint a
 * soft light there, under the card's content and over its background.
 *
 * No Framer Motion and no state — two CSS variables per move, so it costs
 * nothing between moves. On touch the light simply never shows.
 */
export function Spotlight({
  children,
  className,
  id,
  as: Component = "div",
}: SpotlightProps) {
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty(
      "--spot-x",
      `${event.clientX - rect.left}px`,
    )
    event.currentTarget.style.setProperty(
      "--spot-y",
      `${event.clientY - rect.top}px`,
    )
  }

  return (
    <Component
      id={id}
      onPointerMove={onPointerMove}
      className={cn("spotlight", className)}
    >
      {children}
    </Component>
  )
}
