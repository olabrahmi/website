import { allNotes } from '@/content/notes';
import { person, siteUrl } from '@/content/site';

export const dynamic = 'force-static';

const escapeXml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const items = allNotes.map((note) => {
    const url = `${siteUrl}/notes/${note.slug}`;

    return `    <item>
      <title>${escapeXml(note.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(note.description)}</description>
      <pubDate>${new Date(`${note.published}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Notes by ${escapeXml(person.name)}</title>
    <link>${siteUrl}/notes</link>
    <description>Short notes on AI, software and the job market.</description>
    <language>en</language>
${items.join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
