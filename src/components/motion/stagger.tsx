"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

type StaggerProps = {
  children: ReactNode
  className?: string
  as?: "div" | "ul" | "section"
}

type StaggerItemProps = {
  children: ReactNode
  className?: string
  as?: "div" | "li"
}

/** Wrap a grid or list; every <StaggerItem> inside enters in sequence. */
export function Stagger({ children, className, as = "div" }: StaggerProps) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]

  return (
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
  )
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion()
  const Component = motion[as]

  return (
    <Component
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
    >
      {children}
    </Component>
  )
}
