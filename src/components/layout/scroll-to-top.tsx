"use client"

import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Floating "back to top" control, mounted once in the root layout.
 *
 * Only appears once the reader is a screen and a half down — before that the
 * header is still on screen and the button would just be clutter over the
 * hero.
 *
 * It stays mounted while hidden (faded out and `pointer-events-none`) so the
 * entrance can be animated; `aria-hidden` + `tabIndex={-1}` keep it out of the
 * accessibility tree and the tab order until it is actually usable.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    /* Scroll fires far more often than the state ever changes, so coalesce
       the reads into one per frame. */
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setVisible(window.scrollY > window.innerHeight * 1.5)
      })
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })
  }

  return (
    <Button
      type="button"
      variant="glass-muted"
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed right-5 bottom-5 z-40 size-11 rounded-full p-0 shadow-lg transition-all duration-300 md:right-8 md:bottom-8",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      )}
    >
      <ArrowUp className="size-5" />
    </Button>
  )
}
