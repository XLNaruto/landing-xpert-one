"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

/** Replaces the current (unknown) URL with the landing page. */
export function RedirectHome() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/")
  }, [router])

  return null
}
