"use client"

import { Bot, MessageCircle, RotateCcw, SendHorizontal, X } from "lucide-react"
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react"
import { ChoicesBlock, FormBlock } from "@/components/layout/chat-blocks"
import { ChatMarkdown } from "@/components/layout/chat-markdown"
import { Button } from "@/components/ui/button"
import { chatCopy } from "@/content/chat"
import {
  MAX_SAVED_MESSAGES,
  loadChatConfig,
  loadSavedChat,
  saveChat,
  streamChat,
  type ChatRequest,
} from "@/lib/chat"
import { createCaptcha, type Captcha } from "@/lib/turnstile"
import { cn } from "@/lib/utils"
import type { ChatAction, ChatConfig, ChatMessage, ChatUi } from "@/types"

/* Wait this long for a CAPTCHA token — under the 45 s request timeout. */
const CAPTCHA_WAIT = 40_000
/* The input grows with its text up to this, then scrolls. */
const INPUT_MAX_HEIGHT = 140

/** The opening menu: the server's, or the suggested questions as buttons. */
function startUiOf(config: ChatConfig): ChatUi | null {
  if (config.start_ui) return config.start_ui
  const questions = config.suggested_questions.slice(0, 6)
  if (questions.length === 0) return null
  return { kind: "choices", options: questions.map((q) => ({ label: q, send: q })) }
}

