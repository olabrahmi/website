import type { CaseStudy } from '../types';

export const maya: CaseStudy = {
  slug: 'maya',
  kind: 'agent',
  name: 'Maya',
  card: {
    summary:
      'An agent pipeline that picks up a Linear ticket, works on it in its own git branch, runs lint and tests until they pass, and opens a pull request for me to review. Nothing merges without a human.',
    stats: ['Ticket to PR, end to end', 'Human review on every change'],
    tags: ['Claude Code', 'Local LLMs (Ollama)', 'BullMQ', 'Redis', 'GitHub CLI'],
    cta: 'Read how it works',
  },
  title: 'Maya: a coding agent that opens its own pull requests',
  facts: {
    client: 'Personal project',
    role: 'Solo',
    when: '2026',
    stack: ['Claude Code', 'Ollama', 'BullMQ', 'Redis', 'GitHub CLI', 'Telegram'],
  },
  shortVersion:
    'I wanted to see how far a coding agent gets on real tickets if you give it guardrails instead of freedom. Maya picks up a Linear ticket, works in an isolated git worktree, loops on lint and tests, and opens a PR. I review and merge.',
  built: [
    { body: 'A Linear webhook into a BullMQ queue on Redis, one job per ticket.' },
    { body: 'A fresh git worktree per ticket, so runs never touch each other.' },
    { body: 'Headless Claude Code as the agent, with local models on Ollama as a cheaper option.' },
    { body: 'A retry loop: lint and tests run after each attempt, and failures go back to the agent.' },
    { body: 'PR creation with the GitHub CLI, Linear status updates, and Telegram alerts.' },
  ],
  howItsBuilt:
    'One ticket becomes one job, one worktree and one branch. The agent works until lint and tests pass or it runs out of attempts. It can open a pull request. It cannot merge one.',
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
          { label: 'My review', note: 'Waiting on me', human: true },
        ],
      },
      {
        label: 'Signals',
        nodes: [{ label: 'Linear status update' }, { label: 'Telegram alert' }],
      },
    ],
  },
  hardParts: [
    'Networking between WSL2 and Ollama under a corporate VPN.',
    "Deciding where the agent stops. It can open PRs, it can't merge them.",
  ],
  measuring: {
    intro: "I'm running Maya on 30 to 50 real tickets. When the run finishes, this page will report:",
    items: [
      'Task completion rate',
      'A failure breakdown: wrong file, broken tests, gave up, loops',
      'Cost and time per successful PR',
      'Claude vs a local model on the same tickets',
    ],
  },
  next: 'An eval suite, tracing per step, and a model router based on the numbers above.',
  media: { hero: true, details: 2 },
  pending: [
    'Run Maya on 30 to 50 real tickets and fill in completion rate, failure breakdown, cost and time per PR, Claude vs local model. Replace the "Measuring now" block with a Results block.',
  ],
};
