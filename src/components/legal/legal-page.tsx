import type { ReactNode } from "react"
import { LegalContent } from "@/components/legal/legal-content"
import { JsonLd } from "@/components/seo/json-ld"
import type { LegalDocument, LegalDocumentKey } from "@/lib/legal"
import { breadcrumbSchema, graph } from "@/lib/structured-data"

/**
 * The frame both legal pages share — a Server Component; the heading and body
 * are <LegalContent>, which also refreshes the document from the browser.
 */
export function LegalPage({
  title,
  path,
  documentKey,
  document,
  children,
}: {
  /** Breadcrumb name, and the heading when nothing is published. */
  title: string
  /** Canonical path with its trailing slash, e.g. "/privacy/". */
  path: string
  documentKey: LegalDocumentKey
  /** What the build fetched — null when nothing was published. */
  document: LegalDocument | null
  /** The hand-written fallback text. */
  children: ReactNode
}) {
  return (
    <article className="section">
      <JsonLd data={graph(breadcrumbSchema(title, path))} />
      <div className="section-inner max-w-3xl">
        <LegalContent
          documentKey={documentKey}
          initial={document}
          title={title}
        >
          {children}
        </LegalContent>
      </div>
    </article>
  )
}
