import { cn } from '@/utils/cn';
import type { Diagram } from '@/content/types';

export default function ArchitectureDiagram({ diagram, name }: { diagram: Diagram; name: string }) {
  return (
    <figure className="flex flex-col gap-8" aria-label={`${name} architecture`}>
      {diagram.lanes.map((lane) => (
        <div key={lane.label} className="flex flex-col gap-3">
          <figcaption className="text-ink-muted font-mono text-[0.8125rem]">{lane.label}</figcaption>
          <ol className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-x-5 md:gap-y-4">
            {lane.nodes.map((node, index) => (
              <li
                key={node.label}
                className={cn(
                  'bg-surface relative flex min-w-0 flex-col justify-center gap-0.5 rounded-lg border px-3.5 py-2.5 md:min-w-36 md:flex-1',
                  node.human ? 'border-accent bg-paper border-2' : 'border-rule',
                )}
              >
                <span className="text-ink text-[0.9375rem] leading-snug font-medium">{node.label}</span>
                {node.note && <span className="text-ink-muted font-mono text-xs leading-snug">{node.note}</span>}
                {index < lane.nodes.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="bg-rule absolute -bottom-3 left-1/2 h-3 w-px -translate-x-1/2 md:top-1/2 md:-right-5 md:bottom-auto md:left-auto md:h-px md:w-5 md:translate-x-0 md:-translate-y-1/2"
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
