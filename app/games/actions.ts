"use server";

import { redirect } from "next/navigation";

export async function setPublicWire(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("next") ?? "live");
  if (!id) {
    redirect("/");
  }
  redirect(next === "delayed" ? `/games/${id}?wire=delayed` : `/games/${id}`);
}
