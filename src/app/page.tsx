import HeroSection from "@/components/sections/hero-section"
import LogosSection from "@/components/sections/logos-section"
import SolutionsSection from "@/components/sections/solutions-section"
import FeaturesSection from "@/components/sections/features-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import PricingSection from "@/components/sections/pricing-section"
import FaqSection from "@/components/sections/faq-section"
import CtaSection from "@/components/sections/cta-section"

export default function Home() {
  return (
    <>
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
