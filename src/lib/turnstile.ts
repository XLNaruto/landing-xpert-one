/**
 * Cloudflare Turnstile for the site assistant, only when the bot's config
 * returns a `turnstile_sitekey`.
 *
 * The widget runs in "execute" mode with manual refresh, so a challenge is
 * solved only when a token is actually needed: once up front, then again only
 * after the server rejects a message with `403 captcha`. Pre-fetching tokens
 * nobody sends would hammer challenges.cloudflare.com on every chat.
 */

type TurnstileOptions = {
  sitekey: string
  appearance: "interaction-only"
  execution: "execute"
  "refresh-expired": "manual"
  callback: (token: string) => void
  "expired-callback": () => void
  "error-callback": () => void
  "timeout-callback": () => void
  "before-interactive-callback": () => void
  "after-interactive-callback": () => void
}

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string
  execute: (container: HTMLElement) => void
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    __xoTurnstileReady?: () => void
  }
}

const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__xoTurnstileReady"

let scriptPromise: Promise<TurnstileApi | null> | null = null

function loadScript(): Promise<TurnstileApi | null> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  scriptPromise ??= new Promise((resolve) => {
    window.__xoTurnstileReady = () => resolve(window.turnstile ?? null)
    const script = document.createElement("script")
    script.src = SCRIPT_URL
    script.async = true
    /* Cloudflare down: the bot lets messages through without a token. */
    script.onerror = () => {
      scriptPromise = null
      resolve(null)
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

export type Captcha = {
  /**
   * A single-use token, waiting up to `timeoutMs` for one. Starts a challenge
   * if none is in progress. `null` when none came in time — send without one
   * and let the server decide.
   */
  getToken: (timeoutMs: number) => Promise<string | null>
  destroy: () => void
}

export function createCaptcha(
  container: HTMLElement,
  sitekey: string,
  onInteractive: (visible: boolean) => void,
): Captcha {
  let api: TurnstileApi | null = null
  let widgetId: string | null = null
  let destroyed = false
  let token: string | null = null
  /* A challenge is running; its callback will deliver the next token. */
  let pending = false
  const waiters = new Set<(token: string | null) => void>()

  const settle = (value: string | null) => {
    pending = false
    if (value && waiters.size === 0) {
      token = value
      return
    }
    waiters.forEach((resolve) => resolve(value))
    waiters.clear()
  }

  const start = () => {
    if (!api || widgetId === null || pending) return
    pending = true
    api.execute(container)
  }

  const ready = loadScript().then((loaded) => {
    if (!loaded || destroyed) return
    api = loaded
    widgetId = api.render(container, {
      sitekey,
      appearance: "interaction-only",
      execution: "execute",
      "refresh-expired": "manual",
      callback: (value) => settle(value),
      "expired-callback": () => {
        token = null
      },
      "error-callback": () => settle(null),
      "timeout-callback": () => settle(null),
      "before-interactive-callback": () => onInteractive(true),
      "after-interactive-callback": () => onInteractive(false),
    })
    /* Solve the first one now, so the first message doesn't wait for it. */
    start()
  })

  return {
    async getToken(timeoutMs) {
      const deadline = Date.now() + timeoutMs
      await Promise.race([ready, new Promise((r) => setTimeout(r, timeoutMs))])
      if (!api || widgetId === null) return null

      if (token) {
        const value = token
        token = null
        return value
      }
      /* Used-up token: reset the widget before asking for another. */
      if (!pending) {
        api.reset(widgetId)
        start()
      }
      return new Promise<string | null>((resolve) => {
        const timer = setTimeout(() => {
          waiters.delete(done)
          resolve(null)
        }, Math.max(0, deadline - Date.now()))
        const done = (value: string | null) => {
          clearTimeout(timer)
          resolve(value)
        }
        waiters.add(done)
      })
    },
    destroy() {
      destroyed = true
      settle(null)
      if (api && widgetId !== null) api.remove(widgetId)
      widgetId = null
    },
  }
}
