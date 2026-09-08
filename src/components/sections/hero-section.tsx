import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { FadeIn } from "@/components/motion/fade-in"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { site } from "@/content/site"
import { stats } from "@/content/features"

const proofPoints = [
  "Face attendance, no hardware",
  "PF · ESIC · PT · LWF built in",
  "Live in 2–3 weeks",
]

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="section relative overflow-hidden pt-14 md:pt-24"
    >
      {/* Two soft washes bleeding in from the top corners, brand on the left,
          a warm tint on the right — the page ground stays flat behind them. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-[28rem]
          bg-[radial-gradient(45%_70%_at_12%_0%,var(--brand-muted),transparent),radial-gradient(45%_70%_at_88%_0%,#fde8e4,transparent)]
          dark:opacity-30"
      />

      <div className="section-inner relative text-center">
        <FadeIn from="none">
          <p className="eyebrow">Employee · Attendance · Payroll</p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
            {site.tagline}
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mx-auto mt-5 max-w-2xl text-base text-pretty text-muted-foreground md:text-lg">
            {site.description}
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/#cta"
              className={cn(
                  buttonVariants({ variant: "glass", size: "lg" }),
                  "h-11 rounded-full px-6 text-base",
                )}
            >
              Book a demo
              <ArrowRight aria-hidden />
            </Link>
            <Link
              href="/#pricing"
              className={cn(
                buttonVariants({ size: "lg", variant: "glass-alt" }),
                "h-11 rounded-full px-6 text-base",
              )}
            >
              See pricing
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
        </FadeIn>
      </div>

      <FadeIn delay={0.1} className="section-inner relative mt-14 md:mt-20">
        <div className="relative">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-foreground/10 md:rounded-2xl">
            <Image
              src="/media/hero/hero-dashboard.svg"
              alt={`The ${site.name} attendance register, showing each department's present and absent counts for the day`}
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover object-top"
            />
          </div>

          {/* The phone rides the bottom-left corner of the screenshot; below md
              there is no room for it to overlap without covering the register. */}
          <div className="absolute -bottom-8 -left-2 hidden w-28 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-foreground/15 md:block lg:-left-6 lg:w-36">
            <Image
              src="/media/hero/hero-face-punch.svg"
              alt="Punching in from a phone with face recognition"
              width={320}
              height={640}
              sizes="144px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </FadeIn>

      {/* `gap-px` over a border-coloured ground draws the grid rules, so they
          stay correct at 2 columns and at 4 without per-cell border classes.
          Equal-height cells also stop a two-line label ragging the row. */}
      <dl className="section-inner relative mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:mt-24 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col-reverse justify-end gap-1.5 bg-card p-5 transition-colors hover:bg-brand-muted/40 md:p-6"
          >
            <dt className="text-sm text-pretty text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="text-3xl font-semibold tracking-tight tabular-nums text-brand md:text-4xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
