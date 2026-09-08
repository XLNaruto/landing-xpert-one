import HeroSection from "@/components/sections/hero-section"
import LogosSection from "@/components/sections/logos-section"
import SolutionsSection from "@/components/sections/solutions-section"
import FeaturesSection from "@/components/sections/features-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import PricingSection from "@/components/sections/pricing-section"
import FaqSection from "@/components/sections/faq-section"
import CtaSection from "@/components/sections/cta-section"
import { JsonLd } from "@/components/seo/json-ld"
import {
  faqPageSchema,
  graph,
  softwareApplicationSchema,
} from "@/lib/structured-data"

export default function Home() {
  return (
    <>
      <JsonLd data={graph(softwareApplicationSchema, faqPageSchema)} />
      <HeroSection />
      <LogosSection />
      <SolutionsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
