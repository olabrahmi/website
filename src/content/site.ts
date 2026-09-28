import type { HowIWorkItem, SocialLink } from './types';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://labrahmi.me';

export const person = {
  name: 'Oussama Labrahmi',
  jobTitle: 'Senior product engineer',
  location: 'Rabat, Morocco',
  email: 'labrahmioussama@gmail.com',
  callUrl: 'https://cal.com/labrahmi/15min',
  cvPath: '/cv/oussama-labrahmi-cv.pdf',
  timeZone: 'Africa/Casablanca',
} as const;

export const description =
  'Oussama Labrahmi, senior product engineer building web platforms and AI agent workflows. Case studies from PAYBACK, Takeda, Descope and more.';

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/0sssama' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/oussama-labrahmi' },
  { label: 'X', href: 'https://x.com/0sssama' },
];

export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Blog', href: '/blog' },
  { label: 'CV', href: '/cv' },
] as const;

export const hero = {
  headline: 'I build web platforms big teams rely on. Now I build the AI agents that ship them.',
  subline:
    "Senior product engineer, six years in. I've shipped for PAYBACK, Takeda and Descope, and these days I build agent workflows that turn tickets into tested pull requests.",
  status: 'Open to remote Applied AI and Senior Product Engineer roles. Based in Morocco, working CET hours.',
} as const;

export const howIWork: HowIWorkItem[] = [
  {
    lead: 'I write things down.',
    body: "Every project gets decision records explaining why it's built the way it is, so the next developer isn't guessing.",
  },
  {
    lead: 'Tests before trust.',
    body: "Playwright for flows, Vitest for logic, code review on everything. Same rule for agents: if I can't measure it, I don't ship it.",
  },
  {
    lead: "Content teams shouldn't need me.",
    body: 'I build section systems editors use like Lego, then get out of their way.',
  },
  {
    lead: 'I care what happens after launch.',
    body: "SLOs, monitoring, on-call. A deploy isn't the finish line.",
  },
];

export const about = {
  heading: 'About me',
  body: [
    "I'm Oussama, a product engineer based in the Rabat metropolitan area, Morocco. I learned to code at 1337 and have spent the last six years building web products for startups and enterprises across Europe and the US.",
    "Right now I own the sign-up flow at PAYBACK and I'm co-founding Dali, a toolkit for content creators. On the side I build coding agents and try to break them. I'm also the person who rebuilds Morocco's biggest cybersecurity event site every December.",
  ],
  facts: [
    ['Based in', 'Rabat, Morocco'],
    ['Learned to code at', '1337'],
    ['Experience', '6 years'],
    ['Right now', 'PAYBACK sign-up flow'],
    ['Co-founding', 'Dali'],
  ],
} as const;

export const contact = {
  heading: 'Hiring for AI or product engineering?',
  body: 'I reply within a day.',
} as const;

export const blog = {
  heading: 'Writing',
  empty: 'No posts yet. First one is about how Maya fails. Check back soon.',
} as const;

export const notFound = {
  message: "This page doesn't exist. Try the work section.",
  button: 'See my work',
} as const;

export const workIntro = 'Enterprise platforms, product sites and one cybersecurity event I rebuild every year.';
