import { FadeIn } from "@/components/motion/fade-in"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from "@/content/faqs"

export default function FaqSection() {
  return (
    <section id="faq" className="section">
      <div className="section-inner max-w-3xl">
        <FadeIn>
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title">The questions we always get</h2>
        </FadeIn>

        <FadeIn delay={0.05}>
          <Accordion multiple={false} className="mt-10">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="py-5 text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  )
}
