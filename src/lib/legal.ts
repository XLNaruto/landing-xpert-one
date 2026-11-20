/**
 * Privacy Policy and Terms of Service, as published from the XpertOne console
 * (`GET /legal/{document}`).
 *
 * Read twice, like the plan catalog: at BUILD time from the page's Server
 * Component (baked into the exported HTML, so the page renders with no
 * request), then again in the BROWSER by <LegalContent>, which swaps in a
 * version published since the build.
 *
 * Returns null when the document can't be had — 404 (not published yet), the
 * API is down, or the body isn't the documented shape — and the page then
 * falls back to its hand-written text.
 */
import { http, toApiError } from "@/lib/api-client"
import { endpoints } from "@/lib/endpoints"
import { env } from "@/lib/env"

export type LegalDocumentKey = "privacy-policy" | "terms-of-service"

export type LegalDocument = {
  document: LegalDocumentKey
  title: string
  /** Sanitised HTML, ready for `dangerouslySetInnerHTML`. */
  content: string
  /** ISO 8601 — when it was last published. */
  updatedAt: string
}

function isLegalResponse(value: unknown): value is {
  document: LegalDocumentKey
  title: string
  content: string
  updated_at: string
} {
  if (typeof value !== "object" || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.document === "string" &&
    typeof v.title === "string" &&
    typeof v.content === "string" &&
    typeof v.updated_at === "string"
  )
}

/**
 * The content is authored by our own team in the console, but it still ends
 * up as raw HTML on a public page, so the parts that can run code are removed:
 * script/style/embed elements, inline event handlers and `javascript:` URLs.
 * Defence in depth, not a full sanitiser — the console should sanitise on save.
 */
function sanitise(html: string): string {
  return html
    /* Paired elements go with everything inside them… */
    .replace(/<(script|style|iframe|object|form)\b[\s\S]*?<\/\1\s*>/gi, "")
    /* …then any opening/void/stray tag of those kinds that's left. */
    .replace(
      /<\/?(script|style|iframe|object|embed|form|link|meta|base)\b[^>]*>/gi,
      "",
    )
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(
      /\s(href|src|xlink:href)\s*=\s*(["']?)\s*(?:javascript|vbscript|data):[^"'\s>]*\2/gi,
      "",
    )
}

/**
 * The published document — throws when it can't be had (404 before the first
 * publish, network, shape). Public, so the browser may call it too.
 */
export async function fetchLegalDocument(
  key: LegalDocumentKey,
  signal?: AbortSignal,
): Promise<LegalDocument> {
  let body: unknown
  try {
    body = await http.get<unknown>(endpoints.LEGAL.DOCUMENT(key), { signal })
  } catch (error) {
    throw toApiError(error, "Couldn't Load the Document.")
  }
  if (!isLegalResponse(body)) throw new Error("unexpected response shape")

  const content = sanitise(body.content).trim()
  if (!content) throw new Error("the document is empty")

  return {
    document: body.document,
    title: body.title.trim(),
    content,
    updatedAt: body.updated_at,
  }
}

/** Build-time read: the document, or null for the page's built-in text. */
export async function loadLegalDocument(
  key: LegalDocumentKey,
): Promise<LegalDocument | null> {
  try {
    return await fetchLegalDocument(key)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    console.warn(
      `[legal] ${env.apiUrl}${endpoints.LEGAL.DOCUMENT(key)} unavailable (${reason}); using the built-in text`,
    )
    return null
  }
}

