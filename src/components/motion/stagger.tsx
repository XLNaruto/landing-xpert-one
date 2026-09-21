"use client"

import { motion, useReducedMotion } from "framer-motion"
import { createContext, useContext, type ReactNode } from "react"

type StaggerProps = {
  children: ReactNode
  className?: string
  as?: "div" | "ul" | "section"
  /**
   * Cards tip up out of the page instead of sliding: the grid's entrance in
   * 3D. Set on the container so a row can't end up half flat, half tipped.
   */
  depth?: boolean
}

type StaggerItemProps = {
  children: ReactNode
  className?: string
  as?: "div" | "li"
}

/** Set by <Stagger depth>, read by every <StaggerItem> under it. */
const DepthContext = createContext(false)

/** Wrap a grid or list; every <StaggerItem> inside enters in sequence. */
export function Stagger({
  children,
  className,
  as = "div",
  depth = false,
}: StaggerProps) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]

  return (
    <DepthContext.Provider value={depth}>
      <Component
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
          },
        }}
      >
        {children}
      </Component>
    </DepthContext.Provider>
  )
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion()
  const depth = useContext(DepthContext) && !reduceMotion
  const Component = motion[as]

  return (
    <Component
      className={className}
      variants={{
        hidden: depth
          ? {
              opacity: 0,
              y: 36,
              rotateX: 14,
              z: -100,
              /* Per-card perspective, so a row of three tips identically
                 rather than fanning out from the grid's centre. */
              transformPerspective: 1400,
            }
          : { opacity: 0, y: reduceMotion ? 0 : 20 },
        visible: depth
          ? { opacity: 1, y: 0, rotateX: 0, z: 0 }
          : { opacity: 1, y: 0 },
      }}
      /* The tip-up travels further, so it gets longer and a softer curve. */
      transition={
        depth
          ? { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
          : { duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }
      }
      style={depth ? { transformOrigin: "50% 100%" } : undefined}
    >
      {children}
    </Component>
  )
}
