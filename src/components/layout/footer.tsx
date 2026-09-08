import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Copyright, Mail, MapPin, Phone } from "lucide-react"
import { Logo } from "@/components/layout/logo"
import { SocialLinks } from "@/components/layout/social-links"
import { footerLinks } from "@/content/nav"
import { site } from "@/content/site"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo className="h-9 md:h-11" />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {site.seoDescription}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden />
                <a href={`mailto:${site.email}`} className="hover:text-foreground">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden />
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" aria-hidden />
                <span>{site.address}</span>
              </li>
            </ul>
          </div>

          {footerLinks.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-sm font-semibold text-foreground">
                {group.title}
              </p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => {
                  /* Anything off-site opens in a new tab — an anchor, not
                     next/link, since there is no route to prefetch. */
                  const external = link.href.startsWith("http")

                  return (
                    <li key={`${group.title}-${link.href}`}>
                      {external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                          <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Follow {site.name} for release notes and payroll-compliance updates.
          </p>
          <SocialLinks />
        </div>

        {/* Bottom bar: copyright with the product mark inline on the left,
            the agency credit with its mark on the right. */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:justify-between">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <Copyright className="size-4 shrink-0" aria-hidden />
              {new Date().getFullYear()}
            </span>
            <Image
              src="/media/logos/logo.png"
              alt={site.name}
              width={499}
              height={182}
              className="h-5 w-auto"
            />
            <span>All Rights Reserved.</span>
          </p>

          <p className="flex items-center gap-2">
            <span className="font-semibold text-foreground">
              Designed &amp; Developed By
            </span>
            <a
              href={site.companyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center transition-opacity hover:opacity-80"
            >
              <Image
                src="/media/logos/xpertlab-logo.webp"
                alt={site.company}
                width={385}
                height={181}
                className="h-7 w-auto"
              />
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
