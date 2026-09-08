import Image from "next/image"
import Link from "next/link"
import { site } from "@/content/site"
import { cn } from "@/lib/utils"

/**
 * The mark alone, shared by the header and the footer so there is one place
 * to change it. The wordmark lives inside the image.
 */
export function Logo({
  /** Sizes the mark — pass height utilities, e.g. `h-10`. */
  className,
  /** Set on the header instance — it is above the fold. */
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <Link
      href="/"
      className="inline-flex items-center"
      aria-label={`${site.name} — home`}
    >
      <Image
        src="/media/logos/logo.png"
        alt={site.name}
        width={499}
        height={182}
        priority={priority}
        className={cn("h-8 w-auto md:h-10", className)}
      />
    </Link>
  )
}
