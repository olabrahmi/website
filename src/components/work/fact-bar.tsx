import type { CaseStudyFacts } from '@/content/types';

/** Client, role, when and team as rounded chips. The live link sits beside the title, the stack at the bottom. */
export default function FactBar({ facts }: { facts: CaseStudyFacts }) {
  const rows = [
    ['Client', facts.client],
    ['Role', facts.role],
    ['When', facts.when],
    ['Team', facts.team],
  ].filter((row): row is [string, string] => !!row[1]);

  return (
    <ul className="flex flex-wrap gap-2">
      {rows.map(([term, value]) => (
        <li
          key={term}
          className="border-rule bg-surface inline-flex items-center gap-2 rounded-2xl border px-3.5 py-1.5 text-[0.8125rem] leading-snug"
        >
          <span className="type-eyebrow text-ink-faint shrink-0">{term}</span>
          <span className="text-ink">{value}</span>
        </li>
      ))}
    </ul>
  );
}
