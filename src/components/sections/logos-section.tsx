import Image from "next/image"
import { Marquee } from "@/components/motion/marquee"
import { logos } from "@/content/logos"

export default function LogosSection() {
  return (
    <section
      id="logos"
      className="w-full border-y border-border bg-muted/30 py-10 md:py-12"
    >
      <p className="px-5 text-center text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase md:px-8">
        Running payroll for teams across manufacturing, trading and services
      </p>

      {/* Full-bleed on purpose: the edge fade only reads if the track runs to
          the viewport edges rather than stopping at the content max-width. */}
      <Marquee className="mt-7">
        <ul className="flex shrink-0 items-center gap-4 md:gap-6">
          {logos.map((logo) => (
            <li
              key={logo.name}
              className="flex items-center rounded-full border border-border bg-card px-6 py-3 shadow-xs"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                loading="eager"
                unoptimized
                draggable={false}
                className="h-6 w-auto md:h-7"
              />
            </li>
          ))}
        </ul>
      </Marquee>
    </section>
  )
}
