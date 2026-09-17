export const DEFAULT_MAIL_TO = "dillon@poorformsports.com";
/** Resend onboarding sender for Preview until a verified domain from-address is set. */
export const DEFAULT_MAIL_FROM = "Poor Form Desk <onboarding@resend.dev>";
export const MAIL_SUBJECT = "Mail the Desk";

export const MAIL_LIMITS = {
  name: 120,
  email: 254,
  message: 4_000,
  page: 200,
} as const;

export const MAIL_RATE_LIMIT = {
  windowMs: 10 * 60 * 1_000,
  max: 5,
} as const;

export function mailConfig(env: Record<string, string | undefined> = process.env) {
  const apiKey = env.RESEND_API_KEY?.trim();
  return {
    apiKey: apiKey || undefined,
    to: env.MAIL_TO?.trim() || DEFAULT_MAIL_TO,
    from: env.MAIL_FROM?.trim() || DEFAULT_MAIL_FROM,
  };
}
