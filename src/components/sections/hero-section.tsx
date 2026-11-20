import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { CountUp } from "@/components/motion/count-up"
import { Magnetic } from "@/components/motion/magnetic"
import { NetworkCanvas } from "@/components/motion/network-canvas"
import { Parallax } from "@/components/motion/parallax"
import { PointerGlow } from "@/components/motion/pointer-glow"
import { Reveal, RevealWords } from "@/components/motion/reveal"
import { RotatingWord } from "@/components/motion/rotating-word"
import { ScrollTilt } from "@/components/motion/scroll-tilt"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { site } from "@/content/site"
import { heroModules, stats } from "@/content/features"

const proofPoints = [
  "1-click automated salary slips",
  "Zero manual calculation errors",
  "Automated shift & overtime tracking",
  "Instant leave & geo-fencing approvals",
]

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="section relative isolate overflow-hidden pt-16 md:pt-28"
    >
      {/* The stage, back to front: two aurora blooms drifting on their own,
          a light that trails the pointer, the connected-node field, and a
          fade into the page ground at the bottom so the hero has no hard
          lower edge. All decorative; none of it holds content. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-[5%] size-[28rem] animate-float rounded-full bg-brand/20 blur-[120px] md:size-[40rem]" />
        <div className="absolute top-20 right-[0%] size-[24rem] animate-float rounded-full bg-accent-2/15 blur-[120px] [animation-delay:-7s] md:size-[34rem]" />
        <PointerGlow />
        <NetworkCanvas className="absolute inset-0 [mask-image:radial-gradient(75%_65%_at_50%_35%,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="section-inner relative text-center">
        <Reveal from="none">
          <p className="eyebrow gap-1.5 px-3 before:hidden md:gap-2 md:px-3.5">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-brand motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-brand" />
            </span>
            One platform for
            <RotatingWord words={heroModules} className="text-foreground" />
          </p>
        </Reveal>

        <h1 className="mx-auto mt-6 max-w-5xl text-[2.6rem] leading-[1.02] font-bold tracking-tighter text-balance md:text-7xl lg:text-[5.5rem]">
          <RevealWords
            text={site.headline}
            accent={site.headlineAccent}
            delay={0.1}
          />
        </h1>

        <Reveal delay={0.55}>
          <p className="mx-auto mt-6 max-w-2xl text-base text-pretty text-muted-foreground md:text-lg">
            {site.description}
          </p>
        </Reveal>

        <Reveal delay={0.65}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic>
              <Link
                href="/#cta"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "btn-shine group/hero-cta h-12 rounded-full bg-foreground px-7 text-base font-semibold text-background shadow-[0_0_40px_-8px_var(--brand)] hover:bg-foreground/90",
                )}
              >
                Book a live demo
                <ArrowRight
                  className="transition-transform duration-300 group-hover/hero-cta:translate-x-1"
                  aria-hidden
                />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/#pricing"
                className={cn(
                  buttonVariants({ size: "lg", variant: "glass-muted" }),
                  "h-12 rounded-full px-7 text-base font-semibold",
                )}
              >
                See pricing plans
              </Link>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.75}>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {proofPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="size-4 text-brand" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* The product shot lies back like a screen on a desk and stands up to
          face the reader as they scroll to it. */}
      <Reveal delay={0.4} className="section-inner relative mt-16 md:mt-24">
        <ScrollTilt>
          <div className="relative">
            {/* Brand light pooled under the screenshot, so it reads as lit
                rather than pasted onto the page. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-4 -inset-y-8 -z-10 rounded-[2rem] bg-linear-to-r from-brand/40 via-accent-2/40 to-brand/40 opacity-60 blur-3xl md:-inset-x-12"
            />
            {/* A 1px gradient frame: the outer box is the gradient, the
                inner one is inset by a pixel to leave just the edge. */}
            <div className="rounded-xl bg-linear-to-b from-border via-border/40 to-brand/40 p-px md:rounded-2xl">
              <div className="relative w-full overflow-hidden rounded-[calc(var(--radius-xl)-1px)] bg-card md:rounded-[calc(var(--radius-2xl)-1px)]">
                <Image
                  src="/media/hero/hero-web.webp"
                  alt={`The ${site.name} web dashboard, showing headcount, joins, exits, attendance, payroll and open tickets for the chosen period`}
                  width={1904}
                  height={869}
                  priority
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  className="h-auto w-full"
                />
              </div>
            </div>

            {/* The phone rides the bottom-left corner of the screenshot; below
                md there is no room for it to overlap without covering the
                register. It drifts against the screenshot — a short, opposite
                travel is what separates the two planes. */}
            <Parallax
              distance={-40}
              className="absolute -bottom-10 -left-2 hidden w-32 rounded-[1.75rem] bg-foreground p-1.5 shadow-2xl shadow-brand/30 md:block lg:-left-8 lg:w-44"
            >
              {/* A dark bezel around the screenshot so it reads as a device,
                  not a second card. */}
              <div className="overflow-hidden rounded-[1.4rem] bg-card">
                <Image
                  src="/media/hero/hero-app.png"
                  alt={`The ${site.name} mobile app, showing today's task summary and project deadlines`}
                  width={432}
                  height={912}
                  sizes="176px"
                  className="h-auto w-full"
                />
              </div>
            </Parallax>
          </div>
        </ScrollTilt>
      </Reveal>

      {/* `gap-px` over a border-coloured ground draws the grid rules, so they
          stay correct at 2 columns and at 4 without per-cell border classes.
          Equal-height cells also stop a two-line label ragging the row. */}
      <dl className="section-inner relative mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:mt-28 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group/stat flex flex-col-reverse justify-end gap-1.5 bg-card p-5 transition-colors duration-300 hover:bg-brand-muted/40 md:p-6"
          >
            <dt className="text-sm text-pretty text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="origin-left font-heading text-4xl font-bold tracking-tight tabular-nums transition-transform duration-300 group-hover/stat:scale-110 md:text-5xl">
              <CountUp value={stat.value} className="text-gradient" />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
