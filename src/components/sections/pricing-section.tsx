import { ScrollHeading } from "@/components/motion/scroll-heading"
import { WordReveal } from "@/components/motion/word-reveal"
import { PricingPlans } from "@/components/ui/pricing-plans"
import { plans } from "@/content/plans"

export default function PricingSection() {
  return (
    <section id="pricing" className="section bg-muted/30">
      <div className="section-inner">
        <ScrollHeading>
          <p className="eyebrow">Pricing</p>
          <h2 className="section-title">
            <WordReveal text="Priced per employee, not per module" />
          </h2>
          <p className="section-lead">
            Employee import, face enrolment and onboarding are part of the plan,
            not a separate invoice.
          </p>
        </ScrollHeading>

        <PricingPlans plans={plans} />

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Prices exclude GST. Yearly billing charges ten months instead of
          twelve, and there is a minimum of 10 employees on the monthly plans.
        </p>
      </div>
    </section>
  )
}
