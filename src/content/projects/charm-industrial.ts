import type { CaseStudy } from '../types';

export const charmIndustrial: CaseStudy = {
  slug: 'charm-industrial',
  kind: 'client',
  name: 'Charm Industrial',
  card: {
    summary: 'Gatsby to Next.js rewrite of the site Charm sells through.',
    tags: ['Next.js', 'Tailwind', 'Stripe', 'Vercel'],
    cta: 'Read case study',
  },
  title: 'Rebuilding the site Charm Industrial sells through',
  facts: {
    client: 'Charm Industrial (via Bejamas)',
    role: 'Led the frontend',
    when: '2023 to 2025',
    stack: ['Next.js', 'Tailwind', 'Framer Motion', 'Storyblok', 'Stripe', 'Vercel', 'Express', 'Render'],
    live: [{ label: 'charmindustrial.com', href: 'https://www.charmindustrial.com' }],
  },
  shortVersion:
    'Charm removes carbon from the atmosphere, and its website is where clients buy. I led the rewrite from Gatsby to Next.js, and built the internal tool that watches their factories.',
  context:
    'Gatsby was slow and costly to work in. Plugins bloated the site, and some were deprecated and a security risk. The site needed live data and a modern stack.',
  built: [
    {
      title: 'charmindustrial.com',
      body: 'Full rewrite from Gatsby to Next.js with server rendering for live data. Dead code and unused dependencies gone. Stripe checkout takes hundreds of thousands of dollars a month.',
      href: 'https://www.charmindustrial.com',
    },
    {
      title: 'Factory video dashboard (private)',
      body: 'Internal Next.js app with live camera feeds. Express on Render replays Verkada HLS streams to many viewers.',
    },
  ],
  howItsBuilt:
    'The public site is Next.js on Vercel with Stripe. The dashboard is a separate app: one Express service pulls each stream once and fans it out.',
  diagram: {
    lanes: [
      {
        label: 'charmindustrial.com',
        nodes: [
          { label: 'Visitor' },
          { label: 'Next.js and Tailwind', note: 'Vercel' },
          { label: 'Stripe checkout', note: 'Payments' },
        ],
      },
      {
        label: 'Factory dashboard (private)',
        nodes: [
          { label: 'Verkada cameras', note: 'HLS (m3u8)' },
          { label: 'Express on Render', note: 'Replays to many viewers' },
          { label: 'Next.js app' },
          { label: 'Charm staff', human: true },
        ],
      },
    ],
  },
  hardParts: [
    {
      problem: 'Rewriting a site that takes payments without a day of downtime.',
      call: 'Rebuilt behind the same Stripe checkout and held 99.9% uptime.',
    },
    {
      problem: 'Streaming several camera feeds to many viewers without the backend falling over.',
      call: 'One Express service pulls each Verkada stream once and fans it out, so the cameras see one viewer.',
    },
  ],
  metrics: [
    { value: '3X', label: 'faster page loads', up: true },
    { value: '+86%', label: 'performance improvement', up: true },
    { value: '30%', label: 'lift in conversions', up: true },
    { value: '100k+', label: 'monthly visitors' },
  ],
  media: { hero: true, details: 1 },
  pending: [],
};
