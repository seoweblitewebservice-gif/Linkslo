/**
 * Tiny in-memory IP rate limiter for public POST APIs.
 *
 * This is per-process memory (fine for a single Node instance; use a shared
 * store such as Redis if the app ever runs behind multiple instances).
 */

type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

/** Returns true when the key has exceeded `limit` hits within `windowMs`. */
export function isRateLimited(key: string, limit: number, windowMs = 60_000): boolean {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now > current.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    // Opportunistic cleanup so the map cannot grow without bound.
    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) {
        if (v.reset <= now) buckets.delete(k);
      }
    }
    return false;
  }
  current.count += 1;
  return current.count > limit;
}

/** Best-effort client IP for rate-limit keys (respects common proxy headers). */
export function requestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
