/**
 * Client for the XpertOne assistant (bot.xpertoneindia.com).
 *
 * The site is a static export, so these calls run in the visitor's browser —
 * which is also what the bot needs: it only answers origins on its
 * ALLOWED_ORIGINS list, and it reads that from the browser's `Origin` header.
 */
import { chatCopy, chatDefaultConfig } from "@/content/chat"
import { env } from "@/lib/env"
import type { ChatAction, ChatConfig, ChatMessage, ChatReply } from "@/types"

/** No byte from the server for this long (first word or mid-stream) = give up. */
const IDLE_TIMEOUT = 45_000

const STORAGE_KEY = "kbbot.chat.v3"
export const MAX_SAVED_MESSAGES = 40

/* ── Config ───────────────────────────────────────────────────────────── */

/** Never throws: an unreachable server still gets a usable chat. */
export async function loadChatConfig(): Promise<ChatConfig> {
  try {
    const response = await fetch(`${env.chatBotUrl}/api/config`)
    if (!response.ok) return chatDefaultConfig
    const data = (await response.json()) as Partial<ChatConfig>
    return { ...chatDefaultConfig, ...data }
  } catch {
    return chatDefaultConfig
  }
}

/* ── Sending ──────────────────────────────────────────────────────────── */

export type ChatRequest = {
  message: string
  conversation_id: string | null
  action?: ChatAction
  captcha_token?: string
}

export type ChatResult =
  | { ok: true; reply: ChatReply }
  /** `captcha`: the server wants a fresh Turnstile token — retry once. */
  | { ok: false; answer: string; captcha?: boolean }

type StreamHandlers = {
  onStart?: (conversationId: string) => void
  onDelta?: (text: string) => void
  /** Aborting it (New chat, unmount) resolves with a network failure. */
  signal?: AbortSignal
}

type StreamEvent =
  | { type: "start"; conversation_id: string }
  | { type: "delta"; text: string }
  | ({ type: "done" } & ChatReply)

/** One `data: {json}` event; anything malformed is skipped. */
function parseEvent(raw: string): StreamEvent | null {
  const data = raw
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n")
  if (!data) return null
  try {
    return JSON.parse(data) as StreamEvent
  } catch {
    return null
  }
}

/** The JSON `answer` of an error response, if it has one. */
async function readErrorBody(response: Response) {
  try {
    const body = (await response.json()) as { answer?: unknown; captcha?: unknown }
    return {
      answer: typeof body.answer === "string" ? body.answer : undefined,
      captcha: body.captcha === true,
    }
  } catch {
    return { answer: undefined, captcha: false }
  }
}

/**
 * POST /chat/stream and read the Server-Sent Events. `fetch` + a reader,
 * since EventSource can't POST. Resolves — never rejects — with either the
 * final reply or a message to show in its place.
 */
export async function streamChat(
  request: ChatRequest,
  { onStart, onDelta, signal }: StreamHandlers = {},
): Promise<ChatResult> {
  const controller = new AbortController()
  let timedOut = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const armTimer = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, IDLE_TIMEOUT)
  }
  const onOuterAbort = () => controller.abort()
  signal?.addEventListener("abort", onOuterAbort)

  let streamed = ""

  try {
    armTimer()
    const response = await fetch(`${env.chatBotUrl}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
      body: JSON.stringify(request),
      signal: controller.signal,
    })

    if (!response.ok) {
      const body = await readErrorBody(response)
      /* 403 (origin / captcha), 429, 400 and the daily-cap 503 all carry an
         `answer` in the visitor's language; anything else is "unreachable". */
      return {
        ok: false,
        answer: body.answer ?? chatCopy.errors.network,
        captcha: response.status === 403 && body.captcha,
      }
    }
    if (!response.body) return { ok: false, answer: chatCopy.errors.network }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""
    /* An object, not a `let`: TS doesn't follow assignments made in `handle`. */
    const final: { reply: ChatReply | null } = { reply: null }

    const handle = (raw: string) => {
      const event = parseEvent(raw)
      if (!event) return
      if (event.type === "start") onStart?.(event.conversation_id)
      else if (event.type === "delta") {
        streamed += event.text
        onDelta?.(streamed)
      } else if (event.type === "done") final.reply = event
    }

    for (;;) {
      const { value, done: finished } = await reader.read()
      if (finished) break
      armTimer()
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n")
      const events = buffer.split("\n\n")
      /* The last piece may be half an event — keep it for the next read. */
      buffer = events.pop() ?? ""
      events.forEach(handle)
    }
    buffer += decoder.decode()
    /* A final event without its trailing blank line. */
    if (buffer.trim()) handle(buffer)

    if (final.reply) return { ok: true, reply: final.reply }
    /* The stream ended without `done`: keep whatever arrived. */
    return {
      ok: true,
      reply: streamed
        ? { answer: streamed, found: true }
        : { answer: chatCopy.errors.broken, found: false },
    }
  } catch {
    return {
      ok: false,
      answer: timedOut ? chatCopy.errors.timeout : chatCopy.errors.network,
    }
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener("abort", onOuterAbort)
  }
}

/* ── Saved history (sessionStorage: survives a reload, not the tab) ──── */

export type SavedChat = {
  conversationId: string | null
  messages: ChatMessage[]
}

/* Storage can throw outright (private mode, sandboxed iframes) — every access
   is wrapped, and a failure just means the chat isn't remembered. */

export function loadSavedChat(): SavedChat | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw) as Partial<SavedChat>
    if (!Array.isArray(saved.messages)) return null
    return {
      conversationId: typeof saved.conversationId === "string" ? saved.conversationId : null,
      messages: saved.messages.slice(-MAX_SAVED_MESSAGES),
    }
  } catch {
    return null
  }
}

export function saveChat(chat: SavedChat) {
  try {
    if (!chat.conversationId && chat.messages.length === 0) {
      window.sessionStorage.removeItem(STORAGE_KEY)
      return
    }
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...chat, messages: chat.messages.slice(-MAX_SAVED_MESSAGES) }),
    )
  } catch {
    /* Not remembered — the chat itself still works. */
  }
}
