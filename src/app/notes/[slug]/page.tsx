import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';

import { Contact } from '@/components/home';
import { NoteShare, NoteVotes, ReadingLeft } from '@/components/notes';
import { ArrowLeft, Button, Container } from '@/components/ui';
import { EmailIcon } from '@/components/ui/social-icons';
import { CaseToc } from '@/components/work';
import { allNotes, getNote } from '@/content/notes';
import { hero, person, siteUrl } from '@/content/site';
import { noteGraph, serializeJsonLd } from '@/utils/json-ld';
import { formatNoteDate, getNoteStats } from '@/utils/notes';

export const dynamicParams = false;

const slide = { 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' } as const;

export function generateStaticParams() {
  return allNotes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: PageProps<'/notes/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);

  if (!note) return {};

  return {
    title: note.title,
    description: note.description,
    keywords: note.keywords,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: {
      type: 'article',
      siteName: person.name,
      title: note.title,
      description: note.description,
      url: `/notes/${note.slug}`,
      publishedTime: note.published,
      modifiedTime: note.updated,
      authors: [siteUrl],
      section: note.topic,
      tags: note.keywords,
    },
  };
}

export default async function NotePage({ params }: PageProps<'/notes/[slug]'>) {
  const { slug } = await params;
  const note = getNote(slug);

  if (!note) notFound();

  const { default: Body } = await import(`@/content/notes/${slug}.mdx`);
  const { wordCount, minutes, headings } = getNoteStats(slug);
  const toc = [...headings, { id: 'questions', label: 'Questions' }, { id: 'sources', label: 'Sources' }];

  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(noteGraph(note, { wordCount, minutes })) }}
        />
        <article id="note">
          <div aria-hidden="true" className="reading-progress" />
          <Container className="pt-28 md:pt-36">
            <Link
              href="/notes"
              transitionTypes={['nav-back']}
              className="group/back text-ink-muted hover:text-ink inline-flex items-center gap-1.5 py-1 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="ease-out-strong size-4 transition-transform duration-150 [@media(hover:hover)]:group-hover/back:-translate-x-0.5" />
              All notes
            </Link>

            <header className="mt-5">
              <p className="type-eyebrow text-accent">{note.topic}</p>
              <h1 className="type-display-2 text-ink mt-4 max-w-[20ch]">{note.title}</h1>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <p className="text-ink-muted text-[0.9375rem]">
                  By{' '}
                  <Link href="/" rel="author" className="text-ink font-medium">
                    {person.name}
                  </Link>{' '}
                  &middot; <time dateTime={note.published}>{formatNoteDate(note.published)}</time> &middot;{' '}
                  <span className="font-mono">{minutes}</span> min read
                </p>
                <NoteShare url={`${siteUrl}/notes/${note.slug}`} title={note.title} />
              </div>
            </header>

            <div className="img-outline bg-surface relative mt-5 aspect-[16/9] overflow-hidden rounded-2xl md:aspect-[3/1]">
              <Image
                src={note.cover.src}
                alt={note.cover.alt}
                fill
                sizes="(min-width: 1040px) 1040px, 100vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="mt-8 lg:mt-10 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-14">
              <CaseToc
                items={toc}
                footer={<ReadingLeft minutes={minutes} target="note-body" />}
                className="self-start"
              />

              <div className="mt-8 min-w-0 lg:mt-0">
                <aside className="border-accent/25 bg-accent-soft max-w-[40rem] rounded-2xl border p-5 md:p-6">
                  <h2 className="type-eyebrow text-accent">The short answer</h2>
                  <p className="text-ink mt-3 text-lg leading-snug font-medium tracking-[-0.035em] md:text-xl">
                    {note.shortAnswer}
                  </p>
                </aside>

                <div id="note-body" className="mt-8">
                  <Body />
                </div>

                <div className="border-rule mt-12 flex flex-wrap items-start justify-between gap-6 border-t pt-8">
                  <NoteVotes slug={note.slug} />
                  <div className="flex flex-col gap-3">
                    <p className="type-h3 text-ink">Share it</p>
                    <NoteShare url={`${siteUrl}/notes/${note.slug}`} title={note.title} />
                  </div>
                </div>

                <section id="questions" aria-labelledby="questions-heading" className="mt-14">
                  <h2 id="questions-heading" className="type-h2 text-ink">
                    Questions
                  </h2>
                  <div className="mt-6 flex flex-col gap-2">
                    {note.faq.map((item) => (
                      <details key={item.question} className="faq-item border-rule bg-surface group rounded-xl border">
                        <summary className="text-ink flex cursor-pointer list-none items-center justify-between gap-4 p-4 [&::-webkit-details-marker]:hidden">
                          <h3 className="type-h3 text-lg">{item.question}</h3>
                          <span
                            aria-hidden="true"
                            className="text-accent text-xl leading-none transition-transform duration-150 group-open:rotate-45 motion-reduce:transition-none"
                          >
                            +
                          </span>
                        </summary>
                        <p className="text-ink-muted px-4 pb-4 leading-snug">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>

                <section id="sources" aria-labelledby="sources-heading" className="mt-14">
                  <h2 id="sources-heading" className="type-h2 text-ink">
                    Sources
                  </h2>
                  <ul className="mt-5 flex flex-col gap-2.5 text-[0.9375rem] leading-snug">
                    {note.sources.map((source) => (
                      <li key={source.href} className="text-ink-muted">
                        <a
                          href={source.href}
                          target="_blank"
                          rel="noopener"
                          className="text-ink decoration-accent/50 hover:decoration-accent underline decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-150"
                        >
                          {source.label}
                        </a>
                        , {source.publisher}
                      </li>
                    ))}
                  </ul>
                  <p className="text-ink-muted mt-5 text-[0.9375rem]">
                    Last checked <time dateTime={note.updated}>{formatNoteDate(note.updated)}</time>.
                  </p>
                </section>

                <footer className="border-rule bg-surface mt-14 flex flex-col gap-4 rounded-2xl border p-5 md:p-6">
                  <div>
                    <p className="type-h3 text-ink">Written by {person.name}</p>
                    <p className="text-ink-muted mt-2 max-w-[56ch]">{hero.subline}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button href={`mailto:${person.email}`} size="sm">
                      Email me
                      <EmailIcon className="size-3.5" />
                    </Button>
                    <Button href="/#work" size="sm" variant="secondary">
                      See my work
                    </Button>
                  </div>
                </footer>
              </div>
            </div>
          </Container>
        </article>
        <Contact />
      </main>
    </ViewTransition>
  );
}
