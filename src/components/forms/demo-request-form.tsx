"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { BadgeCheck, Check, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  EMPLOYEE_RANGES,
  REFERRAL_CODE_MAX,
  lookupReferral,
  newIdempotencyKey,
  normaliseReferralCode,
  referralCodeFromUrl,
  readDemoRequestValues,
  submitDemoRequest,
  validateDemoRequest,
  type DemoRequestField,
  type DemoRequestResult,
  type DemoRequestState,
  type DemoRequestTopic,
  type ReferralLookup,
} from "@/lib/demo-request"
import { SelectField } from "@/components/ui/select-field"
import { cn } from "@/lib/utils"

const employeeOptions = EMPLOYEE_RANGES.map((range) => ({
  value: range,
  label: `${range} Employees`,
}))

const fieldClass =
  "w-full rounded-lg border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3"
const inputClass = `${fieldClass} h-11`
const neutralBorder =
  "border-border focus-visible:border-ring focus-visible:ring-ring/50"
const errorBorder =
  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null
  return (
    <span id={id} role="alert" className="text-xs font-medium text-destructive">
      {error}
    </span>
  )
}

type FieldProps = {
  idPrefix: string
  name: Exclude<DemoRequestField, "employees" | "message" | "ref_code" | "consent">
  label: string
  required?: boolean
  error?: string
  /** Fixed text inside the box, before what is typed (e.g. "+91"). */
  prefix?: string
} & Omit<React.ComponentProps<"input">, "name" | "prefix">

function Field({
  idPrefix,
  name,
  label,
  required,
  error,
  prefix,
  className,
  ...input
}: FieldProps) {
  const errorId = `${idPrefix}-${name}-error`
  const field = (
    <input
      name={name}
      required={required}
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}
      className={cn(inputClass, error ? errorBorder : neutralBorder, prefix && "pl-12")}
      {...input}
    />
  )
  return (
    <label className={cn("grid content-start gap-1.5", className)}>
      <span className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {prefix ? (
        <span className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-border pr-2 pl-3 text-sm text-muted-foreground"
          >
            {prefix}
          </span>
          {field}
        </span>
      ) : (
        field
      )}
      <FieldError id={errorId} error={error} />
    </label>
  )
}

/**
 * Optional salesperson referral code. Prefilled from `?ref=` on the page
 * link, upper-cased as typed, and checked against the API after a short
 * pause so the visitor sees "Referred by …" — or why the code is refused —
 * before they submit. The submit checks it again either way.
 */
function ReferralField({ idPrefix, error }: { idPrefix: string; error?: string }) {
  const [code, setCode] = useState("")
  const [lookup, setLookup] = useState<ReferralLookup | null>(null)
  const [checking, setChecking] = useState(false)
  /* The pending check — a newer keystroke cancels it. */
  const pendingCheck = useRef<{ timer: ReturnType<typeof setTimeout>; controller: AbortController } | null>(null)

  function cancelCheck() {
    if (!pendingCheck.current) return
    clearTimeout(pendingCheck.current.timer)
    pendingCheck.current.controller.abort()
    pendingCheck.current = null
  }

  function change(value: string) {
    const next = normaliseReferralCode(value).slice(0, REFERRAL_CODE_MAX)
    setCode(next)
    setLookup(null)
    cancelCheck()
    setChecking(!!next)
    if (!next) return

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      const result = await lookupReferral(next, controller.signal)
      if (controller.signal.aborted) return
      pendingCheck.current = null
      setLookup(result)
      setChecking(false)
    }, 400)
    pendingCheck.current = { timer, controller }
  }

  /* `?ref=` is read after mount — the static page has no query string at
     build time — and the unmount cancels a check still in flight. */
  useEffect(() => {
    const fromUrl = referralCodeFromUrl()
    const timer = fromUrl ? setTimeout(() => change(fromUrl), 0) : undefined
    return () => {
      clearTimeout(timer)
      cancelCheck()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on mount
  }, [])

  /* A refusal from the submit wins; else what the lookup said. */
  const shownError = error ?? (lookup?.status === "invalid" ? lookup.message : undefined)
  const errorId = `${idPrefix}-ref_code-error`
  const hintId = `${idPrefix}-ref_code-hint`

  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={`${idPrefix}-ref_code`} className="text-sm font-medium">
        Referral code
      </label>
      <span className="relative">
        <input
          id={`${idPrefix}-ref_code`}
          name="ref_code"
          value={code}
          onChange={(event) => change(event.currentTarget.value)}
          maxLength={REFERRAL_CODE_MAX}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="e.g. RAHUL-01"
          aria-invalid={!!shownError}
          aria-describedby={shownError ? errorId : lookup?.status === "valid" ? hintId : undefined}
          className={cn(inputClass, shownError ? errorBorder : neutralBorder, "pr-10 uppercase")}
        />
        {checking && (
          <Loader2
            aria-hidden
            className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
          />
        )}
      </span>
      {shownError ? (
        <FieldError id={errorId} error={shownError} />
      ) : lookup?.status === "valid" ? (
        <span
          id={hintId}
          aria-live="polite"
          className="flex items-center gap-1.5 text-xs font-medium text-brand"
        >
          <BadgeCheck aria-hidden className="size-3.5" />
          Referred by {lookup.referral.name}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">
          Got a code from one of our team? Enter it here.
        </span>
      )}
    </div>
  )
}

