"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { REVIEW_COOKIE, REVIEW_PASSWORD } from "@/lib/review-gate";

export async function unlockReview(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  if (password !== REVIEW_PASSWORD) {
    return { error: "Wrong desk phrase. Try the pilot gate listed in the README." };
  }

  const store = await cookies();
  store.set(REVIEW_COOKIE, "unlocked", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/review");
}

export async function lockReview() {
  const store = await cookies();
  store.delete(REVIEW_COOKIE);
  redirect("/review");
}
