"use client";

import { usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function DeskMailForm() {
  const pathname = usePathname() ?? "/";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, page: pathname }),
      });
      const result: unknown = await response.json().catch(() => null);
      const messageFromApi =
        result && typeof result === "object" && "error" in result && typeof result.error === "string"
          ? result.error
          : null;

      if (!response.ok) {
        setStatus("error");
        setError(messageFromApi || "The Desk could not take that note. Try again.");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("The Desk could not take that note. Try again.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 border border-border bg-card-loud p-4 sm:p-5">
      <input type="hidden" name="page" value={pathname} />
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
          maxLength={4000}
          rows={6}
          className="block w-full resize-y border border-border bg-paper px-3 py-2 text-ink"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="border border-bar bg-bar px-4 py-2 font-mono text-xs tracking-wide text-bar-foreground uppercase hover:bg-masthead disabled:opacity-60"
      >
        {status === "sending" ? "Sending" : "Send to the Desk"}
      </button>
      {status === "sent" ? (
        <p role="status" className="text-sm text-ink-soft">
          The Desk has the note. It will be read as satire, not a support ticket.
        </p>
      ) : null}
      {status === "error" && error ? (
        <p role="alert" className="text-sm text-masthead">
          {error}
        </p>
      ) : null}
    </form>
  );
}
