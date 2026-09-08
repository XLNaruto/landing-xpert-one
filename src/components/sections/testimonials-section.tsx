import { FadeIn } from "@/components/motion/fade-in"
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel"
import { testimonials } from "@/content/testimonials"

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="section overflow-hidden bg-muted/30">
      <div className="section-inner">
        <FadeIn>
          <p className="eyebrow">In their words</p>
          <h2 className="section-title">What changes at month end</h2>
        </FadeIn>
      </div>

      {/* Full-bleed track so the next card peeks in from the edge; the
          carousel adds its own inner padding to line the first card up with
          the content column. */}
      <FadeIn className="mt-12">
        <TestimonialCarousel items={testimonials} />
      </FadeIn>
    </section>
  )
}
