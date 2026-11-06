import { getNote } from '@/content/notes';
import { ogSize, renderOg } from '@/utils/og';

export const alt = 'Note by Oussama Labrahmi';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNote(slug);

  return renderOg(note?.title ?? 'Notes', note ? `Note · ${note.topic}` : 'Notes');
}
