<!-- INSPIRED FROM https://github.com/calcom/cal.com/ -->
<p align="center">
  <a href="https://github.com/olabrahmi/website">
   <img src="https://github.com/olabrahmi/website/assets/41383181/ba15b880-a0cc-4b7b-9e72-22909545d91a" alt="Logo">
  </a>

  <h3 align="center">Oussama Labrahmi</h3>

  <p align="center">
    Senior product engineer. Web platforms and AI agent workflows.
  </p>
</p>

Personal site and portfolio: [labrahmi.me](https://labrahmi.me). Home page, eight case studies (Shaza, Maya, PAYBACK,
Takeda, Descope, Charm Industrial, o1Labs, Akasec), light and dark themes.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4, OKLCH colors
- `motion` for animation, React `<ViewTransition>` for page transitions
- Geist (headings), DM Sans (text), JetBrains Mono (numbers), all through `next/font`
- pnpm 12, Node 24

## Getting started

```bash
pnpm install
cp .env.example .env.local   # NEXT_PUBLIC_SITE_URL
pnpm dev                     # http://localhost:3000
```

| Command          | What it does                                                    |
| ---------------- | --------------------------------------------------------------- |
| `pnpm dev`       | Dev server                                                      |
| `pnpm build`     | Production build. Prints a warning for every unconfirmed metric |
| `pnpm start`     | Serve the production build                                      |
| `pnpm lint`      | ESLint                                                          |
| `pnpm typecheck` | `next typegen` and `tsc --noEmit`                               |

## Editing content

All copy lives in `src/content`, typed by `src/content/types.ts`.

- `site.ts`: name, email, links, nav, hero, about, contact, 404
- `projects/<slug>.ts`: one file per case study. Cards on the home page read from the same file
- `logos.ts`: the names in the logo strip

Home cards show the first two `metrics` of a project. A metric with `up: true` is a real gain and renders green with an
arrow. `confirm: true` marks a number that is not sourced yet: it shows a badge in development and is printed by
`pnpm build`. Projects with no `metrics` simply show no numbers.

## Adding assets

Everything goes in `public/`. Drop the file in with the right name and it shows up. There is nothing to register or
generate, and a missing file never breaks the build.

| Asset              | Where             | Name                                                                                                                                                            |
| ------------------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Screenshots, clips | `public/projects` | `<slug>-hero`, `<slug>-detail-1`, `<slug>-detail-2` as `.webp` or `.webm`. Descope also has `descope-before` and `descope-after`. A `.webm` wins over a `.webp` |
| Logos              | `public/logos`    | `<slug>-light.svg` is the white artwork (shown in dark mode), `<slug>-dark.svg` is the dark artwork (shown in light mode). One file alone is used for both      |
| CV                 | `private/cv`      | `oussama-labrahmi-cv.pdf`, exactly this name. Not public: `/api/cv` serves it, limited to 5 downloads per visitor per 24 hours                                  |

Project slugs: `shaza`, `maya`, `payback`, `takeda`, `descope`, `charm-industrial`, `o1labs`, `akasec`. Logo slugs are the
lowercase name with dashes (`palais-shazam`, `o1labs`), except Charm Industrial, whose files are `charm-light.svg` and
`charm-dark.svg`. Existence is checked when the page renders, so restart `pnpm dev` if a new file does not appear.
Missing files show a dashed placeholder in development and nothing in production.

## Project layout

```
src/app          routes: home, work/[slug], 404, sitemap, robots, OG images
src/components   home, work, layout, motion, logos, ui
src/content      typed copy and case studies
src/base         global CSS (tokens, type roles, buttons) and font config
src/utils        theme, clock, read time, metric parsing
public           logos, project media, CV
docs/plans       the redesign plan
```

## Deploying

Deploys on Vercel. Set `NEXT_PUBLIC_SITE_URL`. Before the first deploy, read the `pnpm build` output: it lists metrics
that still need confirming.

## License

See [LICENSE](LICENSE).
