import { createHash } from 'node:crypto';

import { neon } from '@neondatabase/serverless';

export type VoteValue = -1 | 0 | 1;

/** Writes one network can make in an hour. Clearing the cookie gets a new vote, this limits how many. */
const HOURLY_LIMIT = 30;

const db = () => (process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null);

export const votesAvailable = () => Boolean(process.env.DATABASE_URL);

/** Salted with the database URL, so the stored value can't be turned back into an address. */
export const hashIp = (ip: string) => createHash('sha256').update(`${process.env.DATABASE_URL}:${ip}`).digest('hex');

export async function getTally(slug: string, voter: string | null) {
  const sql = db();

  if (!sql) throw new Error('DATABASE_URL is not set');

  const [row] = await sql`
    select
      count(*) filter (where value = 1)::int as up,
      count(*) filter (where value = -1)::int as down,
      coalesce(max(value) filter (where voter_id = ${voter}::uuid), 0)::int as mine
    from note_votes
    where slug = ${slug}
  `;

  return row as { up: number; down: number; mine: VoteValue };
}

/** False when this network has hit the hourly limit. */
export async function setVote(slug: string, voter: string, value: VoteValue, ipHash: string) {
  const sql = db();

  if (!sql) throw new Error('DATABASE_URL is not set');

  if (value === 0) {
    await sql`delete from note_votes where slug = ${slug} and voter_id = ${voter}::uuid`;

    return true;
  }

  const [{ recent }] = await sql`
    select count(*)::int as recent
    from note_votes
    where ip_hash = ${ipHash} and updated_at > now() - interval '1 hour'
  `;

  if (recent >= HOURLY_LIMIT) return false;

  await sql`
    insert into note_votes (slug, voter_id, value, ip_hash)
    values (${slug}, ${voter}::uuid, ${value}, ${ipHash})
    on conflict (slug, voter_id)
    do update set value = excluded.value, ip_hash = excluded.ip_hash, updated_at = now()
  `;

  return true;
}
