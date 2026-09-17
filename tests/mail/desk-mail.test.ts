import assert from "node:assert/strict";
import test from "node:test";
import { composeDeskMail } from "../../lib/mail/compose.ts";
import { DEFAULT_MAIL_FROM, DEFAULT_MAIL_TO, MAIL_LIMITS, MAIL_SUBJECT } from "../../lib/mail/config.ts";
import { createMemoryRateLimit } from "../../lib/mail/rate-limit.ts";
import { handleDeskMail, type MailSender } from "../../lib/mail/service.ts";
import { validateDeskMail } from "../../lib/mail/validate.ts";

const valid = {
  name: "Chip Absolute",
  email: "chip@example.com",
  message: "The lower-third called it a moral victory.",
  page: "/mail",
};

test("rejects empty name, email, and message", () => {
  assert.equal(validateDeskMail({ ...valid, name: "  " }).ok, false);
  assert.equal(validateDeskMail({ ...valid, email: "" }).ok, false);
  assert.equal(validateDeskMail({ ...valid, message: "\n" }).ok, false);
});

test("rejects implausible email and overlong fields", () => {
  assert.equal(validateDeskMail({ ...valid, email: "not-an-email" }).ok, false);
  assert.equal(validateDeskMail({ ...valid, email: "missing-domain@" }).ok, false);
  assert.equal(validateDeskMail({ ...valid, name: "A".repeat(MAIL_LIMITS.name + 1) }).ok, false);
  assert.equal(validateDeskMail({ ...valid, message: "m".repeat(MAIL_LIMITS.message + 1) }).ok, false);
});

test("accepts a trimmed desk note and keeps a safe page path", () => {
  const parsed = validateDeskMail({
    name: "  Wes Process  ",
    email: "Wes@PoorFormSports.com",
    message: "  The math was fine.  ",
    page: "https://evil.example/mail",
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.value.name, "Wes Process");
  assert.equal(parsed.value.email, "wes@poorformsports.com");
  assert.equal(parsed.value.message, "The math was fine.");
  assert.equal(parsed.value.page, "/");
});

test("compose includes name, reply-to, page path, and the note", () => {
  const letter = composeDeskMail(valid, {});
  assert.equal(letter.to, DEFAULT_MAIL_TO);
  assert.equal(letter.from, DEFAULT_MAIL_FROM);
  assert.equal(letter.subject, MAIL_SUBJECT);
  assert.equal(letter.replyTo, valid.email);
  assert.match(letter.text, /From: Chip Absolute/);
  assert.match(letter.text, /Reply-to: chip@example.com/);
  assert.match(letter.text, /Page: \/mail/);
  assert.match(letter.text, /lower-third/);
});

test("compose honors MAIL_TO and MAIL_FROM", () => {
  const letter = composeDeskMail(valid, {
    MAIL_TO: "desk@poorformsports.com",
    MAIL_FROM: "Desk <desk@poorformsports.com>",
  });
  assert.equal(letter.to, "desk@poorformsports.com");
  assert.equal(letter.from, "Desk <desk@poorformsports.com>");
});

test("in-memory limiter trips after the window max", () => {
  const limiter = createMemoryRateLimit(60_000, 2);
  assert.equal(limiter.take("1.1.1.1", 1_000).ok, true);
  assert.equal(limiter.take("1.1.1.1", 2_000).ok, true);
  const blocked = limiter.take("1.1.1.1", 3_000);
  assert.equal(blocked.ok, false);
  if (blocked.ok) return;
  assert.ok(blocked.retryAfterSec >= 1);
  assert.equal(limiter.take("2.2.2.2", 3_000).ok, true);
});

test("handler validates, rate-limits, and sends with reply-to", async () => {
  const sent: Parameters<MailSender>[0][] = [];
  const send: MailSender = async (letter) => {
    sent.push(letter);
    return { ok: true };
  };
  const limiter = createMemoryRateLimit(60_000, 5);

  const ok = await handleDeskMail({
    payload: valid,
    clientKey: "10.0.0.1",
    env: { RESEND_API_KEY: "re_test", MAIL_FROM: "Desk <desk@poorformsports.com>" },
    take: limiter.take,
    send,
  });
  assert.equal(ok.status, 200);
  assert.deepEqual(ok.body, { ok: true });
  assert.equal(sent[0]?.replyTo, valid.email);
  assert.equal(sent[0]?.from, "Desk <desk@poorformsports.com>");
  assert.equal(sent[0]?.to, DEFAULT_MAIL_TO);
  assert.equal(sent[0]?.subject, MAIL_SUBJECT);

  const bad = await handleDeskMail({
    payload: { ...valid, email: "nope" },
    clientKey: "10.0.0.1",
    env: { RESEND_API_KEY: "re_test" },
    take: limiter.take,
    send,
  });
  assert.equal(bad.status, 400);
  assert.equal(sent.length, 1);

  const unwired = await handleDeskMail({
    payload: valid,
    clientKey: "10.0.0.2",
    env: {},
    take: limiter.take,
  });
  assert.equal(unwired.status, 503);
});

test("handler returns 502 when Resend rejects the send", async () => {
  const limiter = createMemoryRateLimit(60_000, 5);
  const failed = await handleDeskMail({
    payload: valid,
    clientKey: "8.8.8.8",
    env: { RESEND_API_KEY: "re_test" },
    take: limiter.take,
    send: async () => ({ ok: false, error: "resend down" }),
  });
  assert.equal(failed.status, 502);
});

test("handler returns 429 after too many notes from one client", async () => {
  const limiter = createMemoryRateLimit(60_000, 1);
  const send: MailSender = async () => ({ ok: true });
  await handleDeskMail({
    payload: valid,
    clientKey: "9.9.9.9",
    env: { RESEND_API_KEY: "re_test" },
    take: limiter.take,
    send,
  });
  const blocked = await handleDeskMail({
    payload: valid,
    clientKey: "9.9.9.9",
    env: { RESEND_API_KEY: "re_test" },
    take: limiter.take,
    send,
  });
  assert.equal(blocked.status, 429);
  assert.ok(blocked.headers?.["Retry-After"]);
});
