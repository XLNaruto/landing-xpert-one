import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { site } from "@/content/site"
import { pageMetadata } from "@/lib/seo"

export const metadata = {
  ...pageMetadata({
    title: "Thanks — we'll be in touch",
    description: `Your demo request for ${site.name} has been received.`,
    path: "/thank-you",
  }),
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return (
    <section className="section">
      <div className="section-inner flex max-w-xl flex-col items-center py-10 text-center md:py-20">
        <span className="grid size-12 place-items-center rounded-full bg-brand-muted text-brand">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">
          Thanks — that&apos;s with us
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          One of our engineers will email you within one working day to fix a
          time. If it&apos;s urgent, call {site.phone}.
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "glass" }),
            "rounded-full",
            "mt-8 h-11 px-6 text-base",
          )}
        >
          Back to the homepage
        </Link>
      </div>
    </section>
  )
}
