import { ScrollText } from "@/components/motion/scroll-text"
import { ticker } from "@/content/features"

/* Each row repeats its words so it stays wider than any viewport while it
   slides; the repeats carry nothing new, so the strip is hidden from
   assistive tech as a whole. */
const repeat = <T,>(items: readonly T[]) => [...items, ...items, ...items]

export default function TickerSection() {
  return (
    <section
      id="ticker"
      aria-hidden
      className="relative w-full overflow-hidden py-14 select-none md:py-20"
    >
      <ScrollText className="items-center gap-6 md:gap-10">
        {repeat(ticker.top).map((word, index) => (
          <span
            key={index}
            className="flex items-center gap-6 font-heading text-6xl font-bold tracking-tighter whitespace-nowrap md:gap-10 md:text-8xl lg:text-9xl"
          >
            {word}
            <span className="text-3xl text-brand md:text-5xl">✦</span>
          </span>
        ))}
      </ScrollText>

      <ScrollText direction={-1} className="mt-2 items-center gap-6 md:mt-4 md:gap-10">
        {repeat(ticker.bottom).map((word, index) => (
          <span
            key={index}
            className="flex items-center gap-6 font-heading text-6xl font-bold tracking-tighter whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_var(--muted-foreground)] md:gap-10 md:text-8xl lg:text-9xl"
          >
            {word}
            <span className="text-3xl text-accent-2 [-webkit-text-stroke:0] md:text-5xl">
              ✦
            </span>
          </span>
        ))}
      </ScrollText>
    </section>
  )
}
