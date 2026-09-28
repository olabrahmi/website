import type { ReactNode } from 'react';

import { TextLink } from '@/components/ui';
import type { CaseStudyFacts } from '@/content/types';

export default function FactBar({ facts }: { facts: CaseStudyFacts }) {
  const rows: [string, ReactNode][] = [
    ['Client', facts.client],
    ['My role', facts.role],
  ];

  if (facts.when) rows.push(['When', facts.when]);
  if (facts.team) rows.push(['Team', facts.team]);

  rows.push(['Stack', facts.stack.join(', ')]);
  rows.push([
    'Live',
    facts.live?.length ? (
      <span className="flex flex-wrap gap-x-4 gap-y-1">
        {facts.live.map((link) => (
          <TextLink key={link.href} href={link.href}>
            {link.label}
          </TextLink>
        ))}
      </span>
    ) : (
      'Private'
    ),
  ]);

  return (
    <dl className="border-rule grid gap-x-8 gap-y-4 border-y py-6 font-mono text-[0.8125rem] sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(([term, value]) => (
        <div key={term} className="flex flex-col gap-1">
          <dt className="text-ink-muted">{term}</dt>
          <dd className="text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