/**
 * The one form behind every "contact me" button — the CTA's "Book a demo",
 * the pricing cards' "Start with …" and "Talk to sales". `topic` decides what
 * is sent; the fields are the same everywhere (API §3).
 */
export function DemoRequestForm({
  topic,
  idPrefix,
  submitLabel,
  messageLabel = "Message",
  messagePlaceholder,
  contextNote,
  onSuccess,
  inDialog = false,
}: {
  topic: DemoRequestTopic
  /** Keeps element ids unique when two forms are on the page. */
  idPrefix: string
  submitLabel: string
  messageLabel?: string
  messagePlaceholder?: string
  contextNote?: string
  onSuccess: (result: DemoRequestResult) => void
  /** Fields scroll between the dialog's header and a pinned submit footer. */
  inDialog?: boolean
}) {
  const [state, setState] = useState<DemoRequestState>({})
  const [pending, setPending] = useState(false)
  /* Reused only when the last attempt may not have reached the API, so a
     retry can't create a second request (API §5.4). */
  const retryKey = useRef<string | null>(null)
  const errors = state.fieldErrors ?? {}

  /** Drop or update one field's message — only once it is showing one. */
  function recheck(field: DemoRequestField, message: string | undefined) {
    setState((prev) => {
      if (!prev.fieldErrors?.[field] || prev.fieldErrors[field] === message) return prev
      return { ...prev, fieldErrors: { ...prev.fieldErrors, [field]: message } }
    })
  }

  /* Change events bubble to the form, so one handler covers every input:
     re-run the rules and keep only the changed field's verdict. */
  function handleChange(event: FormEvent<HTMLFormElement>) {
    const field = (event.target as HTMLInputElement).name as DemoRequestField
    if (!errors[field]) return
    const values = readDemoRequestValues(new FormData(event.currentTarget))
    recheck(field, validateDemoRequest(values)[field])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || state.locked) return

    /* Uncontrolled inputs: a refused submit leaves what was typed in place. */
    const values = readDemoRequestValues(new FormData(event.currentTarget))
    const key = retryKey.current ?? newIdempotencyKey()

    setPending(true)
    const result = await submitDemoRequest(values, topic, key, contextNote)
    setPending(false)

    retryKey.current = result.retrySameKey ? key : null

    if (result.result) {
      onSuccess(result.result)
      return
    }
    setState(result)
  }

  return (
    /* `noValidate`: the messages under each field are the single source of
       truth, not the browser's bubbles. */
    <form
      onSubmit={handleSubmit}
      onChange={handleChange}
      noValidate
      className={cn("w-full", inDialog ? "flex min-h-0 flex-1 flex-col" : "grid gap-4")}
    >
      {/* In a dialog the fields scroll; elsewhere `contents` melts this
          wrapper (and the footer's) into the form's grid. */}
      <div
        className={
          inDialog ? "grid min-h-0 flex-1 gap-4 overflow-y-auto px-5 py-4 md:px-6" : "contents"
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            idPrefix={idPrefix}
            name="name"
            label="Your name"
            required
            maxLength={80}
            autoComplete="name"
            placeholder="John Doe"
            error={errors.name}
          />
          <Field
            idPrefix={idPrefix}
            name="company"
            label="Company"
            required
            maxLength={120}
            autoComplete="organization"
            placeholder="Company name"
            error={errors.company}
          />
          <Field
            idPrefix={idPrefix}
            name="mobile"
            label="Mobile number"
            required
            type="tel"
            inputMode="numeric"
            prefix="+91"
            aria-label="Mobile number, 10 digits"
            maxLength={10}
            pattern="[6-9][0-9]{9}"
            autoComplete="tel-national"
            placeholder="9876543210"
            /* Digits only, at most 10: a pasted "+91 98765-43210" or
               "098765 43210" keeps its last 10 digits. */
            onChange={(event) => {
              const digits = event.currentTarget.value.replace(/\D/g, "")
              event.currentTarget.value = digits.length > 10 ? digits.slice(-10) : digits
            }}
            error={errors.mobile}
          />
          <Field
            idPrefix={idPrefix}
            name="email"
            label="Work email"
            type="email"
            maxLength={254}
            autoComplete="email"
            placeholder="you@company.com"
            error={errors.email}
          />

          <div className="grid content-start gap-1.5">
            <label htmlFor={`${idPrefix}-employees`} className="text-sm font-medium">
              Employees
            </label>
            <SelectField
              name="employees"
              inputId={`${idPrefix}-employees`}
              options={employeeOptions}
              invalid={!!errors.employees}
              errorId={`${idPrefix}-employees-error`}
              /* Every option is a valid range; clearing it is allowed too. */
              onChange={() => recheck("employees", undefined)}
            />
            <FieldError id={`${idPrefix}-employees-error`} error={errors.employees} />
          </div>

          <Field
            idPrefix={idPrefix}
            name="city"
            label="City"
            maxLength={60}
            autoComplete="address-level2"
            placeholder="e.g. Surat"
            error={errors.city}
          />
        </div>

        <label className="grid content-start gap-1.5">
          <span className="text-sm font-medium">{messageLabel}</span>
          <textarea
            name="message"
            rows={3}
            maxLength={1000}
            placeholder={messagePlaceholder}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${idPrefix}-message-error` : undefined}
            className={cn(
              fieldClass,
              errors.message ? errorBorder : neutralBorder,
              "min-h-24 resize-y py-2.5",
            )}
          />
          <FieldError id={`${idPrefix}-message-error`} error={errors.message} />
        </label>

        <ReferralField idPrefix={idPrefix} error={errors.ref_code} />

        <div className="grid content-start gap-1.5">
          <label className="flex items-start gap-2.5 text-sm">
            {/* Drawn rather than native, so the tick can be white on brand
                (the browser picks its own tick colour for `accent-color`). */}
            <span className="relative mt-0.5 grid size-4 shrink-0 place-items-center">
              <input
                type="checkbox"
                name="consent"
                required
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? `${idPrefix}-consent-error` : undefined}
                className={cn(
                  "peer size-4 cursor-pointer appearance-none rounded border bg-background transition-colors outline-none checked:border-brand checked:bg-brand focus-visible:ring-3 focus-visible:ring-ring/50",
                  errors.consent ? "border-destructive" : "border-border",
                )}
              />
              <Check
                aria-hidden
                strokeWidth={3}
                className="pointer-events-none absolute size-3 text-brand-foreground opacity-0 peer-checked:opacity-100"
              />
            </span>
            <span className="text-muted-foreground">
              I agree to be contacted about this request.{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                Privacy policy
              </Link>
              <span className="text-destructive"> *</span>
            </span>
          </label>
          <FieldError id={`${idPrefix}-consent-error`} error={errors.consent} />
        </div>
      </div>

      <div
        className={
          inDialog ? "grid shrink-0 gap-3 border-t border-border px-5 py-4 md:px-6" : "contents"
        }
      >
        {state.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}

        <Button
          type="submit"
          variant="glass"
          disabled={pending || state.locked}
          className="h-11 w-full rounded-full text-base"
        >
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
          {pending ? "Sending…" : submitLabel}
        </Button>

        <p className="text-xs text-muted-foreground">
          Required fields are marked with <span className="text-destructive">*</span>.
          Add an email to get a confirmation.
        </p>
      </div>
    </form>
  )
}
