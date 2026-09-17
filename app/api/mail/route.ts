import { handleDeskMail } from "@/lib/mail/service";
import { clientKey } from "@/lib/mail/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Send a name, email, and message." }, { status: 400 });
  }

  const result = await handleDeskMail({ payload, clientKey: clientKey(request) });
  return Response.json(result.body, { status: result.status, headers: result.headers });
}
