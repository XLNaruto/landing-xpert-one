import { FadeIn } from "@/components/motion/fade-in"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { steps } from "@/content/features"

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section bg-muted/30">
      <div className="section-inner">
        <FadeIn>
          <p className="eyebrow">How it works</p>
          <h2 className="section-title">
            Live in three weeks, including your first salary run
          </h2>
          <p className="section-lead">
            Onboarding is done by the same engineers who build the product, so
            the answers you get about your own edge cases are the real ones.
          </p>
        </FadeIn>

        {/* A timeline, not three loose cards: hairlines bridge the grid gap
            between steps — horizontally on md+, vertically once stacked. The
            offsets are the card padding (1.5rem) plus half the badge (1.375rem). */}
        <Stagger
          as="ul"
          className="mt-12 grid auto-rows-fr gap-6 md:grid-cols-3"
        >
          {steps.map((step, index) => (
            <StaggerItem
              as="li"
              key={step.title}
              className="group/step relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
            >
              {index < steps.length - 1 && (
                <>
                  <span
                    aria-hidden
                    className="absolute top-[2.875rem] left-full hidden h-px w-6 bg-border md:block"
                  />
                  <span
                    aria-hidden
                    className="absolute top-full left-[2.875rem] h-6 w-px bg-border md:hidden"
                  />
                </>
              )}

              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand to-brand/75 text-base font-bold tabular-nums text-brand-foreground shadow-md shadow-brand/25 transition-transform duration-300 group-hover/step:scale-105">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-5 text-lg font-semibold tracking-tight text-balance">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
