import { site } from "@/content/site"
import { JsonLd } from "@/components/seo/json-ld"
import { pageMetadata } from "@/lib/seo"
import { breadcrumbSchema, graph } from "@/lib/structured-data"

export const metadata = pageMetadata({
  title: "Privacy policy",
  description: `How ${site.company} collects, uses and protects the information you share through the ${site.name} website.`,
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <article className="section">
      <JsonLd data={graph(breadcrumbSchema("Privacy policy", "/privacy/"))} />
      <div className="section-inner max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Privacy policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated 7 September 2026
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-semibold text-foreground">
              What we collect
            </h2>
            <p className="mt-2">
              When you submit the demo form we collect your name, email address
              and, if you provide it, your company name. We do not use tracking
              cookies on this site beyond what is needed to remember your
              cookie-consent choice.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">
              How we use it
            </h2>
            <p className="mt-2">
              We use your details only to reply to your enquiry and to arrange a
              demo. We do not sell, rent or share your information with third
              parties for their own marketing.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">
              How long we keep it
            </h2>
            <p className="mt-2">
              Enquiry details are retained for as long as the conversation is
              active and for up to 24 months afterwards, unless you ask us to
              delete them sooner.
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">
              Your rights
            </h2>
            <p className="mt-2">
              You can ask us for a copy of the information we hold about you, or
              ask us to correct or delete it, by writing to{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-brand hover:underline"
              >
                {site.email}
              </a>
              .
            </p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              {site.company}, {site.address}. Questions about this policy go to{" "}
              {site.email}.
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
