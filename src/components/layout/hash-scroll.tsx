"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/**
 * Anchor navigation the browser and the App Router each get half-right.
 *
 * Two gaps this closes:
 *  1. Clicking the *same* anchor twice. The second click leaves the URL
 *     unchanged, so neither the browser nor the router fires a navigation and
 *     the page stays where it is. We handle those clicks ourselves.
 *  2. Arriving at `/#solutions` from another route (`/privacy`, `/terms`).
 *     The target section only exists after the home page has mounted, so the
 *     router's own scroll attempt can land on nothing — we retry for a few
 *     frames once the route is on screen.
 *
 * Mounted once in the root layout; renders nothing.
 */
export function HashScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const prefersReducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const scrollToId = (rawId: string) => {
      const id = decodeURIComponent(rawId)
      if (!id) return false

      const el = document.getElementById(id)
      if (!el) return false

      el.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      })
      return true
    }

    /* The section may still be mounting (or an image above it may still be
       laying out), so give it a handful of frames before giving up. */
    let frame = 0
    const settleScroll = (id: string, attemptsLeft = 12) => {
      if (scrollToId(id) || attemptsLeft === 0) return
      frame = requestAnimationFrame(() => settleScroll(id, attemptsLeft - 1))
    }

    if (window.location.hash.length > 1) {
      settleScroll(window.location.hash.slice(1))
    }

    /* Bubble phase on `document`, registered after hydration, so this runs
       *after* React has dispatched the anchor's own handlers: `next/link` has
       already called `preventDefault()` and updated the URL, and a
       `SheetClose` wrapper has already closed the mobile menu. Hence no
       `defaultPrevented` guard here — Link prevents every internal click, and
       bailing on that flag is exactly why a repeat click did nothing. */
    const onClick = (event: MouseEvent) => {
      /* Left click, no modifier — anything else is the user's own intent
         (new tab, new window, download). */
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const anchor = (event.target as Element | null)?.closest?.("a")
      if (!anchor || anchor.target === "_blank") return

      const href = anchor.getAttribute("href")
      if (!href?.includes("#")) return

      const url = new URL(href, window.location.href)
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        url.hash.length <= 1
      ) {
        /* A different route: let the router navigate, the effect above scrolls
           once the new page is mounted. */
        return
      }

      event.preventDefault()
      /* Keep the hash in the URL (deep-linkable, and the back button still
         works) without asking the router to re-render the page. A plain
         `<a href>` needs this; after a `next/link` click the hash is already
         set and the comparison skips it. */
      if (url.hash !== window.location.hash) {
        window.history.pushState(null, "", url.hash)
      }
      settleScroll(url.hash.slice(1))
    }

    const onHashChange = () => {
      if (window.location.hash.length > 1) {
        settleScroll(window.location.hash.slice(1))
      }
    }

    document.addEventListener("click", onClick)
    window.addEventListener("hashchange", onHashChange)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("click", onClick)
      window.removeEventListener("hashchange", onHashChange)
    }
  }, [pathname])

  return null
}
