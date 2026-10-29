import { ScrollHeading } from "@/components/motion/scroll-heading"
import { ScrollRow } from "@/components/motion/scroll-row"
import { WordReveal } from "@/components/motion/word-reveal"
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
        <ScrollHeading>
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title">
            <WordReveal text="Questions before you get started" />
          </h2>
        </ScrollHeading>

        {/* Each question weaves in from alternating sides as it scrolls
            into view. The divider moves to the row wrapper: wrapped, every
            item is its wrapper's last child, so the item's own
            `not-last:border-b` would never apply. */}
        <Accordion multiple={false} className="mt-10">
          {faqs.map((faq, index) => (
            <ScrollRow
              key={faq.question}
              index={index}
              className="not-last:border-b"
            >
              <AccordionItem value={faq.question}>
                <AccordionTrigger className="py-5 text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </ScrollRow>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
