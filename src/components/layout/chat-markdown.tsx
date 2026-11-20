import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * The small slice of markdown the assistant writes: paragraphs, headings,
 * lists, tables, bold/italic/code and auto-links.
 *
 * It builds React elements, never an HTML string — so anything the visitor
 * typed (their name in a confirmation, say) is escaped by React and can't
 * inject markup.
 */

type Align = "left" | "center" | "right" | undefined

const bulletPattern = /^\s*[-*•]\s+(.*)$/
const numberPattern = /^\s*(\d+)[.)]\s+(.*)$/
const headingPattern = /^#{1,6}\s+(.*)$/
/* `|---|:--:|` — the plans table may use – or — for its dashes. */
const separatorPattern = /^\s*\|?\s*:?[-–—]+:?\s*(\|\s*:?[-–—]+:?\s*)*\|?\s*$/

/** Splits on `|` but not on `\|`, which is a literal pipe inside a cell. */
function splitRow(line: string): string[] {
  let row = line.trim()
  if (row.startsWith("|")) row = row.slice(1)
  if (row.endsWith("|") && !row.endsWith("\\|")) row = row.slice(0, -1)
  return row.split(/(?<!\\)\|/).map((cell) => cell.replace(/\\\|/g, "|").trim())
}

function alignOf(cell: string): Align {
  const left = cell.startsWith(":")
  const right = cell.endsWith(":")
  if (left && right) return "center"
  if (right) return "right"
  if (left) return "left"
  return undefined
}

const linkClass = "font-medium text-brand underline underline-offset-2 hover:text-primary-hover"

/* code | **bold** | *italic* | URL | email. A URL never ends on punctuation. */
const inlinePattern =
  /(`[^`]+`)|(\*\*[^*]+?\*\*)|(\*[^*\s][^*]*?\*)|(https?:\/\/[^\s<>]*[^\s<>().,;:!?'"*])|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g

function renderInline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let index = 0
  for (const match of text.matchAll(inlinePattern)) {
    const start = match.index ?? 0
    if (start > last) out.push(text.slice(last, start))
    const k = `${key}-${index++}`
    const [token, code, bold, italic, url, email] = match
    if (code) {
      out.push(
        <code key={k} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
          {code.slice(1, -1)}
        </code>,
      )
    } else if (bold) {
      out.push(<strong key={k}>{renderInline(bold.slice(2, -2), k)}</strong>)
    } else if (italic) {
      out.push(<em key={k}>{renderInline(italic.slice(1, -1), k)}</em>)
    } else if (url) {
      out.push(
        <a key={k} href={url} target="_blank" rel="noopener noreferrer" className={cn(linkClass, "break-all")}>
          {url}
        </a>,
      )
    } else if (email) {
      out.push(
        <a key={k} href={`mailto:${email}`} className={cn(linkClass, "break-all")}>
          {email}
        </a>,
      )
    }
    last = start + token.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/* A phone number closing a line — the contact details arrive as
   `- Phone: +91 98765 43210`. At least 8 digits, so prices and IDs don't match. */
const trailingPhonePattern = /(\+?\d[\d ()-]{6,}\d)\s*$/

function renderLine(text: string, key: string): ReactNode[] {
  const phone = text.match(trailingPhonePattern)
  if (phone && phone[1].replace(/\D/g, "").length >= 8) {
    const number = phone[1]
    const before = text.slice(0, phone.index)
    return [
      ...renderInline(before, key),
      <a key={`${key}-tel`} href={`tel:${number.replace(/[^\d+]/g, "")}`} className={linkClass}>
        {number}
      </a>,
    ]
  }
  return renderInline(text, key)
}

export function ChatMarkdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  const blocks: ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const key = `b${i}`

    if (!line.trim()) {
      i++
      continue
    }

    const heading = line.match(headingPattern)
    if (heading) {
      blocks.push(
        <p key={key} className="font-semibold">
          {renderLine(heading[1], key)}
        </p>,
      )
      i++
      continue
    }

    /* Table: a `|` row followed by its separator line. */
    if (line.trim().startsWith("|") && separatorPattern.test(lines[i + 1] ?? "")) {
      const head = splitRow(line)
      const aligns = splitRow(lines[i + 1]).map(alignOf)
      const rows: string[][] = []
      i += 2
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]))
        i++
      }
      blocks.push(
        /* A wide table scrolls on its own rather than stretching the chat. */
        <div key={key} data-lenis-prevent className="scrollbar-thin -mx-1 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                {head.map((cell, c) => (
                  <th
                    key={c}
                    style={{ textAlign: aligns[c] }}
                    className="border-b border-border px-2 py-1.5 text-left font-semibold whitespace-nowrap"
                  >
                    {renderInline(cell, `${key}-h${c}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r} className="border-b border-border/60 last:border-0">
                  {row.map((cell, c) => (
                    <td key={c} style={{ textAlign: aligns[c] }} className="px-2 py-1.5 align-top">
                      {renderInline(cell, `${key}-${r}-${c}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    if (bulletPattern.test(line)) {
      const items: ReactNode[] = []
      while (i < lines.length) {
        const item = lines[i].match(bulletPattern)
        if (!item) break
        items.push(<li key={i}>{renderLine(item[1], `${key}-${i}`)}</li>)
        i++
      }
      blocks.push(
        <ul key={key} className="list-disc space-y-1 pl-5">
          {items}
        </ul>,
      )
      continue
    }

    const first = line.match(numberPattern)
    if (first) {
      const items: ReactNode[] = []
      while (i < lines.length) {
        const item = lines[i].match(numberPattern)
        if (!item) break
        items.push(<li key={i}>{renderLine(item[2], `${key}-${i}`)}</li>)
        i++
      }
      const start = Number(first[1])
      blocks.push(
        <ol key={key} start={start === 1 ? undefined : start} className="list-decimal space-y-1 pl-5">
          {items}
        </ol>,
      )
      continue
    }

    blocks.push(<p key={key}>{renderLine(line, key)}</p>)
    i++
  }

  return <div className="space-y-2 wrap-break-word">{blocks}</div>
}
