"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { A11y, Autoplay, Keyboard } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperClass } from "swiper/types"
import type { Testimonial } from "@/types"
import { cn } from "@/lib/utils"
import "swiper/css"

/** "Placeholder Name" → "PN" */
function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
}

/**
 * Swiper-driven quote carousel. `grabCursor` + Swiper's default
 * `simulateTouch` give mouse-drag on desktop as well as touch swipe; the
 * arrows and clickable bullets are the visible affordance.
 */
/**
 * Loop mode needs more real slides than fit on screen — with `centeredSlides`
 * and ~2 per view that means at least four. Below that Swiper pads with blank
 * slides and forward motion stalls at the end, so the quote list is repeated
 * until there are enough. Repeats are what make the wrap seamless: the "first"
 * card arriving after the last is a genuine slide, not a jump back.
 *
 * The repeats only appear after hydration. Rendering them server-side put each
 * quote into the HTML twice, which crawlers read as duplicated page text.
 */
const MIN_SLIDES = 6

/** A store that never changes: the snapshot alone carries the answer. */
const subscribeNever = () => () => {}

function padForLoop(items: Testimonial[]) {
  if (items.length === 0 || items.length >= MIN_SLIDES) return items
  const passes = Math.ceil(MIN_SLIDES / items.length)
  return Array.from({ length: passes }, () => items).flat()
}

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  /* false on the server and through the first render, true once hydrated —
     so the server render carries the quotes exactly once and the padded set
     only ever exists in the browser. */
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  )
  const slides = mounted ? padForLoop(items) : items

  /* Same contract as the FadeIn wrappers: nothing moves on its own for
     someone who asked the OS for less motion. */
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduceMotion(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  const arrow =
    "grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground shadow-xs transition-all outline-none hover:-translate-y-px hover:border-brand/40 hover:text-brand hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"

  return (
    /* Slightly wider than the `.section-inner` column but still bounded — a
       full-bleed track ran to the window edge and the trailing card looked
       clipped by the browser rather than the layout. */
    <div
      className="mx-auto w-full px-5 md:px-8 lg:px-12 2xl:max-w-[100rem]"
    >
      <Swiper
        /* Re-initialise once the padded slides arrive — Swiper reads the
           slide count at setup and loop mode can't absorb the change. */
        key={slides.length}
        onSwiper={setSwiper}
        modules={[Keyboard, A11y, Autoplay]}
        grabCursor
        centeredSlides
        loop={mounted}
        loopAddBlankSlides={false}
        autoplay={
          reduceMotion
            ? false
            : { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }
        }
        keyboard={{ enabled: true }}
        spaceBetween={20}
        slidesPerView={1.15}
        breakpoints={{
          /* Centred, with the count just under 2 at the top end: the middle
             card sits full width and each neighbour shows about half. */
          640: { slidesPerView: 1.5, spaceBetween: 20 },
          1024: { slidesPerView: 1.9, spaceBetween: 24 },
        }}
        a11y={{ containerMessage: "Customer quotes" }}
        className={cn(
          "!pb-8",
          /* Neighbours sit back — dimmed and slightly smaller — so the centre
             card is unambiguously the one being read. */
          "[&_.swiper-slide]:scale-[0.94] [&_.swiper-slide]:opacity-55 [&_.swiper-slide]:transition-all [&_.swiper-slide]:duration-500",
          "[&_.swiper-slide-active]:scale-100 [&_.swiper-slide-active]:opacity-100",
          "[&_.swiper-slide-active_figure]:border-brand/40 [&_.swiper-slide-active_figure]:shadow-xl [&_.swiper-slide-active_figure]:shadow-brand/10",
        )}
      >
        {slides.map((testimonial, index) => (
          <SwiperSlide key={`${testimonial.name}-${index}`} className="!h-auto">
            <figure className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition-colors hover:border-brand/40 md:p-7">
              <Quote
                className="pointer-events-none absolute -top-1 right-3 size-20 text-brand/10"
                strokeWidth={1.5}
                aria-hidden
              />

              <blockquote className="relative text-base leading-relaxed text-pretty select-none">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <figcaption className="relative mt-auto flex items-center gap-3 pt-6">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand to-brand/75 text-xs font-bold text-brand-foreground shadow-md shadow-brand/25"
                  aria-hidden
                >
                  {initials(testimonial.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {testimonial.name}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => swiper?.slidePrev()}
          className={arrow}
          aria-label="Previous quote"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => swiper?.slideNext()}
          className={arrow}
          aria-label="Next quote"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}
