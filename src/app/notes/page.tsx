import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ViewTransition } from 'react';

import { Contact } from '@/components/home';
import { SpotlightCard } from '@/components/motion';
import { ArrowRight, Container } from '@/components/ui';
import { allNotes } from '@/content/notes';
import { person } from '@/content/site';
import { notesGraph, serializeJsonLd } from '@/utils/json-ld';
import { formatNoteDate, getNoteStats } from '@/utils/notes';

const slide = { 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' } as const;

const title = 'Notes';
const description = 'Short notes by Oussama Labrahmi on AI, software and the job market, from six years of building.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/notes',
    types: { 'application/rss+xml': [{ url: '/notes/feed.xml', title: `Notes by ${person.name}` }] },
  },
  openGraph: { type: 'website', siteName: person.name, title, description, url: '/notes' },
};

export default function NotesPage() {
  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(notesGraph()) }} />
        <Container className="pt-28 md:pt-36">
          <h1 className="type-display-2 text-ink">Notes</h1>
          <p className="text-ink-muted mt-4 max-w-[46ch] text-lg">
            What I think about AI, software and the job market, with the numbers I checked.
          </p>
          <ul className="mt-10 flex flex-col gap-4">
            {allNotes.map((note, index) => (
              <li key={note.slug}>
                <SpotlightCard
                  as="article"
                  className="group/card has-[a:focus-visible]:outline-focus overflow-hidden has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-t-[calc(1rem-1px)] md:aspect-auto md:rounded-l-[calc(1rem-1px)] md:rounded-tr-none">
                    <Image
                      src={note.cover.src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 470px, 100vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-6 md:min-h-72 md:p-8">
                    <p className="text-ink-muted text-sm">
                      {note.topic} &middot; <time dateTime={note.published}>{formatNoteDate(note.published)}</time>{' '}
                      &middot; <span className="font-mono">{getNoteStats(note.slug).minutes}</span> min read
                    </p>
                    <h2 className="type-h2 text-ink">
                      <Link
                        href={`/notes/${note.slug}`}
                        transitionTypes={['nav-forward']}
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {note.title}
                      </Link>
                    </h2>
                    <p className="text-ink-muted">{note.description}</p>
                    <span className="text-ink mt-auto flex items-center gap-1.5 pt-2 text-[0.9375rem] font-medium">
                      Read the note
                      <ArrowRight className="text-accent ease-out-strong size-4 transition-transform duration-150 [@media(hover:hover)]:group-hover/card:translate-x-0.5" />
                    </span>
                  </div>
                </SpotlightCard>
              </li>
            ))}
          </ul>
        </Container>
        <Contact />
      </main>
    </ViewTransition>
  );
}
