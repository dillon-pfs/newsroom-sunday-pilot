# Mail the Desk

`/mail` is an on-site form. Submissions stay in the browser and `POST /api/mail` emails them through Resend. The visitor's mail app is never opened.

## Environment

Copy `.env.example` to `.env.local` for local work. Never commit secrets or put these on `NEXT_PUBLIC_`.

| Variable | Purpose | Required |
| --- | --- | --- |
| `RESEND_API_KEY` | Server-only Resend API key | Yes, to deliver mail |
| `MAIL_TO` | Inbox that receives notes | No. Default: `dillon@poorformsports.com` |
| `MAIL_FROM` | Verified Resend from-address | No. Default: `Poor Form Desk <onboarding@resend.dev>` |

Resend will not send from an unverified domain. Preview can use Resend's onboarding sender (`onboarding@resend.dev`) until `poorformsports.com` is verified. After verification, set for example:

```bash
MAIL_FROM=Desk <desk@poorformsports.com>
```

## Vercel Preview (do not change Production)

In the Vercel project → Settings → Environment Variables, add the three keys for **Preview** only. Leave Production, Redis NFL scoreboard variables, and unrelated deploy settings alone.

1. Create a Resend API key at [resend.com/api-keys](https://resend.com/api-keys).
2. Set `RESEND_API_KEY` as a sensitive Preview variable.
3. Optionally set `MAIL_TO=dillon@poorformsports.com`.
4. For Preview without a verified domain, set `MAIL_FROM=Poor Form Desk <onboarding@resend.dev>`. Resend's onboarding sender only delivers to the Resend account inbox.
5. To send from `desk@poorformsports.com`, add and verify the domain at [resend.com/domains](https://resend.com/domains), then set `MAIL_FROM=Desk <desk@poorformsports.com>` on Preview.
6. Redeploy the Preview deployment after saving env vars so the route can read them.

A deployment without `RESEND_API_KEY` still shows the form. Submit returns a clear “inbox is not wired” error instead of opening mailto.

## Manual check on Preview

After Preview env is set:

1. Open `/mail`. Confirm the form asks for name, email, and message. Submitting must not open a mail client.
2. Send a short note. Expect the on-site success line and an email at `MAIL_TO` with subject `Mail the Desk`.
3. Reply from that inbox. The reply should go to the address typed in the form.
4. Confirm the body includes name, reply-to email, the page path (`/mail`), and the message.
5. Submit a bad email or empty message and confirm the form stays on the page with an error.
