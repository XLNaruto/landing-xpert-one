import { ScrollHeading } from "@/components/motion/scroll-heading"
import { WordReveal } from "@/components/motion/word-reveal"
import { Spotlight } from "@/components/motion/spotlight"
import { ScrollSteps } from "@/components/motion/scroll-steps"
import { steps } from "@/content/features"

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section bg-muted/30">
      <div className="section-inner">
        <ScrollHeading>
          <p className="eyebrow">How it works</p>
          <h2 className="section-title">
            <WordReveal text="From employee setup to monthly payroll" />
          </h2>
          <p className="section-lead">
            XpertOne keeps employee information connected throughout the
            process, from setting up employee records to tracking attendance
            and processing monthly salaries.
          </p>
        </ScrollHeading>

        {/* A timeline, not three loose cards: a line draws through the
            badges as the reader scrolls, and each step snaps onto it in
            turn (see <ScrollSteps>). */}
        <ScrollSteps
          className="mt-12 grid auto-rows-fr gap-6 md:grid-cols-3 md:gap-10"
          itemClassName="group/step h-full"
        >
          {steps.map((step, index) => (
            <Spotlight
              key={step.title}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
            >
              {/* The ring flares as the card lands on the line. */}
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand to-brand/75 text-base font-bold tabular-nums text-brand-foreground shadow-[0_0_0_calc(var(--step-on,1)*6px)_color-mix(in_oklch,var(--brand)_22%,transparent)] transition-transform duration-300 group-hover/step:scale-105">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-5 text-lg font-semibold tracking-tight text-balance">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
                {step.description}
              </p>
            </Spotlight>
          ))}
        </ScrollSteps>
      </div>
    </section>
  )
}
