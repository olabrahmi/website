import fs from 'node:fs';
import path from 'node:path';

const WORDS_PER_MINUTE = 200;

export const slugifyHeading = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

/** Server only, build time. Word count, read time and table of contents, read from the MDX source. */
export function getNoteStats(slug: string) {
  const source = fs.readFileSync(path.join(process.cwd(), 'src/content/notes', `${slug}.mdx`), 'utf8');
  const prose = source.replace(/<[^>]*>/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const wordCount = prose.split(/\s+/).filter(Boolean).length;
  const headings = [...source.matchAll(/^## (.+)$/gm)].map((match) => ({
    id: slugifyHeading(match[1]),
    label: match[1],
  }));

  return { wordCount, minutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)), headings };
}

export const formatNoteDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
