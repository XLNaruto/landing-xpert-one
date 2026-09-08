import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { FadeIn } from "@/components/motion/fade-in"
import { features } from "@/content/features"

export default function FeaturesSection() {
  return (
    <section id="features" className="section">
      <div className="section-inner">
        <FadeIn>
          <p className="eyebrow">Why one system</p>
          <h2 className="section-title">
            The parts nobody demos, that decide whether it works
          </h2>
          <p className="section-lead">
            Three modules on one employee record means no exports between
            steps, no second copy of a wage, and no month where attendance and
            payroll disagree.
          </p>
        </FadeIn>

        {/* `auto-rows-fr` + `h-full` keeps every card in a row the same
            height, so the bottom edges line up whatever the copy length. */}
        <Stagger
          as="ul"
          className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <StaggerItem
              as="li"
              key={feature.title}
              className="group/feat relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
            >
              {/* Brand bloom in the corner, revealed on hover only. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-20 size-40 rounded-full bg-brand/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover/feat:opacity-100"
              />

              <span className="relative grid size-11 place-items-center rounded-xl bg-brand-muted text-accent-foreground ring-1 ring-brand/15 transition-all duration-300 ring-inset group-hover/feat:bg-linear-to-br group-hover/feat:from-brand group-hover/feat:to-brand/75 group-hover/feat:text-brand-foreground group-hover/feat:shadow-lg group-hover/feat:shadow-brand/25">
                <feature.icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>

              <h3 className="relative mt-5 text-[1.0625rem] font-semibold tracking-tight text-balance">
                {feature.title}
              </h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-pretty text-muted-foreground">
                {feature.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
