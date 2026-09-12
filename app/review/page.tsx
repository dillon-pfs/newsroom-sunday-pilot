import { GateForm } from "@/app/review/gate-form";
import { ReplayDesk } from "@/app/review/replay-desk";
import { isReviewUnlocked } from "@/lib/review-gate";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Desk review",
  robots: { index: false, follow: false },
};

export default async function ReviewPage() {
  const unlocked = await isReviewUnlocked();

  return unlocked ? <ReplayDesk /> : <GateForm />;
}
