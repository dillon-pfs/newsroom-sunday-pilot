import { Resend } from "resend";
import { composeDeskMail, type DeskMailLetter } from "./compose.ts";
import { mailConfig } from "./config.ts";
import { mailRateLimit, type RateLimitResult } from "./rate-limit.ts";
import { validateDeskMail } from "./validate.ts";

export type MailSendResult = { ok: true } | { ok: false; error: string };

export type MailSender = (letter: DeskMailLetter) => Promise<MailSendResult>;

export type MailHandlerResult = {
  status: number;
  body: { ok: true } | { error: string };
  headers?: Record<string, string>;
};

export function createResendSender(apiKey: string): MailSender {
  const resend = new Resend(apiKey);
  return async (letter) => {
    try {
      const { error } = await resend.emails.send({
        from: letter.from,
        to: letter.to,
        subject: letter.subject,
        text: letter.text,
        replyTo: letter.replyTo,
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Send failed" };
    }
  };
}

export async function handleDeskMail(options: {
  payload: unknown;
  clientKey: string;
  env?: Record<string, string | undefined>;
  now?: number;
  take?: (key: string, now?: number) => RateLimitResult;
  send?: MailSender;
}): Promise<MailHandlerResult> {
  const env = options.env ?? process.env;
  const now = options.now ?? Date.now();
  const take = options.take ?? mailRateLimit.take;
  const limited = take(options.clientKey, now);
  if (!limited.ok) {
    return {
      status: 429,
      body: { error: "Too many notes from this desk. Try again in a few minutes." },
      headers: { "Retry-After": String(limited.retryAfterSec) },
    };
  }

  const parsed = validateDeskMail(options.payload);
  if (!parsed.ok) return { status: 400, body: { error: parsed.error } };

  const config = mailConfig(env);
  if (!config.apiKey && !options.send) {
    return { status: 503, body: { error: "The desk inbox is not wired on this deployment yet." } };
  }

  const letter = composeDeskMail(parsed.value, env);
  const send = options.send ?? createResendSender(config.apiKey!);
  const sent = await send(letter);
  if (!sent.ok) return { status: 502, body: { error: "The Desk could not take that note. Try again." } };
  return { status: 200, body: { ok: true } };
}
