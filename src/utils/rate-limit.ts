/**
 * Fixed-window counter, kept in memory. Per server instance: on a serverless host each warm instance has its own
 * counts, so this is a speed bump, not a guarantee. Swap the Map for Upstash or Vercel KV if it ever needs to be strict.
 */
interface Entry {
  count: number;
  start: number;
}

const store = new Map<string, Entry>();
const MAX_KEYS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets. */
  retryAfter: number;
}

/** Counts one hit for `key`. Refuses (and does not count) once `limit` hits happened inside `windowMs`. */
export function hit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  if (store.size > MAX_KEYS) {
    for (const [name, entry] of store) if (now - entry.start >= windowMs) store.delete(name);
  }

  const current = store.get(key);
  const entry = current && now - current.start < windowMs ? current : { count: 0, start: now };
  const retryAfter = Math.ceil((entry.start + windowMs - now) / 1000);

  if (entry.count >= limit) return { allowed: false, retryAfter };

  store.set(key, { count: entry.count + 1, start: entry.start });

  return { allowed: true, retryAfter };
}
