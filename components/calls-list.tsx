import Link from "next/link";
import { DeskPill } from "@/components/desk-pill";
import {
  CALL_STATUS_LABEL,
  CALL_STATUS_TONE,
  getCallRecord,
  type Call,
  type CallStatus,
  type CallStreak,
} from "@/lib/calls";

const tallyRows: Array<{ key: "hits" | "misses" | "pending"; status: CallStatus }> = [
  { key: "hits", status: "held-up" },
  { key: "misses", status: "missed" },
  { key: "pending", status: "still-arguing" },
];

function streakTone(streak: CallStreak): "live" | "warn" | "outline" {
  if (streak.kind === "hot") return "live";
  if (streak.kind === "cold") return "warn";
  return "outline";
}

function CallStatusTag({ status }: { status: CallStatus }) {
  return <DeskPill tone={CALL_STATUS_TONE[status]}>{CALL_STATUS_LABEL[status]}</DeskPill>;
}

function ChipRecord({ calls }: { calls: Call[] }) {
  const record = getCallRecord(calls);

  return (
    <section aria-label="Chip’s record" className="border border-border bg-card">
      <div className="border-l-[6px] border-masthead px-4 py-3 sm:px-5 sm:py-4">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          Chip’s record
        </p>
        <ul
          aria-label="Call tally"
          className="mt-3 grid grid-cols-3 gap-px border border-border bg-border"
        >
          {tallyRows.map((row) => (
            <li key={row.key} className="bg-card px-2 py-3 text-center sm:px-4">
              <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                {record.tally[row.key]}
              </p>
              <p className="mt-1 font-mono text-[10px] leading-tight tracking-wide text-ink-soft uppercase sm:text-[11px]">
                {CALL_STATUS_LABEL[row.status]}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          <DeskPill tone={streakTone(record.streak)} className="h-auto min-h-5 max-w-full py-1 text-left leading-4 whitespace-normal">
            {record.streak.label}
          </DeskPill>
        </p>
        {record.latest ? (
          <div className="mt-4 border-t border-border pt-3">
            <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
              Latest call
            </p>
            <div className="mt-2 bg-card-loud px-3 py-3 sm:px-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[11px] tracking-wide text-ink-soft uppercase">
                  <time dateTime={record.latest.date}>{record.latest.dateLabel}</time>
                  {record.latest.window ? ` · ${record.latest.window}` : ""}
                </p>
                <CallStatusTag status={record.latest.status} />
              </div>
              <p className="mt-2 font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
                {record.latest.game}
              </p>
              <p className="mt-1 font-heading text-xl font-semibold tracking-tight break-words sm:text-2xl">
                {record.latest.take}
              </p>
              <a
                href={record.latest.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center font-mono text-[11px] tracking-wide text-masthead uppercase underline-offset-4 hover:underline"
              >
                The X post
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function CallsList({ calls }: { calls: Call[] }) {
  return (
    <div className="space-y-6">
      <section className="max-w-3xl space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          <Link
            href="/cast/chip-absolute"
            className="relative inline-flex items-center underline-offset-4 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:underline"
          >
            Chip Absolute
          </Link>
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Chip’s calls
        </h1>
        <p className="text-sm leading-6 text-ink-soft sm:text-base">
          His takes, and how each one held up.
        </p>
        <p className="text-sm italic text-ink-soft">
          Fictional columnist. Football satire, not reporting.
        </p>
      </section>

      <ChipRecord calls={calls} />

      {calls.length === 0 ? (
        <p className="text-sm text-ink-soft">No calls filed.</p>
      ) : (
        <ul className="space-y-3">
          {calls.map((call) => (
            <li key={call.postUrl}>
              <article className="border border-border bg-card">
                <div className="border-l-[6px] border-masthead px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-[11px] tracking-wide text-ink-soft uppercase">
                      <time dateTime={call.date}>{call.dateLabel}</time>
                      {call.window ? ` · ${call.window}` : ""}
                    </p>
                    <CallStatusTag status={call.status} />
                  </div>
                  <p className="mt-2 font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
                    {call.game}
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight break-words">
                    {call.take}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-ink">
                    <span className="font-mono text-[11px] tracking-wide text-ink-soft uppercase">
                      Result
                    </span>
                    {" · "}
                    {call.result}
                  </p>
                  {call.note ? (
                    <p className="mt-2 text-sm leading-6 text-ink-soft italic">{call.note}</p>
                  ) : null}
                  <a
                    href={call.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-11 items-center font-mono text-[11px] tracking-wide text-masthead uppercase underline-offset-4 hover:underline"
                  >
                    The X post
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
