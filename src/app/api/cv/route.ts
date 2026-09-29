import fs from 'node:fs/promises';
import path from 'node:path';

import { NextResponse, type NextRequest } from 'next/server';

import { hit } from '@/utils/rate-limit';

export const dynamic = 'force-dynamic';

const LIMIT = 5;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const COOKIE = 'cv_dl';
const FILE = path.join(process.cwd(), 'private', 'cv', 'oussama-labrahmi-cv.pdf');

/**
 * The CV lives in private/, not public/, so this route is the only way to get it and every download is counted:
 * 5 per 24 hours per visitor.
 *
 *   request ──▶ cookie count ─┐
 *                             ├─ both under the limit? ─▶ PDF (and the cookie count goes up)
 *   request ──▶ IP count ─────┘          no ─▶ 429 + Retry-After
 *
 * The cookie catches the ordinary visitor exactly. The IP count (in memory, see rate-limit.ts) catches someone who
 * clears cookies, as long as the same server instance answers.
 */
export async function GET(request: NextRequest) {
  const now = Date.now();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';

  const [rawCount = '0', rawStart = '0'] = (request.cookies.get(COOKIE)?.value ?? '').split('.');
  const fresh = now - Number(rawStart) >= WINDOW_MS || Number.isNaN(Number(rawStart));
  const count = fresh ? 0 : Number(rawCount) || 0;
  const start = fresh ? now : Number(rawStart);
  const cookieRetry = Math.ceil((start + WINDOW_MS - now) / 1000);

  if (count >= LIMIT) return limitReached(cookieRetry);

  const ipResult = hit(`cv:${ip}`, LIMIT, WINDOW_MS, now);

  if (!ipResult.allowed) return limitReached(ipResult.retryAfter);

  let file: Buffer;

  try {
    file = await fs.readFile(FILE);
  } catch {
    return new NextResponse('CV not available.', { status: 404 });
  }

  const response = new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="oussama-labrahmi-cv.pdf"',
      'Cache-Control': 'private, no-store',
    },
  });

  response.cookies.set(COOKIE, `${count + 1}.${start}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.max(1, Math.ceil((start + WINDOW_MS - now) / 1000)),
  });

  return response;
}

function limitReached(retryAfter: number) {
  return new NextResponse('Download limit reached. Email me and I will send it.', {
    status: 429,
    headers: { 'Retry-After': String(retryAfter), 'Cache-Control': 'no-store' },
  });
}
