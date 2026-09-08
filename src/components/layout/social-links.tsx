import { site } from "@/content/site"
import { cn } from "@/lib/utils"

/**
 * The brand marks are drawn inline: lucide dropped its brand icon set in v1,
 * and three paths are cheaper than another dependency.
 */
const networks = [
  {
    label: "LinkedIn",
    href: site.social.linkedin,
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.4 8.75 22 11.2 22 14.4V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1V21h-4V9Z",
  },
  {
    label: "X",
    href: site.social.twitter,
    path: "M17.53 3h3.2l-7 8 8.23 10h-6.44l-5.05-6.1L4.7 21H1.5l7.5-8.57L1.1 3h6.6l4.56 5.6L17.53 3Zm-1.12 16.1h1.77L7.7 4.8H5.8l10.6 14.3Z",
  },
  {
    label: "GitHub",
    href: site.social.github,
    path: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z",
  },
]

/** Profile links, `rel="me"` so they read as the same entity's accounts. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {networks.map((network) => (
        <li key={network.label}>
          <a
            href={network.href}
            target="_blank"
            rel="me noreferrer noopener"
            aria-label={`${site.name} on ${network.label}`}
            title={`${site.name} on ${network.label}`}
            className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
              aria-hidden
            >
              <path d={network.path} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
