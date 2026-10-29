export type Theme = "light" | "dark" | "system"

/**
 * The reader's theme choice lives in a first-party cookie, not localStorage —
 * the project keeps localStorage to the cookie-consent flag only. A year is
 * long enough that a returning visitor keeps their choice.
 */
const COOKIE = "theme"
const MAX_AGE = 60 * 60 * 24 * 365
const DARK_QUERY = "(prefers-color-scheme: dark)"

/**
 * Inlined into <head> by the root layout and run before first paint, so a
 * dark-mode reader never sees a white flash before hydration. Kept as a
 * string with no imports — it runs before any bundle has loaded. Must stay in
 * step with `applyTheme` below.
 */
export const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${COOKIE}=(light|dark|system)/);var t=m?m[1]:"system";var d=t==="dark"||(t==="system"&&matchMedia("${DARK_QUERY}").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`

export function readTheme(): Theme {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE}=(light|dark|system)`),
  )
  return (match?.[1] as Theme | undefined) ?? "system"
}

function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia(DARK_QUERY).matches)
  const root = document.documentElement
  root.classList.toggle("dark", dark)
  root.style.colorScheme = dark ? "dark" : "light"
}

const listeners = new Set<() => void>()

export function setTheme(theme: Theme) {
  document.cookie = `${COOKIE}=${theme}; path=/; max-age=${MAX_AGE}; SameSite=Lax`
  applyTheme(theme)
  listeners.forEach((listener) => listener())
}

/**
 * For `useSyncExternalStore`. While on "system" it also follows the OS
 * switching between light and dark mid-visit.
 */
export function subscribeTheme(listener: () => void) {
  const query = window.matchMedia(DARK_QUERY)
  const onSystemChange = () => {
    if (readTheme() === "system") applyTheme("system")
  }

  listeners.add(listener)
  query.addEventListener("change", onSystemChange)
  return () => {
    listeners.delete(listener)
    query.removeEventListener("change", onSystemChange)
  }
}
