import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_MAIL_TO,
  MAIL_SUBJECT,
  buildMailText,
  clientKey,
  createRateLimiter,
  getMailConfig,
  parseMailPayload,
} from "../lib/mail.ts";

test("parseMailPayload requires name, email, and message", () => {
  assert.deepEqual(parseMailPayload({}), {
    ok: false,
    error: "Name, email, and message are required.",
  });
  assert.deepEqual(
    parseMailPayload({ name: "  Chip  ", email: "chip@example.com", message: "  hello  " }),
    {
      ok: true,
      dropped: false,
      fields: { name: "Chip", email: "chip@example.com", message: "hello", page: "" },
    },
  );
});

test("parseMailPayload rejects invalid email and header injection", () => {
  assert.equal(
    parseMailPayload({ name: "Chip", email: "not-an-email", message: "hello" }).ok,
    false,
  );
  assert.equal(
    parseMailPayload({ name: "Chip\nBcc: evil@example.com", email: "chip@example.com", message: "hello" }).ok,
    false,
  );
});

test("parseMailPayload silently drops honeypot submissions", () => {
  assert.deepEqual(
    parseMailPayload({
      name: "Bot",
      email: "bot@example.com",
      message: "spam",
      website: "https://spam.example",
    }),
    { ok: true, dropped: true },
  );
});

test("buildMailText keeps the desk subject context", () => {
  assert.equal(MAIL_SUBJECT, "Mail the Desk");
  assert.equal(
    buildMailText({
      name: "Chip Absolute",
      email: "chip@example.com",
      message: "The lower-third missed.",
      page: "/about",
    }),
    [
      "From: Chip Absolute",
      "Reply-to: chip@example.com",
      "Page: /about",
      "",
      "The lower-third missed.",
    ].join("\n"),
  );
});

test("getMailConfig defaults MAIL_TO and requires Resend settings", () => {
  assert.equal(DEFAULT_MAIL_TO, "dillon@poorformsports.com");
  assert.deepEqual(getMailConfig({}), { ok: false, error: "RESEND_API_KEY is not set." });
  assert.deepEqual(
    getMailConfig({ RESEND_API_KEY: "re_test", MAIL_FROM: "" }),
    { ok: false, error: "MAIL_FROM is not set." },
  );
  assert.deepEqual(
    getMailConfig({
      RESEND_API_KEY: "re_test",
      MAIL_FROM: "Poor Form Desk <onboarding@resend.dev>",
    }),
    {
      ok: true,
      apiKey: "re_test",
      to: DEFAULT_MAIL_TO,
      from: "Poor Form Desk <onboarding@resend.dev>",
    },
  );
  const overridden = getMailConfig({
    RESEND_API_KEY: "re_test",
    MAIL_FROM: "Poor Form Desk <onboarding@resend.dev>",
    MAIL_TO: "desk@poorformsports.com",
  });
  assert.equal(overridden.ok, true);
  if (overridden.ok) {
    assert.equal(overridden.to, "desk@poorformsports.com");
  }
});

test("rate limiter allows a burst then asks the desk to wait", () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 2 });
  assert.equal(limiter.check("1.1.1.1", 1_000).ok, true);
  assert.equal(limiter.check("1.1.1.1", 2_000).ok, true);
  const blocked = limiter.check("1.1.1.1", 3_000);
  assert.equal(blocked.ok, false);
  if (!blocked.ok) {
    assert.equal(blocked.retryAfterSec, 58);
  }
  assert.equal(limiter.check("1.1.1.1", 61_001).ok, true);
});

test("clientKey prefers the first forwarded address", () => {
  const request = new Request("https://poorformsports.com/api/mail", {
    headers: {
      "x-forwarded-for": "203.0.113.9, 10.0.0.2",
      "x-real-ip": "10.0.0.2",
    },
  });
  assert.equal(clientKey(request), "203.0.113.9");
});
