import type Lenis from "lenis"

/**
 * The one Lenis instance, published by <SmoothScroll> (mounted in the root
 * layout) so the handful of places that scroll the page programmatically —
 * <HashScroll>, <ScrollToTop> — can hand the job to it.
 *
 * Kept as a module singleton rather than a context so Server Components stay
 * server-rendered: nothing has to be wrapped in a provider to reach it.
 *
 * Every helper below degrades to the native APIs when Lenis is absent (before
 * hydration, or when the reader prefers reduced motion and we never start it).
 */
let instance: Lenis | null = null

export function setLenis(next: Lenis | null) {
  instance = next
}

export function getLenis() {
  return instance
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Scroll an anchored section into view, clear of the sticky header.
 *
 * The gap comes from the `scroll-mt-*` on `.section`, which both paths read
 * on their own — `scrollIntoView` natively, and Lenis by subtracting the
 * target's `scroll-margin` inside `scrollTo`. Passing it again as an offset
 * here would land the section a header's height too low.
 */
export function scrollToElement(el: HTMLElement) {
  const reduced = prefersReducedMotion()
  const lenis = instance

  if (!lenis || reduced) {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
    return
  }

  lenis.scrollTo(el)
}

export function scrollToTop() {
  const reduced = prefersReducedMotion()
  const lenis = instance

  if (!lenis || reduced) {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
    return
  }

  lenis.scrollTo(0)
}
