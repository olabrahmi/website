import type { Capability, FaqItem, SocialLink, Testimonial } from './types';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://labrahmi.me';

export const person = {
  name: 'Oussama Labrahmi',
  jobTitle: 'Senior product engineer',
  location: 'Casablanca, Morocco',
  email: 'oussama@labrahmi.me',
  callUrl: 'https://cal.com/labrahmi/15min',
} as const;

export const description =
  'Oussama Labrahmi, senior product engineer. I build web platforms and AI agents, from the first screen to on-call. Freelance or full-time, remote.';

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
  subline: "I'm Oussama, a senior product engineer. Six years shipping for clients like PAYBACK, Takeda and Descope.",
  status: 'Open to freelance projects and senior roles · Remote, GMT',
} as const;

export const about = {
  heading: 'About me',
  body: [
    'I taught myself to code at 10, then trained at 1337, part of the 42 network.',
    'Six years shipping for teams in Germany, Poland, the US and Morocco.',
    "I'm stakeholder and technical advisor at {dali}, where AI matches creators with brands.",
    'I also build coding agents for fun.',
  ],
  links: { dali: { label: 'Dali', href: 'https://daliplatform.com' } },
  facts: [
    'Casablanca, GMT',
    'English, French, Arabic',
    '6 years remote',
    '1337 alum',
    'Won the 1337 and UNFPA hackathon',
    'Freelance or full-time',
  ],
} as const;

export const contact = {
  heading: 'Hiring, or need a product built?',
  body: 'I reply within a day. Calls are 15 minutes, no prep needed.',
} as const;

export const notFound = {
  message: "This page doesn't exist. Try the work section.",
  button: 'See my work',
} as const;

/** Top to bottom: the order of the stack in "What I do" (screen on top, pager at the bottom). Keep the CV in step. */
export const capabilities = {
  eyebrow: 'End to end',
  heading: 'What I do',
  intro: 'One person from the first screen to the pager.',
  items: [
    {
      title: 'Web platforms',
      body: 'Next.js, React and TypeScript. Sign-up flows, marketing sites, docs, and page builders your team runs alone.',
      proof: ['payback', 'takeda', 'descope', 'o1labs'],
    },
    {
      title: 'AI agents',
      body: "Claude agents that plug into a company's internal systems, so they do real work for employees and clients.",
      proof: ['shaza', 'maya'],
    },
    {
      title: 'Backend and data',
      body: 'Node and Postgres services that store your data and run your business logic behind the interface.',
      proof: ['charm-industrial', 'akasec', 'shaza'],
    },
    {
      title: 'Reliability and on-call',
      body: 'Monitoring, alerts and on-call that keep your product running, and fix it quickly when it breaks.',
      proof: ['payback'],
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
        'Web products, end to end: Next.js frontends, the backend behind them, monitoring, and AI agents that do real work for your team.',
    },
    {
      question: 'Are you available for freelance or full-time work?',
      answer:
        "Both. Freelance is monthly or scoped, fully remote. I also take senior full-time roles. It starts with a 15-minute call where you tell me what you're building.",
    },
    {
      question: 'Where are you based, and which hours do you work?',
      answer:
        "I'm in Casablanca, on GMT. I work full days with teams in Europe, and my afternoons overlap the US East Coast morning. I work in English, French and Arabic.",
    },
    {
      question: 'Do you do backend and on-call, or only frontend?',
      answer:
        'Both. I build a product end to end: the Next.js frontend, the backend and database behind it, and the monitoring and alerts that tell me when something breaks.',
    },
    {
      question: 'Which tools and stack do you work with?',
      answer:
        'Next.js, React and TypeScript on the frontend, Node and Postgres on the backend, Datadog for monitoring, and Claude for AI agents. If your stack is different, tell me and we can talk.',
    },
  ] satisfies FaqItem[],
} as const;

/** Real quotes only, verbatim, with the person's permission. Empty hides the section. */
export const testimonials = {
  eyebrow: 'In their words',
  heading: 'What people say',
  items: [] as Testimonial[],
};