/**
 * Floating XpertOne assistant, mounted once in the root layout beside
 * <ScrollToTop>. Talks to the bot server (lib/chat.ts); nothing loads until
 * the visitor first opens it, so the landing page itself makes no call.
 *
 * Like <ScrollToTop>, the panel stays mounted while closed so it can animate,
 * and `inert` keeps it out of the tab order and accessibility tree.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<ChatConfig | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  /* The opening menu was dismissed with nothing sent. */
  const [startDismissed, setStartDismissed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [streamText, setStreamText] = useState("")
  const [input, setInput] = useState("")
  const [captchaVisible, setCaptchaVisible] = useState(false)

  const panelId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const captchaBoxRef = useRef<HTMLDivElement>(null)
  const captchaRef = useRef<Captcha | null>(null)

  const conversationId = useRef<string | null>(null)
  /* A token goes with the first message of a chat and after a 403 captcha. */
  const needToken = useRef(true)
  const busyRef = useRef(false)
  /* Bumped by New chat, so a reply to the old conversation is dropped. */
  const generation = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const restored = useRef(false)
  const frame = useRef<number | null>(null)

  /* Declared before the restore below, so on mount it runs first and skips —
     instead of writing an empty history over the saved one. */
  useEffect(() => {
    if (restored.current) saveChat({ conversationId: conversationId.current, messages })
  }, [messages])

  /* Restore this tab's conversation. After mount, so the server HTML and the
     first client render agree. */
  useEffect(() => {
    const saved = loadSavedChat()
    if (saved) {
      conversationId.current = saved.conversationId
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off restore from sessionStorage
      setMessages(saved.messages)
    }
    restored.current = true
  }, [])

  /* Config is fetched on first open, not on page load. */
  useEffect(() => {
    if (!open || config) return
    let cancelled = false
    loadChatConfig().then((loaded) => {
      if (!cancelled) setConfig(loaded)
    })
    return () => {
      cancelled = true
    }
  }, [open, config])

  /* CAPTCHA only when the server asks for it via a site key. */
  const sitekey = config?.turnstile_sitekey
  useEffect(() => {
    const box = captchaBoxRef.current
    if (!sitekey || !box) return
    const captcha = createCaptcha(box, sitekey, setCaptchaVisible)
    captchaRef.current = captcha
    return () => {
      captcha.destroy()
      captchaRef.current = null
    }
  }, [sitekey])

  useEffect(
    () => () => {
      abortRef.current?.abort()
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    },
    [],
  )

  /* Keep the newest message in view. */
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, streamText, busy, config])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpen(false)
      toggleRef.current?.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  const startUi = config ? startUiOf(config) : null
  const last = messages.at(-1)
  /* Only the newest block can be used. */
  const activeUi: ChatUi | null =
    messages.length === 0
      ? startDismissed
        ? null
        : startUi
      : last?.role === "assistant" && !last.used
        ? (last.ui ?? null)
        : null
  const inputUi = activeUi?.kind === "input" ? activeUi : null

  const resizeInput = () => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    /* scrollHeight leaves out the border; border-box height includes it. */
    const full = el.scrollHeight + (el.offsetHeight - el.clientHeight)
    el.style.height = `${Math.min(full, INPUT_MAX_HEIGHT)}px`
    /* A plain one-line field until the text outgrows the cap, then it scrolls. */
    el.style.overflowY = full > INPUT_MAX_HEIGHT ? "auto" : "hidden"
  }

  /** Marks the active block answered, keeping the opening menu's question. */
  const consumeActive = (current: ChatMessage[]): ChatMessage[] => {
    if (current.length === 0) {
      return startUi?.text ? [{ role: "assistant", content: "", ui: startUi, used: true }] : []
    }
    const tail = current[current.length - 1]
    if (tail.role !== "assistant" || !tail.ui || tail.used) return current
    return [...current.slice(0, -1), { ...tail, used: true }]
  }

  const send = async (raw: string, action?: ChatAction) => {
    const message = raw.trim()
    if (!message || busyRef.current || !config) return

    busyRef.current = true
    setBusy(true)
    setStreamText("")
    setInput("")
    requestAnimationFrame(resizeInput)
    setMessages((current) =>
      [...consumeActive(current), { role: "user" as const, content: message }].slice(-MAX_SAVED_MESSAGES),
    )

    const gen = generation.current
    const controller = new AbortController()
    abortRef.current = controller

    const attempt = async (withToken: boolean) => {
      const request: ChatRequest = {
        message,
        conversation_id: conversationId.current,
        ...(action ? { action } : {}),
      }
      const captcha = captchaRef.current
      if (withToken && captcha) {
        const token = await captcha.getToken(CAPTCHA_WAIT)
        /* None in time: send anyway, the server answers 403 captcha. */
        if (token) request.captcha_token = token
      }
      if (gen !== generation.current) return null
      return streamChat(request, {
        signal: controller.signal,
        onStart: (id) => {
          if (gen === generation.current) conversationId.current = id
        },
        /* Re-render the markdown at most once per frame. */
        onDelta: (text) => {
          if (frame.current !== null) cancelAnimationFrame(frame.current)
          frame.current = requestAnimationFrame(() => {
            frame.current = null
            if (gen === generation.current) setStreamText(text)
          })
        },
      })
    }

    let result = await attempt(needToken.current && !!config.turnstile_sitekey)
    /* Fresh token, same request, once. */
    if (result && !result.ok && result.captcha) {
      needToken.current = true
      result = await attempt(true)
    }
    if (!result || gen !== generation.current) return

    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null

    let reply: ChatMessage
    if (result.ok) {
      needToken.current = false
      if (result.reply.conversation_id) conversationId.current = result.reply.conversation_id
      reply = {
        role: "assistant",
        content: result.reply.answer,
        found: result.reply.found,
        ui: result.reply.ui ?? null,
      }
    } else {
      reply = { role: "assistant", content: result.answer, found: false }
    }

    setMessages((current) => [...current, reply].slice(-MAX_SAVED_MESSAGES))
    setStreamText("")
    setBusy(false)
    busyRef.current = false
    abortRef.current = null
    /* The form focuses its own first field. */
    if (reply.ui?.kind !== "form") requestAnimationFrame(() => inputRef.current?.focus())
  }

  const dismiss = () => {
    if (busyRef.current) return
    if (messages.length === 0) setStartDismissed(true)
    else setMessages((current) => consumeActive(current))
    inputRef.current?.focus()
  }

  const newChat = () => {
    generation.current++
    abortRef.current?.abort()
    abortRef.current = null
    busyRef.current = false
    conversationId.current = null
    needToken.current = true
    setBusy(false)
    setStreamText("")
    setStartDismissed(false)
    setMessages([])
    setInput("")
    requestAnimationFrame(resizeInput)
    inputRef.current?.focus()
  }

  const submitInput = () => {
    if (busyRef.current) return
    const text = input.trim()
    if (!text) return
    /* An `input` block takes the next thing typed as its answer. */
    if (inputUi) send(text, { node: inputUi.node, text })
    else send(text)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitInput()
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submitInput()
    }
  }

  const onInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    resizeInput()
  }

  const renderBlock = (ui: ChatUi) => {
    if (ui.kind === "choices") {
      return <ChoicesBlock ui={ui} disabled={busy} onSend={send} onDismiss={dismiss} />
    }
    if (ui.kind === "form") return <FormBlock ui={ui} disabled={busy} onSend={send} />
    if (ui.skip) {
      const skip = ui.skip
      return (
        <button
          type="button"
          onClick={() => !busy && send(skip, { node: ui.node, text: "" })}
          aria-disabled={busy || undefined}
          className="cursor-pointer rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand hover:text-brand aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
        >
          {skip}
        </button>
      )
    }
    return null
  }

  const maxLength = inputUi?.max ?? config?.max_question_chars ?? 1000

  return (
    <>
      <div
        id={panelId}
        role="dialog"
        aria-label={config?.bot_name ?? "Assistant"}
        inert={!open}
        className={cn(
          "fixed inset-x-3 bottom-22 z-50 flex h-[min(36rem,calc(100dvh-7rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl shadow-brand/10 transition-all duration-300 md:inset-x-auto md:right-8 md:bottom-28 md:w-96",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        )}
      >
        <header className="flex items-center gap-3 bg-linear-to-r from-brand to-accent-2 px-4 py-3 text-white">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/20 ring-1 ring-white/30">
            <Bot className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-semibold">
              {config?.bot_name ?? " "}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-white/85">
              <span className="size-1.5 rounded-full bg-emerald-300" />
              Online
            </p>
          </div>
          <button
            type="button"
            onClick={newChat}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
          >
            <RotateCcw className="size-3.5" />
            {chatCopy.newChat}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
          >
            <X className="size-4" />
          </button>
        </header>

        {/* `data-lenis-prevent`: let the wheel scroll this list, not the page. */}
        <div
          ref={listRef}
          role="log"
          aria-live="polite"
          data-lenis-prevent
          className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain bg-muted/40 p-4 scrollbar-thin"
        >
          {config ? (
            <>
              <BotBubble text={config.welcome_message} />

              {messages.length === 0 && activeUi && (
                <>
                  {activeUi.text && <BotBubble text={activeUi.text} />}
                  <div className="self-stretch">{renderBlock(activeUi)}</div>
                </>
              )}

              {messages.map((message, index) => {
                if (message.role === "user") {
                  return (
                    <p
                      key={index}
                      className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-primary-foreground wrap-break-word motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1"
                    >
                      {message.content}
                    </p>
                  )
                }
                const isActive = index === messages.length - 1 && !message.used && !!message.ui
                const contactUrl = config.contact_url
                const showContact =
                  message.found === false &&
                  !!contactUrl &&
                  !message.content.includes(contactUrl) &&
                  !message.ui?.node
                return (
                  <div key={index} className="flex flex-col gap-2">
                    {message.content && <BotBubble text={message.content} />}
                    {showContact && (
                      <a
                        href={contactUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start rounded-full border border-brand/30 bg-brand-muted px-3 py-1 text-xs font-medium text-accent-foreground transition-colors hover:border-brand hover:bg-brand hover:text-brand-foreground"
                      >
                        {chatCopy.contactLink}
                      </a>
                    )}
                    {message.ui?.text && <BotBubble text={message.ui.text} />}
                    {isActive && message.ui && <div className="self-stretch">{renderBlock(message.ui)}</div>}
                  </div>
                )
              })}

              {busy && (streamText ? <BotBubble text={streamText} /> : <TypingDots />)}
            </>
          ) : (
            <TypingDots />
          )}
        </div>

        {/* Turnstile lives here; it only takes space while Cloudflare wants a click. */}
        <div
          ref={captchaBoxRef}
          className={cn(
            "flex justify-center overflow-hidden bg-card",
            captchaVisible ? "border-t border-border p-2" : "h-0"
          )}
        />

        <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-border bg-card p-3">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={onInput}
            onKeyDown={onKeyDown}
            aria-label={chatCopy.inputLabel}
            placeholder={inputUi?.placeholder ?? chatCopy.placeholder}
            maxLength={maxLength}
            autoComplete="off"
            data-lenis-prevent
            style={{ maxHeight: INPUT_MAX_HEIGHT }}
            className="scrollbar-thin min-h-10 min-w-0 flex-1 resize-none overflow-y-hidden rounded-[1.25rem] border border-input bg-background px-4 py-2 text-base leading-6 text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none md:text-sm"
          />
          <Button
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || busy || !config}
            className="size-10 shrink-0 rounded-full p-0"
          >
            <SendHorizontal className="size-4" />
          </Button>
        </form>
      </div>

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close chat" : "Chat with us"}
        aria-expanded={open}
        aria-controls={panelId}
        className="group fixed right-5 bottom-5 z-50 grid size-14 cursor-pointer place-items-center rounded-full bg-linear-to-br from-brand to-accent-2 text-white shadow-lg shadow-brand/30 transition-transform duration-300 hover:scale-105 focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none md:right-8 md:bottom-8"
      >
        {/* The ping grows to 2.2× and would sit over <ScrollToTop> above it —
            decoration only, so it must never take the click. */}
        {!open && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-brand/40 motion-safe:animate-ping-soft"
          />
        )}
        <MessageCircle
          className={cn(
            "absolute size-6 transition-all duration-300",
            open ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          )}
        />
        <X
          className={cn(
            "absolute size-6 transition-all duration-300",
            open ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
          )}
        />
      </button>
    </>
  )
}

function BotBubble({ text }: { text: string }) {
  return (
    <div className="max-w-[90%] self-start rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-2.5 text-sm leading-relaxed text-card-foreground shadow-xs motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <ChatMarkdown text={text} />
    </div>
  )
}

function TypingDots() {
  return (
    <div
      role="status"
      aria-label="Typing"
      className="flex items-center gap-1 self-start rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3"
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: `${delay}ms` }}
          className="size-1.5 rounded-full bg-muted-foreground motion-safe:animate-bounce"
        />
      ))}
    </div>
  )
}
