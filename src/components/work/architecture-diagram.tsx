import { ArrowRight } from '@/components/ui';
import type { Diagram } from '@/content/types';
import { cn } from '@/utils/cn';

/**
 * Phones: a vertical rail, one dot per step, label and note on one row.
 * md and up: a wrapping row of cards with arrows between them.
 */
export default function ArchitectureDiagram({ diagram, name }: { diagram: Diagram; name: string }) {
  return (
    <figure className="flex flex-col gap-7" aria-label={`${name} architecture`}>
      {diagram.lanes.map((lane) => (
        <div key={lane.label} className="flex flex-col gap-3">
          <figcaption className="type-eyebrow text-ink-faint">{lane.label}</figcaption>
          <ol className="border-rule flex flex-col gap-3 border-l md:flex-row md:flex-wrap md:items-stretch md:gap-2 md:border-l-0">
            {lane.nodes.map((node, index) => (
              <li key={node.label} className="contents">
                <div
                  className={cn(
                    'relative flex min-w-0 flex-col gap-0.5 pl-5 md:min-w-32 md:rounded-lg md:border md:px-3.5 md:py-2.5',
                    node.human ? 'md:border-accent md:bg-accent-soft' : 'md:border-rule md:bg-surface',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-[0.55rem] left-[-0.3125rem] size-2.5 rounded-full border-2 md:hidden',
                      node.human ? 'border-accent bg-paper' : 'border-rule bg-surface',
                    )}
                  />
                  <span
                    className={cn('text-[0.9375rem] leading-snug font-medium', node.human ? 'text-accent' : 'text-ink')}
                  >
                    {node.label}
                  </span>
                  {node.note && <span className="text-ink-muted text-xs leading-snug">{node.note}</span>}
                </div>
                {index < lane.nodes.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="text-ink-faint hidden size-4 shrink-0 self-center md:block"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </figure>
  );
}
