import MediaFrame from './media-frame';

export default function BeforeAfter({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(['before', 'after'] as const).map((state) => (
        <figure key={state} className="flex flex-col gap-2">
          <MediaFrame slug={slug} name={state} alt={`${name}, ${state} the redesign`} />
          <figcaption className="text-ink-muted font-mono text-[0.8125rem] capitalize">{state}</figcaption>
        </figure>
      ))}
    </div>
  );
}
