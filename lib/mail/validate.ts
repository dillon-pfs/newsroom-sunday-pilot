import { MAIL_LIMITS } from "./config.ts";

export type DeskMailInput = {
  name: string;
  email: string;
  message: string;
  page: string;
};

export type MailValidation =
  | { ok: true; value: DeskMailInput }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function oneLine(value: string): string {
  return value.replace(/[\r\n\u0000]/g, " ").replace(/\s+/g, " ").trim();
}

function keepMessage(value: string): string {
  return value.replace(/\u0000/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function asPath(value: string): string {
  const cleaned = oneLine(value);
  if (!cleaned) return "/";
  if (cleaned.startsWith("/") && !cleaned.startsWith("//")) return cleaned.slice(0, MAIL_LIMITS.page);
  return "/";
}

export function validateDeskMail(input: unknown): MailValidation {
  if (!input || typeof input !== "object") return { ok: false, error: "Send a name, email, and message." };

  const raw = input as Record<string, unknown>;
  const name = oneLine(readString(raw.name));
  const email = oneLine(readString(raw.email)).toLowerCase();
  const message = keepMessage(readString(raw.message));
  const page = asPath(readString(raw.page));

  if (!name) return { ok: false, error: "Name is required." };
  if (name.length > MAIL_LIMITS.name) return { ok: false, error: `Name must be ${MAIL_LIMITS.name} characters or fewer.` };

  if (!email) return { ok: false, error: "Email is required." };
  if (email.length > MAIL_LIMITS.email || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Enter a working email so the Desk can reply." };
  }

  if (!message) return { ok: false, error: "Write a message for the Desk." };
  if (message.length > MAIL_LIMITS.message) {
    return { ok: false, error: `Message must be ${MAIL_LIMITS.message} characters or fewer.` };
  }

  return { ok: true, value: { name, email, message, page } };
}
