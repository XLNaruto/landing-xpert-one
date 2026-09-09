import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/layout/logo"
import { MobileNav } from "@/components/layout/mobile-nav"
import { navLinks } from "@/content/nav"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 w-full items-center justify-between px-5 md:h-16 md:px-8 lg:px-12 xl:px-16 2xl:max-w-[90rem]">
        <Logo priority />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#pricing"
            className={cn(
              buttonVariants({ variant: "glass-alt", size: "sm" }),
              "hidden rounded-full md:inline-flex",
            )}
          >
            See pricing
          </Link>
          <Link
            href="/#cta"
            className={cn(
              buttonVariants({ variant: "glass", size: "sm" }),
              "hidden rounded-full md:inline-flex",
            )}
          >
            Book a demo
          </Link>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
