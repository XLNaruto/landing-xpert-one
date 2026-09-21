"use client"

import Lenis from "lenis"
import { useEffect, useState } from "react"
import { setLenis } from "@/lib/smooth-scroll"
import "lenis/dist/lenis.css"

/**
 * Momentum scrolling for the whole page, mounted once in the root layout.
 *
 * Lenis intercepts wheel/touch input and animates `window.scrollTo` itself,
 * which is why `scroll-smooth` is off on <html>: the two would fight over the
 * same scroll position. Everything downstream still reads native scroll —
 * `position: sticky`, IntersectionObserver, Framer Motion's `whileInView` —
 * because Lenis moves the real scroll position rather than transforming a
 * wrapper.
 *
 * Three things it deliberately does *not* do:
 *  - run at all under `prefers-reduced-motion`. Hijacked inertia is exactly
 *    the kind of motion that setting asks us to drop, so we leave the browser
 *    to it and the helpers in `lib/smooth-scroll` fall back to native.
 *  - keep running while a modal is open. The mobile nav locks the page, and
 *    Lenis would happily scroll the frozen content underneath it.
 *  - touch horizontal scrollers (the testimonial carousel) — Lenis owns the
 *    vertical axis only, so Swiper's own touch handling is untouched.
 */
export function SmoothScroll() {
  /* Starts `true` so the very first client render never assumes inertia is
     wanted; the effect below settles it before paint matters. */
  const [reducedMotion, setReducedMotion] = useState(true)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReducedMotion(query.matches)

    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({
      /* Long enough to read as momentum, short enough that a flick still
         lands where the reader expects. */
      duration: 1.05,
      /* An exponential ease-out: quick take-off, long settle. */
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      /* Trackpads and phones already have their own inertia; adding ours on
         top turns a short swipe into a page-long slide. */
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    setLenis(lenis)

    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })

    /* On a reload the browser restores the previous scroll position *after*
       the page has loaded — by which point Lenis has already recorded 0 as
       where it is. Left alone, the first wheel tick animates from 0 and
       yanks the reader back to the top. Re-seat it on whatever the browser
       settled on instead. */
    const syncRestoredScroll = () => {
      if (Math.abs(window.scrollY - lenis.scroll) > 1) {
        lenis.scrollTo(window.scrollY, { immediate: true, force: true })
      }
    }
    const syncFrame = requestAnimationFrame(syncRestoredScroll)
    window.addEventListener("load", syncRestoredScroll)

    /* Base UI locks the page by setting `overflow: hidden` on <html> while a
       dialog or the mobile sheet is open. Mirror that into Lenis so the
       background stops responding to the wheel. */
    const syncLock = () => {
      const locked =
        getComputedStyle(document.documentElement).overflowY === "hidden"
      if (locked) lenis.stop()
      else lenis.start()
    }
    const observer = new MutationObserver(syncLock)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class", "data-base-ui-scroll-locked"],
    })

    return () => {
      observer.disconnect()
      window.removeEventListener("load", syncRestoredScroll)
      cancelAnimationFrame(syncFrame)
      cancelAnimationFrame(frame)
      lenis.destroy()
      setLenis(null)
    }
    /* Flipping the OS setting mid-visit tears the instance down and the
       helpers fall back to native scrolling. */
  }, [reducedMotion])

  return null
}
