import { site } from "@/content/site"
import { LegalPage } from "@/components/legal/legal-page"
import { pageMetadata } from "@/lib/seo"
import { loadLegalDocument } from "@/lib/legal"

export const metadata = pageMetadata({
  title: "Terms of service",
  description: `The terms that apply when you use the ${site.name} website and subscribe to the service.`,
  path: "/terms",
})

/* The published document from the console when there is one (read at build
   time — see lib/legal.ts); otherwise the text below. */
export default async function TermsPage() {
  const document = await loadLegalDocument("terms-of-service")

  return (
    <LegalPage
      title="Terms of service"
      path="/terms/"
      documentKey="terms-of-service"
      document={document}
    >
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
    </LegalPage>
  )
}
