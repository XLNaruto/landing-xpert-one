"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ChatAction, ChatChoicesUi, ChatFormField, ChatFormUi, ChatOption } from "@/types"

/**
 * The interactive blocks the assistant draws under its answers. They only
 * report what the visitor picked; the widget sends it. `disabled` is set
 * while a reply is in flight, since only one request may run at a time.
 */

export type BlockSend = (message: string, action?: ChatAction) => void

/* ── choices ──────────────────────────────────────────────────────────── */

export function ChoicesBlock({
  ui,
  disabled,
  onSend,
  onDismiss,
}: {
  ui: ChatChoicesUi
  disabled: boolean
  onSend: BlockSend
  onDismiss: () => void
}) {
  const [selected, setSelected] = useState<string[]>([])
  /* No node: a row of follow-up suggestions, drawn lighter than a menu. */
  const followUps = !ui.node

  const click = (option: ChatOption) => {
    if (disabled) return
    if (option.dismiss) return onDismiss()
    if (option.send) return onSend(option.send)
    if (option.goto) return onSend(option.label, { goto: option.goto })
    if (option.value === undefined || !ui.node) return
    if (ui.multi) {
      const value = option.value
      setSelected((current) =>
        current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      )
      return
    }
    onSend(option.label, { node: ui.node, values: [option.value] })
  }

  const submitMulti = () => {
    if (disabled || !ui.node || selected.length === 0) return
    /* In the order shown, not the order clicked. */
    const picked = ui.options.filter((o) => o.value !== undefined && selected.includes(o.value))
    onSend(picked.map((o) => o.label).join(", "), {
      node: ui.node,
      values: picked.map((o) => o.value as string),
    })
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", followUps ? "flex-col items-start" : "")}>
      {ui.options.map((option, index) => {
        const isSelected = ui.multi && option.value !== undefined && selected.includes(option.value)
        return (
          <button
            key={`${option.label}-${index}`}
            type="button"
            onClick={() => click(option)}
            aria-disabled={disabled || undefined}
            aria-pressed={ui.multi && option.value !== undefined ? isSelected : undefined}
            className={cn(
              "cursor-pointer rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-colors aria-disabled:cursor-not-allowed aria-disabled:opacity-60",
              option.goto
                ? "border-transparent bg-primary text-primary-foreground hover:bg-primary-hover"
                : followUps
                  ? "border-transparent bg-transparent px-1.5 py-1 text-brand hover:underline"
                  : isSelected
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-card text-foreground hover:border-brand hover:text-brand",
            )}
          >
            {followUps && !option.goto && <span aria-hidden>↳ </span>}
            {option.label}
          </button>
        )
      })}
      {ui.multi && (
        <Button
          type="button"
          size="sm"
          onClick={submitMulti}
          disabled={disabled || selected.length === 0}
          className="basis-full sm:basis-auto"
        >
          {ui.submit ?? "Continue →"}
        </Button>
      )}
    </div>
  )
}

/* ── form ─────────────────────────────────────────────────────────────── */

function autoCompleteOf(field: ChatFormField): string | undefined {
  if (field.type === "email") return "email"
  if (field.type === "tel") return "tel"
  if (field.name === "name") return "name"
  if (field.name === "company") return "organization"
  return undefined
}

function initialValue(field: ChatFormField): string | boolean {
  if (field.type === "checkbox") return field.value === true || field.value === "true"
  return typeof field.value === "string" ? field.value : field.value ? String(field.value) : ""
}

const controlClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none aria-invalid:border-destructive md:text-sm"

export function FormBlock({
  ui,
  disabled,
  onSend,
}: {
  ui: ChatFormUi
  disabled: boolean
  onSend: BlockSend
}) {
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState(() =>
    Object.fromEntries(ui.fields.map((field) => [field.name, initialValue(field)])),
  )
  /* Client-side misses; the server's own `error`s come on the fields. */
  const [missing, setMissing] = useState<string[]>([])

  /* Focus the first field — or the first one the server rejected — except on
     touch screens, where the keyboard would cover the form. */
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return
    const target = ui.fields.find((f) => f.error) ?? ui.fields[0]
    if (target) formRef.current?.querySelector<HTMLElement>(`[name="${target.name}"]`)?.focus()
  }, [ui])

  const set = (name: string, value: string | boolean) => {
    setValues((current) => ({ ...current, [name]: value }))
    setMissing((current) => current.filter((n) => n !== name))
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (disabled) return
    const data = new FormData(event.currentTarget)
    /* Spam trap: people never see this field, so a value means a bot. */
    if (String(data.get("website") ?? "")) return

    const bad = ui.fields
      .filter((field) => {
        if (!field.required) return false
        const value = values[field.name]
        return field.type === "checkbox" ? value !== true : !String(value).trim()
      })
      .map((field) => field.name)
    if (bad.length > 0) {
      setMissing(bad)
      formRef.current?.querySelector<HTMLElement>(`[name="${bad[0]}"]`)?.focus()
      return
    }

    const form = Object.fromEntries(
      ui.fields.map((field) => {
        const value = values[field.name]
        return [field.name, field.type === "checkbox" ? value === true : String(value).trim()]
      }),
    )
    onSend(`✅ ${ui.submit}`, { node: ui.node, form })
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="relative flex w-full flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-xs"
    >
      {ui.fields.map((field) => {
        const fieldId = `${id}-${field.name}`
        const errorId = `${fieldId}-error`
        const isMissing = missing.includes(field.name)
        const error = field.error ?? (isMissing ? "This field is required." : undefined)
        const value = values[field.name]
        const common = {
          id: fieldId,
          name: field.name,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
          "aria-required": field.required || undefined,
          disabled,
        }

        if (field.type === "checkbox") {
          return (
            <div key={field.name} className="flex flex-col gap-1">
              <label htmlFor={fieldId} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <input
                  {...common}
                  type="checkbox"
                  checked={value === true}
                  onChange={(event) => set(field.name, event.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-brand"
                />
                <span>{field.label}</span>
              </label>
              {error && (
                <p id={errorId} className="text-xs text-destructive">
                  {error}
                </p>
              )}
            </div>
          )
        }

        const text = typeof value === "string" ? value : ""
        const onChange = (next: string) => set(field.name, next)

        return (
          <div key={field.name} className="flex flex-col gap-1">
            <label htmlFor={fieldId} className="text-xs font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </label>
            {field.type === "select" ? (
              <select {...common} value={text} onChange={(e) => onChange(e.target.value)} className={controlClass}>
                <option value="">—</option>
                {(field.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                {...common}
                rows={3}
                value={text}
                maxLength={field.max}
                placeholder={field.placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={cn(controlClass, "resize-none")}
              />
            ) : (
              <input
                {...common}
                type={field.type}
                value={text}
                maxLength={field.max}
                placeholder={field.placeholder}
                inputMode={field.type === "tel" ? "tel" : undefined}
                autoComplete={autoCompleteOf(field)}
                onChange={(e) => onChange(e.target.value)}
                className={controlClass}
              />
            )}
            {error && (
              <p id={errorId} className="text-xs text-destructive">
                {error}
              </p>
            )}
          </div>
        )
      })}

      {/* Spam trap — invisible to people, filled in by form bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="pointer-events-none absolute top-0 left-0 size-px opacity-0"
      />

      <Button type="submit" disabled={disabled} className="w-full">
        {ui.submit}
      </Button>
    </form>
  )
}
