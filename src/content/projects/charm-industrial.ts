import type { CaseStudy } from '../types';

export const charmIndustrial: CaseStudy = {
  slug: 'charm-industrial',
  kind: 'client',
  name: 'Charm Industrial',
  card: {
    summary:
      'Rewrote charmindustrial.com from Gatsby to Next.js. The site processes hundreds of thousands of dollars a month through Stripe.',
    stats: ['100k+ monthly visitors', '99.9% uptime'],
    tags: ['Next.js', 'Tailwind', 'Framer Motion', 'Stripe', 'Vercel'],
    cta: 'Read case study',
  },
  title: 'Rebuilding the site Charm Industrial sells through',
  facts: {
    client: 'Charm Industrial (via Bejamas)',
    role: 'Led the frontend',
    when: '2023 to 2025',
    stack: ['Next.js', 'Tailwind', 'Framer Motion', 'Stripe', 'Vercel', 'Express', 'Render'],
    live: [{ label: 'charmindustrial.com', href: 'https://www.charmindustrial.com' }],
  },
  shortVersion:
    'Charm removes carbon and sells removal to companies, and its website is where clients buy. I led the rewrite from Gatsby to Next.js and built an internal tool the team uses to watch their factories.',
  built: [
    {
      title: 'charmindustrial.com',
      body: 'Full rewrite, Gatsby to Next.js. Stripe checkout handling hundreds of thousands of dollars a month, 99.9% uptime, and SEO and performance work aimed at keeping visitors on the page.',
      href: 'https://www.charmindustrial.com',
    },
    {
      title: 'Factory video dashboard (private)',
      body: "An internal Next.js app streaming live camera feeds from Charm's factories. An Express backend on Render replays HLS (m3u8) streams from Verkada cameras to several viewers at once.",
    },
  ],
  howItsBuilt:
    'The public site is Next.js on Vercel with Stripe for checkout. The factory dashboard is a separate internal app. One Express service on Render pulls each Verkada HLS stream once and fans it out, so the cameras see a single viewer no matter how many people watch.',
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
    'Rewriting a site that takes payments without a day of downtime.',
    'Streaming several camera feeds to many clients without the backend falling over.',
  ],
  results: ['99.9% uptime on a site that takes hundreds of thousands of dollars a month through Stripe.'],
  today: 'A vision model on the camera feeds that flags anomalies for staff, instead of someone watching all screens.',
  media: { hero: true, details: 1 },
  pending: [
    'Source for "50%+ faster pages" and "30% lift in conversion". They stay hidden until you can show where they come from',
    'Agency case study link (Bejamas)',
  ],
};
