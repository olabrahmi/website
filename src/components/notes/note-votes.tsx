'use client';

import { useEffect, useRef, useState } from 'react';

import { ArrowDown, ArrowUp } from '@/components/ui';
import { person } from '@/content/site';
import { cn } from '@/utils/cn';

type Vote = -1 | 0 | 1;

interface Tally {
  up: number;
  down: number;
  mine: Vote;
}

/** What the counts become when this visitor's vote changes. */
function applyVote(tally: Tally, next: Vote): Tally {
  return {
    up: tally.up + (next === 1 ? 1 : 0) - (tally.mine === 1 ? 1 : 0),
    down: tally.down + (next === -1 ? 1 : 0) - (tally.mine === -1 ? 1 : 0),
    mine: next,
  };
}

/**
 * Upvote and downvote. The page is static, so counts come from the API, and only once the widget is close to the
 * screen: most visits should not wake the database. It hides itself when the database is not available.
 */
export default function NoteVotes({ slug }: { slug: string }) {
  const [tally, setTally] = useState<Tally | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState('');
  const root = useRef<HTMLElement>(null);
  const endpoint = `/api/notes/${slug}/votes`;

  useEffect(() => {
    const node = root.current;

    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();
        fetch(endpoint)
          .then((response) => {
            if (!response.ok) throw new Error(String(response.status));

            return response.json() as Promise<Tally>;
          })
          .then((next) => setTally((current) => current ?? next))
          .catch(() => setUnavailable(true));
      },
      { rootMargin: '400px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [endpoint]);

  if (unavailable) return null;

  const vote = async (value: 1 | -1) => {
    const previous = tally ?? { up: 0, down: 0, mine: 0 as Vote };
    const next: Vote = previous.mine === value ? 0 : value;

    setError('');
    setTally(applyVote(previous, next));

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: next }),
      });

      if (response.status === 429) throw new Error('Too many votes from this network. Try again later.');
      if (!response.ok) throw new Error("Your vote didn't save. Try again.");

      setTally((await response.json()) as Tally);
    } catch (cause) {
      setTally(previous);
      setError(cause instanceof TypeError ? "Your vote didn't save. Try again." : (cause as Error).message);
    }
  };

  const buttons = [
    { value: 1 as const, label: 'Upvote', Icon: ArrowUp, count: tally?.up },
    { value: -1 as const, label: 'Downvote', Icon: ArrowDown, count: tally?.down },
  ];

  return (
    <section ref={root} aria-labelledby="note-vote-heading" className="flex flex-col gap-3">
      <h2 id="note-vote-heading" className="type-h3 text-ink">
        Was this note useful?
      </h2>
      <div className="flex items-center gap-2">
        {buttons.map(({ value, label, Icon, count }) => {
          const active = tally?.mine === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => vote(value)}
              aria-pressed={active}
              aria-label={count === undefined ? label : `${label}, ${count} so far`}
              className={cn(
                'border-rule inline-flex h-11 min-w-20 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 font-medium',
                'transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none',
                active
                  ? 'bg-accent-soft text-accent border-accent/40'
                  : 'bg-surface text-ink [@media(hover:hover)]:hover:bg-surface-2',
              )}
            >
              <Icon className="size-4" />
              <span className={cn('tabular-nums transition-opacity duration-150', count === undefined && 'opacity-0')}>
                {count ?? 0}
              </span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="text-ink-muted min-h-6 text-[0.9375rem]">
        {error}
        {!error && tally?.mine === 1 && 'Thanks. Send it to someone who is worried about their job.'}
        {!error && tally?.mine === -1 && (
          <>
            What did I get wrong?{' '}
            <a
              href={`mailto:${person.email}`}
              className="text-ink decoration-accent/50 underline decoration-1 underline-offset-[3px]"
            >
              Email me
            </a>
            .
          </>
        )}
      </p>
    </section>
  );
}
