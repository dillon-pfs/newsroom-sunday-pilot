export const MAIL_SUBJECT = "Mail the Desk";
export const DEFAULT_MAIL_TO = "dillon@poorformsports.com";

export const MAIL_LIMITS = {
  name: 120,
  email: 254,
  message: 5000,
  page: 200,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type MailFields = {
  name: string;
  email: string;
  message: string;
  page: string;
};

export type ParsedMail =
  | { ok: true; dropped: true }
  | { ok: true; dropped: false; fields: MailFields }
  | { ok: false; error: string };

export type MailConfig =
  | { ok: true; apiKey: string; to: string; from: string }
  | { ok: false; error: string };

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

function asRecord(input: unknown): Record<string, unknown> {
  return input !== null && typeof input === "object" && !Array.isArray(input)
    ? (input as Record<string, unknown>)
    : {};
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hasLineBreak(value: string): boolean {
  return /[\r\n]/.test(value);
}

export function parseMailPayload(input: unknown): ParsedMail {
  const record = asRecord(input);
  const website = readString(record.website);
  if (website) {
    return { ok: true, dropped: true };
  }

  const name = readString(record.name);
  const email = readString(record.email);
  const message = readString(record.message);
  const page = readString(record.page);

  if (!name || !email || !message) {
    return { ok: false, error: "Name, email, and message are required." };
  }
  if (name.length > MAIL_LIMITS.name || hasLineBreak(name)) {
    return { ok: false, error: "Name is too long or invalid." };
  }
  if (
    email.length > MAIL_LIMITS.email ||
    hasLineBreak(email) ||
    !EMAIL_PATTERN.test(email)
  ) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (message.length > MAIL_LIMITS.message) {
    return { ok: false, error: "Message is too long." };
  }
  if (page.length > MAIL_LIMITS.page || hasLineBreak(page)) {
    return { ok: false, error: "Page is invalid." };
  }

  return { ok: true, dropped: false, fields: { name, email, message, page } };
}

export function buildMailText(fields: MailFields): string {
  return [
    `From: ${fields.name}`,
    `Reply-to: ${fields.email}`,
    `Page: ${fields.page || "/mail"}`,
    "",
    fields.message,
  ].join("\n");
}

export function getMailConfig(
  env: NodeJS.Dict<string> = process.env,
): MailConfig {
  const apiKey = env.RESEND_API_KEY?.trim() ?? "";
  const from = env.MAIL_FROM?.trim() ?? "";
  const to = env.MAIL_TO?.trim() || DEFAULT_MAIL_TO;

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not set." };
  }
  if (!from) {
    return { ok: false, error: "MAIL_FROM is not set." };
  }

  return { ok: true, apiKey, to, from };
}

export function createRateLimiter(options: { windowMs: number; max: number }) {
  const hits = new Map<string, number[]>();

  return {
    check(key: string, now = Date.now()): RateLimitResult {
      const windowStart = now - options.windowMs;
      const prior = (hits.get(key) ?? []).filter((stamp) => stamp > windowStart);
      if (prior.length >= options.max) {
        const retryAfterSec = Math.max(
          1,
          Math.ceil((prior[0]! + options.windowMs - now) / 1000),
        );
        hits.set(key, prior);
        return { ok: false, retryAfterSec };
      }
      prior.push(now);
      hits.set(key, prior);
      return { ok: true };
    },
    reset() {
      hits.clear();
    },
  };
}

export const mailRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
