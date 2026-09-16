"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

export function DeskMailForm() {
  const pathname = usePathname() ?? "/";
  const [sent, setSent] = useState(false);

  function submit(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const body = [
      `From: ${name || "Anonymous desk reader"}`,
      email ? `Reply-to: ${email}` : "Reply-to: not supplied",
      `Page: ${pathname}`,
      "",
      message,
    ].join("\n");
    window.location.href = `mailto:desk@poorformsports.com?subject=${encodeURIComponent("Mail the Desk")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form action={submit} className="space-y-4 border border-border bg-card-loud p-4 sm:p-5">
      <input type="hidden" name="page" value={pathname} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium">
          Name <span className="font-normal text-ink-soft">optional</span>
          <input name="name" className="block w-full border border-border bg-paper px-3 py-2 text-ink" autoComplete="name" />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          Email <span className="font-normal text-ink-soft">optional</span>
          <input name="email" type="email" className="block w-full border border-border bg-paper px-3 py-2 text-ink" autoComplete="email" />
        </label>
      </div>
      <label className="block space-y-1.5 text-sm font-medium">
        Message
        <textarea name="message" required rows={6} className="block w-full resize-y border border-border bg-paper px-3 py-2 text-ink" />
      </label>
      <button type="submit" className="border border-bar bg-bar px-4 py-2 font-mono text-xs tracking-wide text-bar-foreground uppercase hover:bg-masthead">
        Send by email
      </button>
      {sent ? (
        <p role="status" className="text-sm text-ink-soft">
          Your mail app should be open. The Desk will read it as satire, not a support ticket.
        </p>
      ) : null}
    </form>
  );
}
