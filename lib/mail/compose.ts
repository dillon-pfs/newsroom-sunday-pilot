import { MAIL_SUBJECT, mailConfig } from "./config.ts";
import type { DeskMailInput } from "./validate.ts";

export type DeskMailLetter = {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo: string;
};

export function composeDeskMail(
  input: DeskMailInput,
  env: Record<string, string | undefined> = process.env,
): DeskMailLetter {
  const { to, from } = mailConfig(env);
  return {
    from,
    to,
    subject: MAIL_SUBJECT,
    replyTo: input.email,
    text: [
      `From: ${input.name}`,
      `Reply-to: ${input.email}`,
      `Page: ${input.page}`,
      "",
      input.message,
    ].join("\n"),
  };
}
