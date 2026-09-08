import { site } from "@/content/site"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Terms of service",
  description: `The terms that apply when you use the ${site.name} website and subscribe to the service.`,
  path: "/terms",
})

export default function TermsPage() {
  return (
    <article className="section">
      <div className="section-inner max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Terms of service
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated 7 September 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground">
              Using this site
            </h2>
            <p className="mt-2">
              The content on this site is provided for information about{" "}
              {site.name}. Prices, features and timelines described here may
              change and are confirmed in writing in your subscription
              agreement.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">
              Subscriptions
            </h2>
            <p className="mt-2">
              Plans are billed monthly or annually in advance. You may cancel at
              the end of a billing period; fees already paid are not refundable
              on a pro-rata basis unless your agreement says otherwise.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">
              Your data
            </h2>
            <p className="mt-2">
              The business data you enter into {site.name} remains yours. You can
              export it at any time, and we will provide a full export on request
              when a subscription ends.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">
              Availability
            </h2>
            <p className="mt-2">
              We aim for continuous availability and publish planned maintenance
              in advance. Service-level commitments apply to the Enterprise plan
              as set out in your agreement.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">
              Governing law
            </h2>
            <p className="mt-2">
              These terms are governed by the laws of India, with courts at
              Junagadh, Gujarat having exclusive jurisdiction.
            </p>
          </section>
        </div>

        <p className="mt-12 rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
          Placeholder text pending legal review — replace before launch.
        </p>
      </div>
    </article>
  )
}
