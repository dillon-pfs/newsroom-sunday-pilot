import Link from "next/link";
import { DeskPill } from "@/components/desk-pill";
import {
  CALL_STATUS_LABEL,
  CALL_STATUS_TONE,
  tallyCalls,
  type Call,
  type CallStatus,
} from "@/lib/calls";

const tallyOrder: CallStatus[] = ["held-up", "missed", "still-arguing"];

export function CallsList({ calls }: { calls: Call[] }) {
  const tally = tallyCalls(calls);

  return (
    <div className="space-y-6">
      <section className="max-w-3xl space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          <Link href="/cast/chip-absolute" className="underline-offset-4 hover:underline">
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

      <ul
        aria-label="Call tally"
        className="grid grid-cols-3 gap-px border border-border bg-border"
      >
        {tallyOrder.map((status) => (
          <li key={status} className="bg-card px-2 py-3 sm:px-4">
            <p className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              {tally[status]}
            </p>
            <p className="mt-1 font-mono text-[10px] leading-tight tracking-wide text-ink-soft uppercase sm:text-[11px]">
              {CALL_STATUS_LABEL[status]}
            </p>
          </li>
        ))}
      </ul>

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
                    <DeskPill tone={CALL_STATUS_TONE[call.status]}>
                      {CALL_STATUS_LABEL[call.status]}
                    </DeskPill>
                  </div>
                  <p className="mt-2 font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
                    {call.game}
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight">
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
                    className="mt-3 inline-flex font-mono text-[11px] tracking-wide text-masthead uppercase underline-offset-4 hover:underline"
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
