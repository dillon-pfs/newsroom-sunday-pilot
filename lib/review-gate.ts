import { cookies } from "next/headers";

export const REVIEW_COOKIE = "newsroom_review";
export const REVIEW_PASSWORD = process.env.REVIEW_PASSWORD ?? "desk";

export async function isReviewUnlocked(): Promise<boolean> {
  const store = await cookies();
  return store.get(REVIEW_COOKIE)?.value === "unlocked";
}
