import type { ReactNode } from 'react';

/** A sentence worth stopping on. Sits in the reading column, so a skimmer still gets the point. */
export default function Callout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="border-accent my-2 flex max-w-[40rem] flex-col gap-2 border-l-2 pl-5">
      <p className="type-eyebrow text-accent">{label}</p>
      <div className="font-display text-ink text-xl leading-snug font-semibold tracking-[-0.045em] md:text-[1.375rem]">
        {children}
      </div>
    </aside>
  );
}
