/**
 * schema.org graphs, emitted as JSON-LD. Seobility and Google both read the
 * page as "no additional markup" without these; with them the FAQ can win a
 * rich result and the pricing is machine-readable.
 *
 * Everything here is derived from `content/` — nothing is asserted that the
 * page doesn't already say out loud.
 */
import { faqs } from "@/content/faqs"
import { plans } from "@/content/plans"
import { site } from "@/content/site"
import { env } from "@/lib/env"

const url = (path = "/") => new URL(path, env.siteUrl).toString()

const ORGANIZATION_ID = `${env.siteUrl}/#organization`
const WEBSITE_ID = `${env.siteUrl}/#website`
const SOFTWARE_ID = `${env.siteUrl}/#software`

export const organizationSchema = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: site.company,
  url: site.companyUrl,
  logo: {
    "@type": "ImageObject",
    url: url("/media/logos/xpertlab-logo.webp"),
    width: 385,
    height: 181,
  },
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.city,
    addressRegion: site.location.region,
    addressCountry: site.location.countryCode,
  },
  sameAs: Object.values(site.social),
}

export const websiteSchema = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: url("/"),
  name: site.name,
  description: site.seoDescription,
  inLanguage: "en-IN",
  publisher: { "@id": ORGANIZATION_ID },
}

/** "₹40" → "40". Plans priced "Let's talk" yield null and get no Offer. */
function numericPrice(price: string): string | null {
  const digits = price.replace(/[^\d.]/g, "")
  return digits.length > 0 ? digits : null
}

export const softwareApplicationSchema = {
  "@type": "SoftwareApplication",
  "@id": SOFTWARE_ID,
  name: site.name,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Human Resources Software",
  operatingSystem: "Web, Android, iOS",
  url: url("/"),
  description: site.seoDescription,
  publisher: { "@id": ORGANIZATION_ID },
  offers: plans.flatMap((plan) => {
    const price = numericPrice(plan.monthly.price)
    if (!price) return []

    return [
      {
        "@type": "Offer",
        name: plan.name,
        description: plan.description,
        price,
        priceCurrency: "INR",
        url: url("/#pricing"),
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price,
          priceCurrency: "INR",
          unitText: plan.monthly.period,
        },
      },
    ]
  }),
}

export const faqPageSchema = {
  "@type": "FAQPage",
  "@id": `${env.siteUrl}/#faq`,
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
}

/** Breadcrumbs for the secondary routes — the home page needs none. */
export function breadcrumbSchema(name: string, path: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: url("/") },
      { "@type": "ListItem", position: 2, name, item: url(path) },
    ],
  }
}

/** Wraps one or more nodes in the `@graph` envelope schema.org expects. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes }
}
