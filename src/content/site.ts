import type { Capability, FaqItem, SocialLink } from './types';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://labrahmi.me';

export const person = {
  name: 'Oussama Labrahmi',
  jobTitle: 'Senior full-stack product engineer',
  location: 'Casablanca, Morocco',
  email: 'oussama@labrahmi.me',
  callUrl: 'https://cal.com/labrahmi/15min',
} as const;

export const description =
  'Oussama Labrahmi, senior full-stack product engineer. Frontend, backend, monitoring, on-call and AI agents. Hire me full-time or freelance, remote.';

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/olabrahmi' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/olabrahmi/' },
];

/** Blog is hidden for now: add `{ label: 'Blog', href: '/blog' }` back with the route. */
export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'Services', href: '/#capabilities' },
  { label: 'About', href: '/#about' },
  // Hidden on phones: the hero already has this button.
  { label: 'Email me', href: `mailto:${person.email}` },
] as const;

export const hero = {
  headline: 'I build web platforms and AI agents.',
  subline:
    "I'm Oussama Labrahmi. I take web products from frontend to backend to on-call, and I build AI agents. Six years with PAYBACK, Takeda and Descope.",
  status: 'Open to senior roles and freelance projects · Remote, CET',
} as const;

export const about = {
  heading: 'About me',
  body: [
    "I'm Oussama. I taught myself to code at 10. Joining 1337 in Khouribga grew my skills and network.",
    "Six years building across Europe and the US. I own PAYBACK's sign-up flow and I'm stakeholder and technical advisor at Dali.",
    'I also build coding agents for fun, mostly late at night.',
  ],
  facts: ['Casablanca, Morocco', '1337 alum', '6 years', 'Advisor at Dali', 'Full-time or freelance'],
} as const;

export const contact = {
  heading: 'Hiring, or need a product built?',
  body: 'I reply within a day.',
} as const;

export const notFound = {
  message: "This page doesn't exist. Try the work section.",
  button: 'See my work',
} as const;

export const workIntro = "AI agents I'm building now, and the platforms I've shipped for clients.";

export const capabilities = {
  eyebrow: 'End to end',
  heading: 'What I do',
  intro: 'One person from the first screen to the pager.',
  items: [
    {
      title: 'Frontend',
      body: 'Next.js, React and TypeScript. Sign-up flows, marketing sites, docs and page builders editors run alone.',
      proof: ['payback', 'takeda', 'descope'],
    },
    {
      title: 'Backend and data',
      body: 'Node and Express services, Postgres with Drizzle, ticketing, payments with Stripe, video fan-out.',
      proof: ['charm-industrial', 'akasec', 'shaza'],
    },
    {
      title: 'Monitoring and on-call',
      body: 'Datadog SLOs and synthetic checks, circuit breakers, and one week a month of 24/7 on-call.',
      proof: ['payback'],
    },
    {
      title: 'Infra and delivery',
      body: 'GCP with Terraform, Vercel, Playwright on every path, Vitest for logic.',
      proof: ['payback'],
    },
    {
      title: 'AI agents and workflows',
      body: 'Claude agents that call tools and book real rooms, and a coding agent that opens its own pull requests.',
      proof: ['shaza', 'maya'],
    },
  ] satisfies Capability[],
} as const;

export const faq = {
  eyebrow: 'Quick answers',
  heading: 'Before you email',
  items: [
    {
      question: 'What kind of work do you take on?',
      answer:
        'Web products end to end. I build the frontend in Next.js and React, the backend and database behind it, the monitoring that tells you when it breaks, and AI agents that do real work. Recent clients include PAYBACK, Takeda and Descope.',
    },
    {
      question: 'Are you open to full-time roles or freelance?',
      answer:
        'Both. I take senior full-time roles and freelance or contract projects, fully remote. I work Central European hours and overlap with the US East Coast in the afternoon. Email me with what you are building and I reply within a day.',
    },
    {
      question: 'Do you do backend and on-call, or only frontend?',
      answer:
        'Both. At PAYBACK I own the frontend of sign-up, set up Datadog SLOs and synthetic checks, and take 24/7 on-call one week a month. For Charm Industrial I built the internal factory dashboard, where one Express service fans out camera streams to many viewers.',
    },
    {
      question: 'What AI agents have you built?',
      answer:
        'Shaza answers hotel guests on WhatsApp, Booking.com, Airbnb and email, checks live availability and books the room, using Claude and n8n. Maya is a coding agent that turns Linear tickets into tested pull requests with headless Claude Code.',
    },
    {
      question: 'Where are you based?',
      answer:
        'Casablanca, Morocco. I have worked remotely for six years with teams in Germany, Poland, the US and Morocco. I learned at 1337, the peer-to-peer coding school in Khouribga.',
    },
  ] satisfies FaqItem[],
} as const;
