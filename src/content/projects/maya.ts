import type { CaseStudy } from '../types';

export const maya: CaseStudy = {
  slug: 'maya',
  kind: 'agent',
  name: 'Maya',
  card: {
    summary: 'Coding agent that turns Linear tickets into tested pull requests. It opens PRs, I merge them.',
    tags: ['Claude Code', 'Ollama', 'BullMQ', 'Redis'],
    cta: 'Read how it works',
  },
  title: 'Maya: a coding agent that opens its own pull requests',
  seoDescription:
    'Maya is a coding agent I built solo. It turns Linear tickets into tested pull requests with headless Claude Code, and has run on 50+ of my own tickets.',
  updated: '2026-09-30',
  facts: {
    client: 'Personal project',
    role: 'Solo',
    when: '2026',
    stack: ['Claude Code', 'Ollama', 'BullMQ', 'Redis', 'GitHub CLI', 'Telegram'],
  },
  shortVersion:
    'I wanted to see how far a coding agent gets on real tickets with guardrails instead of freedom. Maya has run on 50+ of my own Linear tickets. It works each one in its own worktree, loops on lint and tests, and opens a PR. I review and merge.',
  built: [
    { title: 'Queue', body: 'Linear webhook into BullMQ on Redis, one job per ticket.' },
    { title: 'Worktrees', body: 'A fresh git worktree per ticket, so runs never touch each other.' },
    { title: 'Agent', body: 'Headless Claude Code, with local Ollama models as a cheaper option.' },
    { title: 'Retry loop', body: 'Lint and tests after each attempt. Failures go back to the agent.' },
    {
      title: 'Reports',
      body: 'GitHub CLI opens the PR. Telegram reports completion, failures and cost for every run.',
    },
  ],
  howItsBuilt: 'One ticket, one job, one worktree, one branch. Maya can open a pull request. It cannot merge one.',
  diagram: {
    lanes: [
      {
        label: 'Pipeline',
        nodes: [
          { label: 'Linear ticket', note: 'Webhook' },
          { label: 'BullMQ job', note: 'Redis, one per ticket' },
          { label: 'Git worktree', note: 'Own branch' },
          { label: 'Agent', note: 'Claude Code or Ollama' },
          { label: 'Lint and tests', note: 'Failures loop back' },
          { label: 'Pull request', note: 'GitHub CLI' },
          { label: 'Human review', note: 'Required to merge', human: true },
        ],
      },
      {
        label: 'Signals',
        nodes: [{ label: 'Linear status' }, { label: 'Telegram report', note: 'Completion, failures, cost' }],
      },
    ],
  },
  hardParts: [],
  metrics: [],
  media: { hero: true, details: 0 },
  pending: [],
};
