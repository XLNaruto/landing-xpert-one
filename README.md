# landing-xpert-one

Marketing landing page for **XpertOne** by XpertLab Technologies — the
Employee / Attendance / Payroll management suite in `../app-xpert-one`.
Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Framer Motion.

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev      # http://localhost:3000
npm run build    # production build (must stay clean)
npm run lint
```

## Where things live

| Path | What |
|---|---|
| `src/app/page.tsx` | the landing page — a stack of sections, nothing else |
| `src/components/sections/` | one section per file (hero, features, pricing, faq, cta …) |
| `src/components/layout/` | header, footer, mobile nav |
| `src/components/motion/` | `<FadeIn>` / `<Stagger>` — the only client boundaries for animation |
| `src/content/` | all list-shaped copy as typed constants |
| `src/lib/seo.ts` | shared metadata + `pageMetadata()` for per-route overrides |
| `src/lib/env.ts` | the only place env vars are read |
| `src/app/actions/lead.ts` | server action behind the demo form |

Design tokens (brand color, radius, fonts) are CSS variables in
`src/app/globals.css`. Tailwind v4 has no `tailwind.config.*` — the theme is
declared in the `@theme inline` block of that same file.

## Brand assets

`public/media/logos/` is the single source: `logo.png` is the header and footer
mark (rendered through `components/layout/logo.tsx`), and `xo-logo.png` is the
favicon, wired via `icons` in `lib/seo.ts` rather than an `app/icon.*` copy so
there is only one file to replace.

## Copy that still needs a real pass

- `src/content/testimonials.ts` — quotes and logos are placeholders.
- `src/content/plans.ts` — per-employee prices are illustrative.
- `src/content/solutions.ts` — the three modules; capability lists are drawn
  from the app's real screens, so keep them in step with `../app-xpert-one`.
- `src/app/(pages)/privacy`, `terms` — placeholder text, needs legal review.
- `public/media/hero/hero-dashboard.svg` — placeholder mock; swap for a real screenshot of
  the attendance register in WebP/AVIF (under ~200KB, keep `priority` on the
  `<Image>`), and update its `alt` in `hero-section.tsx` to match.

## Lead form

The demo form posts through a server action. With `LEAD_WEBHOOK_URL` set it
POSTs `{name, email, company, source}` as JSON; unset, it logs to the server
console. On success it redirects to `/thank-you` (noindex).
