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

  /* Lenis caches the page's scrollable height and only re-measures it on a
     debounced resize. Arriving at `/#pricing` from `/privacy`, the home page
     has just replaced a shorter one, so the cached limit is still the old
     page's and `scrollTo` gets clamped to it — the reader stops in Solutions.
     Re-measure first. */
  lenis.resize()
  lenis.scrollTo(el, {
    /* Content above the target (images, entrance animations) can still shift
       while the scroll is in flight. If it did, finish the last stretch. */
    onComplete: () => {
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
      if (Math.abs(el.getBoundingClientRect().top - margin) > 2) {
        lenis.resize()
        lenis.scrollTo(el, { duration: 0.4 })
      }
    },
  })
}

export function scrollToTop() {
  const reduced = prefersReducedMotion()
  const lenis = instance

  if (!lenis || reduced) {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
    return
  }

  /* Lenis drops a scrollTo without a word in two cases: when the target
     equals the position it *thinks* it is heading to (stale if the page was
     moved natively mid-animation, or swapped by a route change), and when it
     is stopped (a dialog's scroll lock that hasn't been released yet). Either
     one made the first click do nothing. Re-sync to the real scroll
     position, and force past a leftover stop. */
  lenis.resize()
  lenis.scrollTo(0, { force: true })
}
