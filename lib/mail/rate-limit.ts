import { MAIL_RATE_LIMIT } from "./config.ts";

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

type Bucket = number[];

export function createMemoryRateLimit(windowMs: number = MAIL_RATE_LIMIT.windowMs, max: number = MAIL_RATE_LIMIT.max) {
  const hits = new Map<string, Bucket>();

  return {
    take(key: string, now = Date.now()): RateLimitResult {
      const cutoff = now - windowMs;
      const recent = (hits.get(key) ?? []).filter(at => at > cutoff);
      if (recent.length >= max) {
        const retryAfterSec = Math.max(1, Math.ceil((recent[0]! + windowMs - now) / 1_000));
        hits.set(key, recent);
        return { ok: false, retryAfterSec };
      }
      recent.push(now);
      hits.set(key, recent);
      return { ok: true };
    },
  };
}

export const mailRateLimit = createMemoryRateLimit();

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim();
  return ip || "unknown";
}
