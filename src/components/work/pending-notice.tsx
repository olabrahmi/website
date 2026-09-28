export default function PendingNotice({ items }: { items: string[] }) {
  if (process.env.NODE_ENV !== 'development' || items.length === 0) return null;

  return (
    <aside className="border-accent text-ink rounded-lg border border-dashed p-4 font-mono text-[0.8125rem]">
      <p className="mb-2 font-medium">Development only: still needed on this page</p>
      <ul className="text-ink-muted list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
