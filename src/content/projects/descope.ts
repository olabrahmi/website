import type { CaseStudy } from '../types';

export const descope: CaseStudy = {
  slug: 'descope',
  kind: 'client',
  name: 'Descope',
  card: {
    summary:
      'Led the frontend on four Descope sites, including a 1,500-page docs site and a global hackathon for AI developers.',
    stats: ['4 sites shipped', 'Core Web Vitals passing on mobile and desktop'],
    tags: ['Next.js', 'Contentful', 'Fumadocs', 'CSS Modules', 'Vercel'],
    cta: 'Read case study',
  },
  title: 'Four sites for Descope, one frontend lead',
  facts: {
    client: 'Descope (via Bejamas)',
    role: 'Led the frontend',
    when: '2023 to 2025',
    stack: ['Next.js', 'Contentful', 'Fumadocs', 'CSS Modules', 'Tailwind', 'Vercel'],
    live: [
      { label: 'descope.com', href: 'https://www.descope.com' },
      { label: 'docs.descope.com', href: 'https://docs.descope.com' },
      { label: 'globalmcphackathon.com', href: 'https://globalmcphackathon.com' },
      { label: 'descope.ai', href: 'https://www.descope.ai' },
    ],
  },
  shortVersion:
    'Descope is an identity and auth platform. I led the frontend across its marketing site redesign, its developer docs, its AI site and a hackathon site. All static, all fast, all editable by the marketing team without a developer.',
  built: [
    {
      title: 'descope.com',
      body: 'Full redesign from an outdated design and React version. Next.js, CSS Modules and Contentful, with static pages that revalidate in real time when content changes. It passes Core Web Vitals on mobile and desktop.',
      href: 'https://www.descope.com',
    },
    {
      title: 'docs.descope.com',
      body: '1,500+ statically rendered pages on Fumadocs and Next.js, covering 20+ frontend and backend SDKs. Built for developers deciding whether to adopt Descope.',
      href: 'https://docs.descope.com',
    },
    {
      title: 'globalmcphackathon.com',
      body: "A site for Descope's global MCP hackathon for AI developers, with in-person events in San Francisco and Tel Aviv. Fixed dates, a compressed timeline, and a CMS set up so future editions reuse it.",
      href: 'https://globalmcphackathon.com',
    },
    {
      title: 'descope.ai',
      body: 'A light Next.js and Contentful site with Lottie animations, green on PageSpeed Insights.',
      href: 'https://www.descope.ai',
    },
  ],
  howItsBuilt:
    'Contentful holds the marketing content and pushes changes to static Next.js pages through on-demand revalidation. The docs are a separate Fumadocs build so 1,500 pages stay fast to build and to load. The hackathon and AI sites reuse the same CMS and component approach.',
  diagram: {
    lanes: [
      {
        label: 'descope.com and descope.ai',
        nodes: [
          { label: 'Marketing team', human: true },
          { label: 'Contentful' },
          { label: 'Revalidation', note: 'On content change' },
          { label: 'Static Next.js', note: 'Vercel' },
        ],
      },
      {
        label: 'docs.descope.com',
        nodes: [
          { label: 'SDK docs', note: '20+ SDKs' },
          { label: 'Fumadocs' },
          { label: '1,500+ static pages', note: 'Vercel' },
        ],
      },
      {
        label: 'globalmcphackathon.com',
        nodes: [{ label: 'Contentful' }, { label: 'Next.js' }, { label: 'Reused for later editions' }],
      },
    ],
  },
  hardParts: [
    'Keeping 1,500 docs pages fast to build and fast to load.',
    'Shipping the hackathon site on a fixed launch date without breaking the parent brand.',
  ],
  results: [
    'descope.com passes Core Web Vitals on mobile and desktop, and descope.ai is green on PageSpeed Insights.',
    'The marketing team edits all four sites without a developer.',
  ],
  today:
    'An agent that reads SDK changelogs and drafts docs updates for a human to approve. The MCP hackathon fits the same story: I built the front door for AI developers.',
  media: { hero: true, details: 2, beforeAfter: true },
  pending: ['Agency case study link (Bejamas)', 'Hackathon case study link', 'Before and after videos for descope.com'],
};
