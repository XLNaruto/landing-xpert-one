"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { navLinks } from "@/content/nav"
import { cn } from "@/lib/utils"

/**
 * The desktop nav, with the link for whichever section is on screen lit up.
 *
 * Scroll-spy runs off one IntersectionObserver watching a band across the
 * middle of the viewport — the section crossing it is "current". No scroll
 * listener, so it costs nothing while the page is idle.
 */
export function NavLinks() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.href.split("#")[1] ?? ""))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 shadow-xs backdrop-blur md:flex">
      {navLinks.map((link) => {
        const isActive = link.href.endsWith(`#${active}`)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-muted hover:text-foreground",
              isActive &&
                "bg-brand-muted text-accent-foreground shadow-xs ring-1 ring-brand/20 hover:bg-brand-muted hover:text-accent-foreground",
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
