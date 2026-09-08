import { CalendarCheck, MessageSquare, Zap } from "lucide-react"
import { FadeIn } from "@/components/motion/fade-in"
import { LeadForm } from "@/components/forms/lead-form"
import { site } from "@/content/site"

const promises = [
  {
    icon: CalendarCheck,
    text: "A 30-minute walkthrough — one month of your own attendance and one salary run",
  },
  {
    icon: MessageSquare,
    text: "A straight answer on your statutory setup: PF, ESIC, PT and LWF as you actually apply them",
  },
  {
    icon: Zap,
    text: "An import estimate for your employee sheet before you commit to anything",
  },
]

export default function CtaSection() {
  return (
    <section id="cta" className="section">
      <div className="section-inner">
        {/* Two panels, not two columns with a gap: the copy side is tinted
            and its content is vertically centred, so the form being the
            taller half reads as a panel edge rather than dead space under
            the copy. */}
        <div className="mx-auto grid max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-xs lg:max-w-none lg:grid-cols-2">
          <FadeIn from="left" className="flex flex-col justify-center border-b border-border bg-brand-muted/25 p-6 md:p-10 lg:border-b-0 lg:border-r">
            <p className="eyebrow text-left">Book a demo</p>
            <h2 className="section-title mx-0 text-left">
              See {site.name} running on your own data
            </h2>
            <p className="section-lead mx-0 text-left">
              Tell us how you run attendance and payroll today. We&apos;ll show
              you the exact screens that replace it — no slide deck.
            </p>
            <ul className="mt-8 space-y-4">
              {promises.map((promise) => (
                <li key={promise.text} className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-brand-foreground shadow-sm shadow-brand/25">
                    <promise.icon className="size-4" aria-hidden />
                  </span>
                  <span className="text-sm text-pretty text-muted-foreground">
                    {promise.text}
                  </span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn
            from="right"
            delay={0.05}
            className="flex items-center justify-center p-6 md:p-10"
          >
            <LeadForm />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
