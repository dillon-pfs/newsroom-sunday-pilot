import { Resend } from "resend";
import {
  MAIL_SUBJECT,
  buildMailText,
  clientKey,
  getMailConfig,
  mailRateLimit,
  parseMailPayload,
} from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERIC_ERROR = "The Desk could not take that note. Try again in a minute.";

export async function POST(request: Request) {
  const limited = mailRateLimit.check(clientKey(request));
  if (!limited.ok) {
    return Response.json(
      { error: "Too many notes from this desk. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  const parsed = parseMailPayload(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }
  if (parsed.dropped) {
    return Response.json({ ok: true });
  }

  const config = getMailConfig();
  if (!config.ok) {
    console.error("mail: missing config", config.error);
    return Response.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  try {
    const resend = new Resend(config.apiKey);
    const { error } = await resend.emails.send({
      from: config.from,
      to: config.to,
      replyTo: parsed.fields.email,
      subject: MAIL_SUBJECT,
      text: buildMailText(parsed.fields),
    });

    if (error) {
      console.error("mail: Resend error", error);
      return Response.json({ error: GENERIC_ERROR }, { status: 502 });
    }
  } catch (error) {
    console.error("mail: send failed", error);
    return Response.json({ error: GENERIC_ERROR }, { status: 502 });
  }

  return Response.json({ ok: true });
}
