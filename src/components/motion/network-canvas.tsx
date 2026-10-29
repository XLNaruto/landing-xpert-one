"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type NetworkCanvasProps = {
  className?: string
  /** Pixels within which two nodes are joined by a line. */
  linkDistance?: number
}

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
}

/** Radius around the pointer that nodes are pushed out of. */
const POINTER_RADIUS = 160

/**
 * The hero's living background: a field of drifting nodes that join up with
 * their neighbours — "everything connected", drawn rather than said. The
 * pointer pushes a clearing through the field and links itself to whatever
 * is near, so the page answers the reader's hand.
 *
 * Plain 2D canvas, no library. It only animates while it is on screen and the
 * tab is visible; under `prefers-reduced-motion` it draws one still frame.
 * Colours come from the theme tokens, so it follows the palette.
 */
export function NetworkCanvas({
  className,
  linkDistance = 130,
}: NetworkCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const styles = getComputedStyle(canvas)
    const brand = styles.getPropertyValue("--brand").trim() || "#38bdf8"
    const accent = styles.getPropertyValue("--accent-2").trim() || "#818cf8"

    let width = 0
    let height = 0
    let nodes: Node[] = []
    const pointer = { x: -9999, y: -9999 }

    const seed = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      /* Density scales with area, capped so a 4K screen stays cheap. */
      const count = Math.min(110, Math.round((width * height) / 12000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.8,
        color: Math.random() < 0.7 ? brand : accent,
      }))
    }

    const step = () => {
      for (const node of nodes) {
        const dx = node.x - pointer.x
        const dy = node.y - pointer.y
        const distance = Math.hypot(dx, dy)
        if (distance > 0 && distance < POINTER_RADIUS) {
          const push = (1 - distance / POINTER_RADIUS) * 2.2
          node.x += (dx / distance) * push
          node.y += (dy / distance) * push
        }

        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1
        node.x = Math.max(0, Math.min(width, node.x))
        node.y = Math.max(0, Math.min(height, node.y))
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const distance = Math.hypot(a.x - b.x, a.y - b.y)
          if (distance > linkDistance) continue
          ctx.globalAlpha = (1 - distance / linkDistance) * 0.35
          ctx.strokeStyle = a.color
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }

        /* The pointer is a node too — brighter, so the reader sees it. */
        const toPointer = Math.hypot(a.x - pointer.x, a.y - pointer.y)
        if (toPointer < POINTER_RADIUS * 1.5) {
          ctx.globalAlpha = (1 - toPointer / (POINTER_RADIUS * 1.5)) * 0.7
          ctx.strokeStyle = brand
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(pointer.x, pointer.y)
          ctx.stroke()
        }
      }

      for (const node of nodes) {
        ctx.globalAlpha = 0.9
        ctx.fillStyle = node.color
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    seed()
    draw()
    if (reduceMotion) return

    let frame = 0
    let onScreen = true
    const loop = () => {
      step()
      draw()
      frame = requestAnimationFrame(loop)
    }
    const sync = () => {
      cancelAnimationFrame(frame)
      if (onScreen && !document.hidden) frame = requestAnimationFrame(loop)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }
    const onPointerLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    visibility.observe(canvas)
    const resize = new ResizeObserver(() => seed())
    resize.observe(canvas)

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    document.addEventListener("pointerleave", onPointerLeave)
    document.addEventListener("visibilitychange", sync)
    sync()

    return () => {
      cancelAnimationFrame(frame)
      visibility.disconnect()
      resize.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerleave", onPointerLeave)
      document.removeEventListener("visibilitychange", sync)
    }
  }, [linkDistance])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none block size-full", className)}
    />
  )
}
