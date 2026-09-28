import type { CaseStudy } from '../types';

export const shaza: CaseStudy = {
  slug: 'shaza',
  kind: 'agent',
  name: 'Shaza',
  card: {
    summary:
      "A WhatsApp agent that books hotel rooms. It checks live availability with the hotel's channel manager and confirms the reservation in the chat. 20+ real bookings from hotels in Morocco so far.",
    stats: ['20+ real reservations', 'Hotels in Morocco'],
    tags: ['Claude Sonnet', 'Claude Haiku', 'n8n', 'WhatsApp', 'Next.js'],
    cta: 'See how it books',
  },
  title: 'Shaza: an AI agent that takes hotel bookings on WhatsApp',
  facts: {
    client: 'Own product',
    role: 'Solo, end to end',
    when: '2026',
    stack: ['n8n (self-hosted)', 'Claude Sonnet', 'Claude Haiku', 'WhatsApp', 'Next.js', 'Drizzle', 'Neon Postgres'],
  },
  shortVersion:
    "Hotels in Morocco get most booking questions on WhatsApp, and staff answer them by hand. Shaza answers instead: it understands the request, checks real availability with the hotel's channel manager, and books the room in the conversation. It has recorded 20+ confirmed reservations.",
  built: [
    {
      body: 'The agent workflow on a self-hosted n8n server: WhatsApp in, tool calls to the channel manager, reservation out.',
    },
    {
      body: "A detailed system prompt encoding each hotel's rules: rooms, prices, policies, what to confirm before booking, and when to hand off to staff.",
    },
    {
      body: 'A model split for cost: Claude Sonnet handles reasoning and tool calls, Claude Haiku writes the guest-facing replies.',
    },
    { body: 'A Next.js admin dashboard for hotel staff, on Drizzle and Neon Postgres.' },
  ],
  howItsBuilt:
    'Every guest message goes through one n8n workflow. Sonnet decides what to do and calls the channel manager for availability. Haiku turns the result into a short, natural reply. The model never states availability on its own: it only repeats what the channel manager returned.',
  diagram: {
    lanes: [
      {
        label: 'Booking flow',
        nodes: [
          { label: 'Guest on WhatsApp', note: 'Asks for dates and a room' },
          { label: 'n8n workflow', note: 'Self-hosted' },
          { label: 'Claude Sonnet', note: 'Reasoning and tool calls' },
          { label: 'Channel manager', note: 'Live availability' },
          { label: 'Claude Haiku', note: 'Writes the reply' },
          { label: 'Reservation confirmed', note: 'In the same chat' },
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
    "Never promising a room that isn't free. Availability comes from the channel manager, never from the model.",
    'Keeping replies natural and cheap at the same time. The Sonnet and Haiku split solves that.',
  ],
  results: ['20+ confirmed reservations from hotels in Morocco.'],
  measuring: {
    intro: 'Numbers I still owe this page:',
    items: ['Number of hotels', 'Conversation-to-booking rate', 'Cost per conversation'],
  },
  next: 'A test set of real guest conversations, so I catch regressions when the prompt or the model changes.',
  media: { hero: true, details: 2 },
  pending: [
    'Number of hotels using Shaza',
    'Conversation-to-booking rate',
    'Cost per conversation',
    'Public URL for Shaza, if there is one (fact bar says Private until then)',
  ],
};
