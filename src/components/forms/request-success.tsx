"use client"

import type { ElementType, ReactNode } from "react"
import { FadeIn } from "@/components/motion/fade-in"
import { SuccessCheck } from "@/components/motion/success-check"
import { successText, successTitle, type DemoRequestResult } from "@/lib/demo-request"

/**
 * The animated "request received" view — the CTA form and the plan dialog
 * both swap to it once the API accepts a request. Its wording follows the
 * API's `outcome` (new, already on file, already booked).
 */
export function RequestSuccess({
  result,
  action,
  titleAs: Title = "h3",
  descriptionAs: Description = "p",
}: {
  result: DemoRequestResult
  /** The button under the message ("Done", "Send another request"). */
  action: ReactNode
  /** In a dialog, pass DialogTitle / DialogDescription for its a11y wiring. */
  titleAs?: ElementType
  descriptionAs?: ElementType
}) {
  return (
    <div
      role="status"
      className="grid w-full justify-items-center gap-3 py-6 text-center"
    >
      <SuccessCheck />
      <FadeIn delay={0.55}>
        <Title className="mt-2 text-lg font-semibold">{successTitle(result)}</Title>
      </FadeIn>
      <FadeIn delay={0.65}>
        <Description className="max-w-sm text-sm text-pretty text-muted-foreground">
          {successText(result)}
        </Description>
      </FadeIn>
      <FadeIn delay={0.8}>{action}</FadeIn>
    </div>
  )
}
