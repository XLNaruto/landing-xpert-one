import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { FadeIn } from "@/components/motion/fade-in"
import { buttonVariants } from "@/components/ui/button"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { solutions } from "@/content/solutions"
import { cn } from "@/lib/utils"

export default function SolutionsSection() {
  return (
    <section id="solutions" className="section">
      <div className="section-inner">
        <FadeIn>
          <p className="eyebrow">Three solutions, one system</p>
          <h2 className="section-title">
            Hire them, track them, pay them — without re-typing anything
          </h2>
          <p className="section-lead">
            Each module stands on its own. Together they share one employee
            record, so the wage structure you set on day one is the wage the
            salary register prices in month twelve.
          </p>
        </FadeIn>

        <div className="mt-14 flex flex-col gap-8 md:mt-16 md:gap-10">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            /* Alternating sides: on wide screens the capability panel swaps
               left/right each row, and its dividing rule swaps with it. */
            const capsOnRight = index % 2 === 0
            /* Each panel slides in from the edge it sits on, so the row
               opens outward from the seam instead of drifting upward. */
            const copyFrom = capsOnRight ? "left" : "right"
            const capsFrom = capsOnRight ? "right" : "left"

            return (
              <FadeIn key={solution.id} from="none">
                <article
                  id={solution.id}
                  className="grid scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-card shadow-xs lg:grid-cols-2"
                >
                  <FadeIn
                    from={copyFrom}
                    className="flex flex-col justify-center p-7 md:p-10"
                  >
                    {/* Icon and step number are one mark, not two chips: the
                        numeral rides the tile's corner like a notification
                        badge, so the row reads as a single object. */}
                    <div className="relative w-fit">
                      <span
                        className="grid size-13 place-items-center rounded-2xl bg-linear-to-br from-brand to-brand/75 text-brand-foreground shadow-lg shadow-brand/25 ring-1 ring-brand/20 ring-inset"
                        aria-hidden
                      >
                        <Icon className="size-6" strokeWidth={1.75} />
                      </span>
                      <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full border border-border bg-card text-[0.6875rem] font-bold tabular-nums text-brand shadow-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold tracking-tight text-balance md:text-[2rem] md:leading-[1.15]">
                      {solution.name}
                    </h3>
                    {/* A short brand rule ties the tagline to the numbered
                        mark above without another pill or badge. */}
                    <p className="mt-3 flex items-center gap-3 text-base font-medium text-brand md:text-lg">
                      <span className="h-px w-7 shrink-0 bg-brand" aria-hidden />
                      {solution.tagline}
                    </p>
                    <p className="mt-4 max-w-prose text-base text-pretty text-muted-foreground">
                      {solution.description}
                    </p>

                    <Link
                      href="/#cta"
                      className={cn(
                        buttonVariants({ variant: "glass" }),
                        "group/cta mt-8 w-fit gap-2 rounded-full px-4 py-2 text-sm font-semibold hover:-translate-y-0.5",
                      )}
                    >
                      {solution.cta}
                      <ArrowRight
                        className="size-3.5 transition-transform duration-300 group-hover/cta:translate-x-1"
                        strokeWidth={2.25}
                        aria-hidden
                      />
                    </Link>
                  </FadeIn>

                  <FadeIn
                    from={capsFrom}
                    delay={0.05}
                    className={cn(
                      "border-t border-border bg-muted/40 p-7 md:p-10 lg:border-t-0",
                      capsOnRight
                        ? "lg:order-last lg:border-l"
                        : "lg:order-first lg:border-r",
                    )}
                  >
                    {/* Label as a rule: brand tick, caps label, then a
                        hairline running out to the count. */}
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-1 shrink-0 rounded-full bg-brand"
                        aria-hidden
                      />
                      <h4 className="text-xs font-bold tracking-[0.14em] whitespace-nowrap uppercase">
                        What&rsquo;s inside
                      </h4>
                      <span
                        className="h-px flex-1 bg-linear-to-r from-border to-transparent"
                        aria-hidden
                      />
                      {/* Zero-padded like the module numeral, so the two
                          counters on the panel speak the same language. */}
                      <span className="shrink-0 rounded-full border border-brand/25 bg-brand-muted px-2 py-0.5 text-[0.6875rem] font-bold tabular-nums text-accent-foreground">
                        {String(solution.capabilities.length).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Each capability is its own tile — on a mid-width panel
                        they pair up two across, then go single-file once the
                        panel is only half the row. */}
                    <Stagger
                      as="ul"
                      className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1"
                    >
                      {solution.capabilities.map((capability) => (
                        <StaggerItem
                          as="li"
                          key={capability}
                          className="group/cap flex items-start gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 shadow-xs transition-all duration-200 hover:-translate-y-px hover:border-brand/40 hover:shadow-md hover:shadow-brand/10"
                        >
                          <span
                            className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-brand-muted text-accent-foreground transition-colors duration-200 group-hover/cap:bg-brand group-hover/cap:text-brand-foreground"
                            aria-hidden
                          >
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                          <span className="text-sm leading-snug text-pretty">
                            {capability}
                          </span>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </FadeIn>
                </article>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
