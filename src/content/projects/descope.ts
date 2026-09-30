import type { CaseStudy } from '../types';

export const descope: CaseStudy = {
  slug: 'descope',
  kind: 'client',
  name: 'Descope',
  card: {
    summary: 'Frontend lead on four sites, including 1,500 pages of docs.',
    tags: ['Next.js', 'Contentful', 'Fumadocs', 'Vercel'],
    cta: 'Read case study',
  },
  title: 'Four sites for Descope, one frontend lead',
  seoDescription:
    'I led the frontend for four Descope sites: a redesign, 1,500+ pages of docs, an AI site and a hackathon. Marketing publishes without waiting on engineers.',
  updated: '2026-09-30',
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
    'Descope is an auth platform. I led the frontend across four sites: a full redesign, 1,500+ pages of docs, an AI site and a global hackathon. Marketing publishes on all of them without waiting on engineers.',
  context:
    'A returning client. First a flexible site, then a full redesign to match a new brand. Traffic was high, so the move could not disrupt it.',
  built: [
    {
      title: 'descope.com',
      body: 'Full redesign and move to a headless CMS. Reusable components, content migrated with SEO intact, static pages that revalidate when content changes.',
      href: 'https://www.descope.com',
    },
    {
      title: 'docs.descope.com',
      body: '1,500+ static pages on Fumadocs covering 20+ SDKs, built for developers deciding whether to adopt Descope.',
      href: 'https://docs.descope.com',
    },
    {
      title: 'globalmcphackathon.com',
      body: 'Landing page for the global MCP hackathon for AI developers, with events in San Francisco and Tel Aviv. Live within weeks, in the Descope look, and marketing can duplicate it for the next edition.',
      href: 'https://globalmcphackathon.com',
    },
    {
      title: 'descope.ai',
      body: 'Light Next.js and Contentful site with Lottie animations. Green on PageSpeed Insights.',
      href: 'https://www.descope.ai',
    },
  ],
  howItsBuilt:
    'Contentful pushes changes to static Next.js pages through on-demand revalidation. Docs are a separate Fumadocs build.',
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
        nodes: [{ label: 'Contentful' }, { label: 'Next.js' }, { label: 'Duplicated for later editions' }],
      },
    ],
  },
  hardParts: [
    {
      problem: 'Keeping 1,500 docs pages fast to build and to load.',
      call: 'Static rendering on Fumadocs, kept as its own build apart from the marketing site.',
    },
    {
      problem: 'A fixed launch date for the hackathon site, without breaking the parent brand.',
      call: 'Reused the Contentful and component setup from descope.com, so it looked like Descope from day one.',
    },
  ],
  metrics: [
    { value: '4', label: 'sites shipped' },
    { value: '1,500+', label: 'docs pages' },
    { value: '20+', label: 'SDKs documented' },
    { value: 'Pass', label: 'Core Web Vitals, mobile and desktop', up: true },
  ],
  media: {
    hero: true,
    details: 2,
    beforeAfter: true,
    alt: { hero: 'Descope homepage: identity journeys for customers and AI agents' },
  },
  pending: [],
};
