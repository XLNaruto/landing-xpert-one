import { CalendarCheck, MessageSquare, Zap } from "lucide-react";
import { Parallax } from "@/components/motion/parallax";
import { ScrollInOut } from "@/components/motion/scroll-in-out";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { LeadForm } from "@/components/forms/lead-form";
import { site } from "@/content/site";

const promises = [
  {
    icon: CalendarCheck,
    text: "Live product walkthrough based on your requirements",
  },
  {
    icon: Zap,
    text: "Attendance to payroll in one connected system",
  },
  {
    icon: MessageSquare,
    text: "Clear guidance on payroll compliance and setup",
  },
];

export default function CtaSection() {
  return (
    <section id="cta" className="section relative overflow-hidden">
      {/* A wash behind the panel, drifting against the page so the card
          reads as sitting in front of something rather than on flat ground.
          The mask fades its top and bottom so the box edges never show as a
          line. Decorative only — it carries no content. */}
      <Parallax
        distance={-90}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-[32rem]
          bg-[radial-gradient(40%_60%_at_20%_40%,var(--brand-muted),transparent),radial-gradient(40%_60%_at_80%_60%,#fde8e4,transparent)]
          [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]"
      />

      <div className="section-inner">
        {/* Two panels, not two columns with a gap: the copy side is tinted
            and its content is vertically centred, so the form being the
            taller half reads as a panel edge rather than dead space under
            the copy. The card tips up as one piece on the way in and sinks
            back on the way out (scroll-linked, so it reverses on scroll up);
            the promises follow in sequence. */}
        <ScrollInOut className="mx-auto max-w-xl lg:max-w-none">
          <div className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-xs lg:grid-cols-2">
            <div className="flex h-full flex-col justify-center bg-brand-muted/25 p-6 md:p-10">
              <p className="eyebrow mx-0 text-left">Book a demo</p>
              <h2 className="section-title mx-0 text-left">
                See {site.name} with your real workforce data
              </h2>
              <p className="section-lead mx-0 text-left">
                Tell us how you currently manage attendance and payroll.
                We&apos;ll show you how {site.name} can fit into your existing
                process and help simplify day-to-day workforce management.
              </p>
              <Stagger as="ul" className="mt-8 space-y-4">
                {promises.map((promise) => (
                  <StaggerItem
                    as="li"
                    key={promise.text}
                    className="flex items-center gap-3"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-brand-foreground shadow-sm shadow-brand/25">
                      <promise.icon className="size-4" aria-hidden />
                    </span>
                    <span className="text-sm text-pretty text-muted-foreground">
                      {promise.text}
                    </span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
            <div className="flex items-center justify-center border-t border-border p-6 md:p-10 lg:border-t-0 lg:border-l">
              <LeadForm />
            </div>
          </div>
        </ScrollInOut>
      </div>
    </section>
  );
}
