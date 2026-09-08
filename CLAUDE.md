# CLAUDE.md — landing-xpert-one (Next.js promotion landing page)

Guidance for Claude Code. A **marketing / promotion landing site** — few pages,
almost no server state. Section-based architecture: the page is a stack of
self-contained sections, each owning its own markup, copy and assets.

This is **not** an admin portal. Do not bring in the patterns of one
(data tables, CRUD folders, query caches, permission layers, global stores).

## Stack

- **Next.js (App Router) + TypeScript** (strict)
- **Tailwind CSS** — styling
- **shadcn/ui** — only the primitives actually used (`button`, `accordion`,
  `dialog`, `sheet`, …). Add a component with the CLI when a section needs it;
  never bulk-install the set.
- **Framer Motion** — scroll / entrance animations
- **lucide-react** — icons (arrives with shadcn)

### Deliberately NOT in this project

Do not install these without being asked; they solve problems this site
doesn't have:

| Not used | Why |
|---|---|
| TanStack Query | there is no server state to cache — the page is static |
| Zustand / Redux | section-local `useState` is enough |
| Axios | one or two calls, `fetch` in a Server Component / Server Action |
| TanStack Table / Router | no tables, no client router — App Router is the router |
| react-hook-form + Zod | only if a real lead-capture form lands; then add both together |
| A UI kit besides shadcn | one styling system only |

## Rendering rules

1. **Server Components by default.** `'use client'` only on a leaf that needs
   state, an event handler, or Framer Motion — never on a whole page or layout.
2. **The landing page is static.** It must render fully without any network
   call; content comes from `content/` constants, not an API.
3. **The only allowed API calls** are form submissions (lead / contact /
   newsletter). They go through a **Server Action** in `app/actions/`, never
   `fetch` from a component.
4. **No loading spinners on the marketing content.** If something is slow
   enough to need one, it doesn't belong above the fold.

## Folder structure

```
src/
├── app/
│   ├── layout.tsx          root layout: fonts, metadata, <Header/> <Footer/>
│   ├── page.tsx            the landing page — composes sections, nothing else
│   ├── globals.css
│   ├── actions/            server actions (form submit)
│   └── (pages)/            the handful of extra routes: privacy, terms, thank-you
├── components/
│   ├── sections/           Hero, Features, Pricing, Testimonials, FAQ, CTA …
│   ├── layout/             Header, Footer, MobileNav
│   ├── ui/                 shadcn primitives (generated)
│   └── motion/             reusable animation wrappers (FadeIn, Stagger)
├── content/                copy + data as typed constants (features, faqs, plans)
├── lib/                    utils.ts (cn), seo.ts, env.ts
├── types/
└── public/                 images, og image, favicon
```

## Non-negotiable rules

1. **One section = one file** in `components/sections/`, default-exported,
   taking no props unless it's genuinely reused. `page.tsx` is just the stack:
   ```tsx
   export default function Home() {
     return (<><Hero /><Features /><Pricing /><FAQ /><CTA /></>)
   }
   ```
2. **Copy lives in `content/`, never hardcoded inside JSX** for anything list-shaped
   (features, plans, FAQs, logos, testimonials). A headline inline is fine;
   a `.map()` over inline objects is not.
3. **`@/` alias**, never long relative chains.
4. **Images through `next/image`** with explicit `width`/`height` or `fill` +
   a sized parent. Hero image gets `priority`.
5. **Animations stay in `components/motion/`** — sections import `<FadeIn>` /
   `<Stagger>` rather than each writing its own `motion.div` variants.
   Respect `prefers-reduced-motion`.
6. **A Framer Motion wrapper is the client boundary** — keep it thin so the
   content it wraps stays a Server Component (`{children}`).
7. **Every route exports `metadata`** (title, description, openGraph). Shared
   defaults in `app/layout.tsx`; per-page overrides via `lib/seo.ts`.
8. **Env only through `lib/env.ts`.** Anything reaching the browser must be
   `NEXT_PUBLIC_` and nothing secret may be.
9. **Nothing in `localStorage` beyond a cookie-consent flag.** No client cache,
   no persisted store.
10. **Mobile-first.** Write the base classes for small screens, then `md:`/`lg:`.
    Every section must be checked at 375px.

## Conventions

- Files kebab-case (`hero-section.tsx`); Components PascalCase (`HeroSection`).
- Section components named `<Name>Section`; layout ones plain (`Header`).
- Tailwind class order: layout → spacing → typography → color → state.
  Merge conditional classes with `cn()` from `lib/utils`.
- Design tokens (brand colors, fonts, radius) go in `globals.css` as CSS
  variables + `tailwind.config`, never as one-off hex values in JSX.
- Fonts via `next/font` in the root layout only.
- Sections get a stable `id` (`id="pricing"`) so the nav can anchor to them.

## Performance targets

- Lighthouse ≥ 95 on Performance / SEO / Best Practices for the landing page.
- No client JS for a section that only renders markup.
- Images compressed and served as WebP/AVIF; no image over ~200KB.
- Third-party scripts (analytics, pixels) via `next/script` with
  `strategy="afterInteractive"`, never in `<head>`.

## Scripts

```bash
npm run dev · npm run build · npm run start · npm run lint
```

## Before finishing any task

- `npm run build` passes (no TS errors).
- No new dependency added beyond the stack above without being asked.
- New section registered in `page.tsx` and, if it needs one, in the nav anchors.
- Checked at 375px and in dark mode (if the site has one).
