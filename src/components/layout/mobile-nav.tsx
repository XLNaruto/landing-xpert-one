"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronRight, Mail, Menu, Phone } from "lucide-react"
import { Logo } from "@/components/layout/logo"
import { navLinks } from "@/content/nav"
import { site } from "@/content/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu />
          </Button>
        }
      />
      <SheetContent side="right" className="w-[88vw] max-w-sm gap-0">
        {/* The mark stands in for a "Menu" heading; the title itself stays
            for screen readers, which need the dialog to be named. The header
            is `h-16` so the sheet's own close button (absolute, `top-3`)
            sits near its centre line. */}
        <SheetHeader className="h-16 shrink-0 flex-row items-center border-b border-border px-5 py-0 pr-14">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo className="h-8 shrink-0" />
        </SheetHeader>

        {/* A plain list divided by hairlines — a bordered card per link made
            four links look like four unrelated widgets. */}
        <nav className="divide-y divide-border/70 px-5">
          {navLinks.map((link) => (
            <SheetClose
              key={link.href}
              nativeButton={false}
              render={
                <Link
                  href={link.href}
                  className="group/item flex items-center justify-between gap-3 py-4 text-[1.0625rem] font-medium transition-colors hover:text-brand"
                >
                  {link.label}
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground transition-all group-hover/item:translate-x-0.5 group-hover/item:text-brand"
                    aria-hidden
                  />
                </Link>
              }
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-border bg-muted/30 p-5">
          <SheetClose
            nativeButton={false}
            render={
              <Link
                href="/#cta"
                className={cn(
                  buttonVariants({ variant: "glass" }),
                  "h-11 w-full rounded-full text-base",
                )}
              >
                Book a demo
              </Link>
            }
          />
          {/* The second CTA, not a footnote: same pill, same height, in the
              indigo glass the desktop header already gives "See pricing" — so
              the pair reads as primary + secondary rather than as a button with
              a stray link under it. */}
          <SheetClose
            nativeButton={false}
            render={
              <Link
                href="/#pricing"
                className={cn(
                  buttonVariants({ variant: "glass-alt" }),
                  "mt-3 h-11 w-full rounded-full text-base",
                )}
              >
                See pricing
              </Link>
            }
          />

          <div className="mt-5 grid gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 hover:text-foreground"
            >
              <Mail className="size-4 shrink-0" aria-hidden />
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 hover:text-foreground"
            >
              <Phone className="size-4 shrink-0" aria-hidden />
              {site.phone}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
