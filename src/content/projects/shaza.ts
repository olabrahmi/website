import type { CaseStudy } from '../types';

export const shaza: CaseStudy = {
  slug: 'shaza',
  kind: 'agent',
  name: 'Shaza',
  card: {
    summary: 'Answers hotel guests on WhatsApp, Booking.com, Airbnb and email, in any language. Then books the room.',
    tags: ['Claude', 'n8n', 'WhatsApp', 'Booking.com', 'Airbnb'],
    cta: 'See how it books',
  },
  title: 'Shaza: an AI agent that answers hotel guests and books rooms',
  seoDescription:
    'Shaza is an AI agent I built solo. It answers hotel guests on WhatsApp, Booking.com, Airbnb and email, in any language, and books the room itself.',
  updated: '2026-10-02',
  facts: {
    client: 'Own product, sold to hotels',
    role: 'Solo, end to end',
    when: '2026',
    stack: [
      'n8n (self-hosted)',
      'Claude',
      'WhatsApp',
      'Booking.com',
      'Airbnb',
      'Email',
      'Next.js',
      'Drizzle',
      'Neon Postgres',
    ],
  },
  shortVersion:
    'Shaza answers hotel guests instantly, in any language, on WhatsApp, Booking.com, Airbnb and email. It checks live availability and books the room. Staff get 3+ hours a day back.',
  built: [
    {
      title: 'Agent workflow',
      body: 'Self-hosted n8n: messages in from every channel, tool calls to the channel manager, reply and reservation out.',
    },
    {
      title: 'Hotel rules',
      body: 'A system prompt per hotel: rooms, prices, policies, what to confirm, when to hand off to staff.',
    },
    {
      title: 'Model split',
      body: 'Claude Sonnet reasons and calls tools. Claude Haiku writes the replies. Cheaper, still natural.',
    },
    { title: 'Staff dashboard', body: 'Next.js admin on Drizzle and Neon Postgres.' },
  ],
  howItsBuilt:
    'Every message goes through one n8n workflow. Sonnet decides and checks availability, Haiku writes the reply. The model only repeats what the channel manager returned.',
  diagram: {
    lanes: [
      {
        label: 'Booking flow',
        nodes: [
          { label: 'Guest message', note: 'WhatsApp, Booking.com, Airbnb or email' },
          { label: 'n8n workflow', note: 'Self-hosted' },
          { label: 'Claude Sonnet', note: 'Reasoning and tool calls' },
          { label: 'Channel manager', note: 'Live availability' },
          { label: 'Claude Haiku', note: 'Writes the reply' },
          { label: 'Reservation confirmed', note: 'Reply in the same thread' },
        ],
      },
      {
        label: 'Hotel staff',
        nodes: [
          { label: 'Next.js dashboard' },
          { label: 'Drizzle' },
          { label: 'Neon Postgres' },
          { label: 'Staff take over', note: 'When the prompt says hand off', human: true },
        ],
      },
    ],
  },
  hardParts: [
    {
      problem: "Never promising a room that isn't free.",
      call: 'Availability comes from the channel manager, never from the model.',
    },
    {
      problem: 'Replies that are natural and cheap at once.',
      call: 'Sonnet for reasoning and tools, Haiku for the guest-facing text.',
    },
  ],
  metrics: [
    { value: '20+', label: 'rooms booked', up: true },
    { value: '81%', label: 'of conversations end in a booking', up: true },
    { value: '3h+', label: 'saved for staff each day', up: true },
    { value: '3', label: 'hotels using it' },
  ],
  next: 'Real guest conversations as a regression set for prompt and model changes.',
  media: { hero: true, details: 0 },
  pending: [],
};
