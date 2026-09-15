import { getScoreboard } from "@/lib/nfl/scoreboard-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  const scoreboard = await getScoreboard();
  const unavailable = scoreboard.availability === "unavailable";
  return Response.json(scoreboard, {
    status: unavailable ? 503 : 200,
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Vercel-CDN-Cache-Control": unavailable ? "no-store" : "public, s-maxage=5",
      ...(unavailable ? { "Retry-After": "15" } : {}),
    },
  });
}
