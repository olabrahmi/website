import { randomUUID } from 'node:crypto';

import { NextResponse, type NextRequest } from 'next/server';

import { getNote } from '@/content/notes';
import { getTally, hashIp, setVote, votesAvailable, type VoteValue } from '@/utils/votes';

const COOKIE = 'note_voter';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const noStore = { 'Cache-Control': 'no-store' };

type Context = RouteContext<'/api/notes/[slug]/votes'>;

const fail = (status: number, error: string) => NextResponse.json({ error }, { status, headers: noStore });

const voterFrom = (request: NextRequest) => {
  const value = request.cookies.get(COOKIE)?.value;

  return value && UUID.test(value) ? value : null;
};

export async function GET(request: NextRequest, { params }: Context) {
  const { slug } = await params;

  if (!getNote(slug)) return fail(404, 'Unknown note');
  if (!votesAvailable()) return fail(503, 'Votes are not available');

  try {
    return NextResponse.json(await getTally(slug, voterFrom(request)), { headers: noStore });
  } catch (error) {
    console.error('[votes] read failed', error);

    return fail(503, 'Votes are not available');
  }
}

export async function POST(request: NextRequest, { params }: Context) {
  const { slug } = await params;
  const origin = request.headers.get('origin');

  if (!getNote(slug)) return fail(404, 'Unknown note');
  if (!votesAvailable()) return fail(503, 'Votes are not available');
  if (!origin || !URL.canParse(origin) || new URL(origin).host !== request.headers.get('host')) {
    return fail(403, 'Wrong origin');
  }

  const body: unknown = await request.json().catch(() => null);
  const value = (body as { value?: unknown } | null)?.value;

  if (value !== 1 && value !== -1 && value !== 0) return fail(400, 'Vote must be 1, -1 or 0');

  const existing = voterFrom(request);
  const voter = existing ?? randomUUID();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  try {
    const saved = await setVote(slug, voter, value as VoteValue, hashIp(ip));

    if (!saved) return fail(429, 'Too many votes');

    const response = NextResponse.json(await getTally(slug, voter), { headers: noStore });

    if (!existing) {
      response.cookies.set(COOKIE, voter, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/api/notes',
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return response;
  } catch (error) {
    console.error('[votes] write failed', error);

    return fail(503, 'Votes are not available');
  }
}
