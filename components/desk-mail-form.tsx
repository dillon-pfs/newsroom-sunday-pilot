"use client";

import { usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";

type Status =
  | { type: "idle" }
  | { type: "pending" }
  | { type: "success" }
  | { type: "error"; message: string };

export function DeskMailForm() {
  const pathname = usePathname() ?? "/";
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "");

    if (!name || !email || !message) {
      setStatus({ type: "error", message: "Name, email, and message are required." });
      return;
    }

    setStatus({ type: "pending" });
    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, page: pathname, website }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (!response.ok) {
        setStatus({
          type: "error",
          message: payload?.error ?? "The Desk could not take that note. Try again in a minute.",
        });
        return;
      }
      form.reset();
      setStatus({ type: "success" });
    } catch {
      setStatus({
        type: "error",
        message: "The Desk could not take that note. Try again in a minute.",
      });
    }
  }

  const pending = status.type === "pending";

  return (
    <form onSubmit={onSubmit} className="relative space-y-4 border border-border bg-card-loud p-4 sm:p-5">
      <p className="sr-only" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium">
          Name
          <input
            name="name"
            required
            maxLength={120}
            className="block w-full border border-border bg-paper px-3 py-2 text-ink"
            autoComplete="name"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            className="block w-full border border-border bg-paper px-3 py-2 text-ink"
            autoComplete="email"
          />
        </label>
      </div>
      <label className="block space-y-1.5 text-sm font-medium">
        Message
        <textarea
          name="message"
          required
          rows={6}
          maxLength={5000}
          className="block w-full resize-y border border-border bg-paper px-3 py-2 text-ink"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="border border-bar bg-bar px-4 py-2 font-mono text-xs tracking-wide text-bar-foreground uppercase hover:bg-masthead disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send to the Desk"}
      </button>
      {status.type === "success" ? (
        <p role="status" className="text-sm text-ink-soft">
          The Desk has your note. It will be read as satire, not a support ticket.
        </p>
      ) : null}
      {status.type === "error" ? (
        <p role="alert" className="text-sm text-destructive">
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
