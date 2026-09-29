<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: labrahmi.me

Personal portfolio for Oussama Labrahmi. Next.js 16 + React 19 + Tailwind v4, pnpm 12, Node 24. README.md has setup,
commands and the asset table. This file has the rules to follow when changing things.

## Hard rules

- **No tests.** No unit, integration or e2e tests, and no test runners. The owner removed them on purpose. Verify by
  running `pnpm lint`, `pnpm typecheck` and `pnpm build`, and by looking at the page.
- **Blog is hidden.** No route, no nav link, no sitemap entry. `/blog` redirects home in `next.config.ts`.
- **No CV page.** Every CV button is "Download CV" and links to `/api/cv`. The PDF lives in `private/cv/`, not
  `public/`, so it cannot be fetched around the limit: 5 downloads per visitor per 24 hours (cookie count plus an
  in-memory IP count, `src/app/api/cv/route.ts`, `src/utils/rate-limit.ts`). The in-memory part is per server instance on
  serverless, so it is a speed bump, not a guarantee. Past the limit the buttons switch to an email link.
- Do not commit unless asked.

## Voice and copy

Direct, first person, plain words, numbers over adjectives. No em dashes, no emojis, sentence case headings. Banned:
seamless, blazing-fast, cutting-edge, passionate, leverage, robust, thrive, stunning. Keep everything short. Real titles
stay real ("led the frontend"). Dali is "stakeholder and technical advisor", never co-founder. Email is
oussama@labrahmi.me. Do not link Bejamas case studies or cite Bejamas as a source of numbers.

## Where things live

- Assets: `public/projects` (`<slug>-hero|detail-1|detail-2.webp|webm`), `public/logos` (`<slug>-light.svg` = white
  artwork for dark mode, `<slug>-dark.svg` = dark artwork for light mode, Charm's slug is `charm`), the CV in `private/cv` (not public, see below). Server
  components check existence with `publicFileExists` (`src/utils/public-files.ts`). There is deliberately no asset
  manifest or generator: it was removed because a static import of a missing file breaks the build. `LogoStrip` is a
  client component, so it receives logo URLs from the home page as a prop.
- Copy and case studies: `src/content` (typed by `types.ts`). One source of truth: cards read `metrics`, nothing is
  duplicated. `up: true` means a real gain (green). Team sizes and counts stay in ink.
- Case study page: `src/app/work/[slug]/page.tsx`. Sections hide themselves when empty (no hard parts, no metrics, fewer
  than three sections means no section index).
- Global CSS, tokens, type roles, buttons, aurora keyframes, view transitions: `src/base/styles/globals.css`.

## Design system

- **Accent:** one indigo-violet, `#4125f9` (OKLCH 48.5% 0.282 274) in light mode, a lighter tint of the same hue in dark
  mode so text stays readable. No pink, no second accent, no gradient on titles. Green (`--pass`) is only for gains.
- **Primary button:** colors sampled from a reference. Gradient `#6248fa` to `#3a20e0`, 1px border of white at 20%, soft
  inner glow, dark outer ring, full pill, 40px (`md`) or 32px (`sm`), weight 600, tracking -0.045em. Do not change it
  without a new reference.
- **Fonts:** Geist for every heading (including the hero), DM Sans for all other text and badges, JetBrains Mono for
  numbers in projects only (metric values, read time). Base rules point at `var(--font-geist)`, `var(--font-dm-sans)`,
  `var(--font-jetbrains)` directly. `@theme inline` does not emit `--font-display` or `--font-sans` as CSS variables, so
  never reference those inside plain CSS.
- **Type roles** are `type-display-1`, `type-display-2`, `type-h2`, `type-h3`, `type-metric`, `type-eyebrow`. They are
  named outside the `text-` namespace on purpose: `tailwind-merge` treats unknown `text-*` classes as colors and drops
  them next to a real `text-*` color.
- **Letter spacing** is deliberately tight (body -0.03em, headings -0.05 to -0.075em). The owner keeps asking for less.
- **Layout:** content width 1040px (`Container`), reading column about 640px. Header is fixed, full width, fully
  transparent, no border.
- **Section eyebrows** say something useful ("AI agents", "Client work"). No numbering.

## Motion

- Everything respects `prefers-reduced-motion`.
- **Reveal:** wrap below-the-fold blocks in `<Reveal>` (`data-reveal`). Never on the card itself, never above the fold.
  `html.js` (set by the head script) gates it, so nothing is hidden without JavaScript, and a 2.5s CSS failsafe shows
  anything still hidden only until `RevealProvider` mounts and adds `html.reveal-ready`. A failsafe that ignored that
  would show below-the-fold blocks before the visitor scrolls to them. `RevealProvider` re-scans on every pathname change.
- **Hero aurora:** `src/components/motion/aurora-background.tsx`, ported from the `v2` branch. Do not recolor it: the
  `mix-blend-difference` layer only works with the blue and indigo palette (purple turns olive in dark mode).
- **Logo strip:** centered, no borders, three slots, one swap every 3s with blur and fade. Logos keep their own colors
  (no grayscale, no dimming). No progress indicator: the owner tried one and did not like it.
- **Page transitions:** `<ViewTransition>` with `Link transitionTypes`. Cards' logos and metrics morph into the case study
  header. Header and footer keep their own `view-transition-name`.
- **Wipe:** `data-wipe` reveals an element with a left-to-right `clip-path` line (no fade), driven by the same provider,
  gate and failsafe as Reveal. Used by the inline clip in About (`public/gif.webm`, `InlineClip`).
- Metric numbers count up once, only when they start below the fold, and never flash from 0 above it.

## Themes

Dark from 19:00 to 06:59 (visitor's clock), light otherwise, until the visitor picks one. The choice is stored in
`localStorage.theme`. Logic is in `src/utils/theme.ts` (head script + `applyTheme`); `next-themes` is not used.

## Gotchas

- After deleting a route, delete `.next` before `pnpm typecheck` (stale `.next/dev/types` reference the old route).
- Footer clock is GMT with "Rabat, Morocco" next to it. The hero status line still says CET.
- `next/font/google` needs network at build time.
