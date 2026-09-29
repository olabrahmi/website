import MediaFrame from './media-frame';

export default function BeforeAfter({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(['before', 'after'] as const).map((state) => (
        <figure key={state} className="flex flex-col gap-2">
          <MediaFrame slug={slug} name={state} alt={`${name}, ${state} the redesign`} />
          <figcaption className="type-eyebrow text-ink-faint">{state}</figcaption>
        </figure>
      ))}
    </div>
  );
}
