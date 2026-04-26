import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

/**
 * Upstash rate limiting. Falls back to a no-op limiter if credentials
 * aren't set, so local dev without Upstash still works. Configure in prod
 * via UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 */

const enabled =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = enabled ? Redis.fromEnv() : null;

function makeLimiter(name: string, requests: number, window: Parameters<typeof Ratelimit.slidingWindow>[1]) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: `jolt:rl:${name}`,
  });
}

export const limiters = {
  /** General write endpoints (note/category/tag mutations). */
  writes:    makeLimiter('writes',    60, '1 m'),
  /** Export endpoint — expensive (zip generation). */
  export:    makeLimiter('export',     5, '1 h'),
  /** Magic-link send by email address. */
  magicMail: makeLimiter('magic-mail', 5, '1 h'),
  /** Magic-link send by IP. */
  magicIp:   makeLimiter('magic-ip',  20, '1 h'),
} as const;

export type LimiterKey = keyof typeof limiters;

export async function checkLimit(
  key: LimiterKey,
  identifier: string,
): Promise<NextResponse | null> {
  const limiter = limiters[key];
  if (!limiter) return null; // disabled → allow
  const { success, limit, remaining, reset } = await limiter.limit(identifier);
  if (success) return null;
  return NextResponse.json(
    { error: 'Too many requests. Slow down a sec.' },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit':     String(limit),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset':     String(reset),
        'Retry-After':           String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))),
      },
    },
  );
}

/** Pull a best-effort client IP from request headers. */
export function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    h.get('cf-connecting-ip') ||
    'unknown'
  );
}
