"use client"

import { useEffect, useState, type ReactNode } from "react"
import { isCancelled } from "@/lib/api-client"
import {
  fetchLegalDocument,
  type LegalDocument,
  type LegalDocumentKey,
} from "@/lib/legal"

/**
 * Styles for the console-authored HTML. Written as descendant variants rather
 * than a typography plugin (not in the stack); they match the look of the
 * hand-written fallback — muted body text, foreground headings.
 */
const contentClass = [
  "text-sm leading-relaxed text-muted-foreground",
  "[&>*:first-child]:mt-0",
  "[&_h1]:mt-10 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-foreground",
  "[&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground",
  "[&_h3]:mt-6 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground",
  "[&_h4]:mt-5 [&_h4]:text-sm [&_h4]:font-medium [&_h4]:text-foreground",
  "[&_p]:mt-2",
  "[&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
  "[&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5",
  "[&_li]:pl-1 [&_li>ul]:mt-1 [&_li>ol]:mt-1",
  "[&_strong]:font-semibold [&_strong]:text-foreground [&_b]:font-semibold [&_b]:text-foreground",
  "[&_a]:font-medium [&_a]:break-words [&_a]:text-brand [&_a:hover]:underline",
  "[&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic",
  "[&_hr]:my-8 [&_hr]:border-border",
  /* Wide tables scroll inside themselves rather than the page at 375px. */
  "[&_table]:mt-4 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse",
  "[&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground",
  "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",
  "[&_img]:h-auto [&_img]:max-w-full",
].join(" ")

/**
 * Heading and body of a legal page. Renders what the build had — the
 * published document, or the hand-written `children` — then asks the API
 * again from the browser and swaps in a newer version if there is one. A
 * failure (404 before the first publish, network) leaves the page as built.
 */
export function LegalContent({
  documentKey,
  initial,
  title,
  children,
}: {
  documentKey: LegalDocumentKey
  initial: LegalDocument | null
  title: string
  children: ReactNode
}) {
  const [document, setDocument] = useState(initial)

  useEffect(() => {
    const controller = new AbortController()
    fetchLegalDocument(documentKey, controller.signal)
      .then(setDocument)
      .catch((error: unknown) => {
        if (isCancelled(error)) return
        console.warn(`[legal] live ${documentKey} unavailable, keeping the built text`, error)
      })
    return () => controller.abort()
  }, [documentKey])

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
        {document?.title || title}
      </h1>
      {document ? (
        <div
          className={`mt-10 ${contentClass}`}
          dangerouslySetInnerHTML={{ __html: document.content }}
        />
      ) : (
        <>
          <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
            {children}
          </div>
          <p className="mt-12 rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
            Placeholder text pending legal review — replace before launch.
          </p>
        </>
      )}
    </>
  )
}
