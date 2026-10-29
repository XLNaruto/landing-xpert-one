import { ScrollHeading } from "@/components/motion/scroll-heading"
import { ScrollInOut } from "@/components/motion/scroll-in-out"
import { WordReveal } from "@/components/motion/word-reveal"
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel"
import { testimonials } from "@/content/testimonials"

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="section overflow-hidden bg-muted/30">
      <div className="section-inner">
        <ScrollHeading>
          <p className="eyebrow">In their words</p>
          <h2 className="section-title">
            <WordReveal text="What changes at month end" />
          </h2>
        </ScrollHeading>
      </div>

      {/* Full-bleed track so the next card peeks in from the edge; the
          carousel adds its own inner padding to line the first card up with
          the content column. The whole band tips in and sinks back out with
          the scroll. */}
      <ScrollInOut className="mt-12">
        <TestimonialCarousel items={testimonials} />
      </ScrollInOut>
    </section>
  )
}
