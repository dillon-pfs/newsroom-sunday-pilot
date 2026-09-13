import { GateForm } from "@/app/review/gate-form";
import { ReplayDesk } from "@/app/review/replay-desk";
import { isReviewUnlocked } from "@/lib/review-gate";
import { clampCursor } from "@/lib/simulated/replay";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Desk review",
  robots: { index: false, follow: false },
};

export default async function ReviewPage({
  searchParams,
}: PageProps<"/review">) {
  const unlocked = await isReviewUnlocked();
  const query = await searchParams;
  const rawT = Array.isArray(query.t) ? query.t[0] : query.t;
  const initialMs = clampCursor(Number(rawT ?? 0));

  return unlocked ? <ReplayDesk initialMs={initialMs} /> : <GateForm />;
}
