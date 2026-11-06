import { Reveal } from '@/components/motion';
import { cn } from '@/utils/cn';

const DOTS = 40;

const stages = [
  {
    name: 'Before',
    summary: 'High cost, limited adoption',
    cost: 88,
    users: 7,
    total: 38,
  },
  {
    name: 'After',
    summary: 'Lower cost, much wider adoption',
    cost: 30,
    users: 34,
    total: 82,
  },
];

function Bar({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-ink-muted text-[0.8125rem] leading-none">{label}</p>
      <div className="bg-surface-2 h-2 overflow-hidden rounded-full">
        <div
          style={{ width: `${value}%` }}
          className={cn('h-full rounded-full', strong ? 'bg-accent' : 'bg-ink-faint')}
        />
      </div>
    </div>
  );
}

/** Before and after, drawn. The words carry the meaning, so the bars and dots are hidden from assistive tech. */
export default function JevonsDiagram() {
  return (
    <Reveal>
      <figure className="border-rule bg-surface my-2 overflow-hidden rounded-2xl border">
        <div className="bg-rule grid gap-px sm:grid-cols-2">
          {stages.map((stage) => (
            <div key={stage.name} className="bg-surface flex flex-col gap-4 p-5">
              <div>
                <p className="type-eyebrow text-accent">{stage.name}</p>
                <p className="font-display text-ink mt-2 text-lg leading-tight font-semibold tracking-[-0.045em]">
                  {stage.summary}
                </p>
              </div>
              <div aria-hidden="true" className="flex flex-col gap-4">
                <Bar label="Cost per use" value={stage.cost} />
                <div className="flex flex-col gap-2">
                  <p className="text-ink-muted text-[0.8125rem] leading-none">People using it</p>
                  <div className="grid w-fit grid-cols-[repeat(10,auto)] gap-1.5">
                    {Array.from({ length: DOTS }, (_, index) => (
                      <span
                        key={index}
                        style={{ '--d': index } as React.CSSProperties}
                        className={cn(
                          'size-3 rounded-full',
                          index < stage.users ? 'jevons-dot bg-accent' : 'bg-surface-2',
                        )}
                      />
                    ))}
                  </div>
                </div>
                <Bar label="Total use" value={stage.total} strong />
              </div>
            </div>
          ))}
        </div>
        <figcaption className="border-rule text-ink border-t p-5 text-[0.9375rem] leading-snug">
          <strong className="font-semibold">Result: more total demand.</strong> Efficiency increases, but usage can grow
          even faster. <span className="text-ink-muted">Illustration, not to scale.</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}
