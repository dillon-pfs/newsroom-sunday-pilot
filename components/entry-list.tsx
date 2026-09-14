import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { kindLabel } from "@/lib/copy";
import { cn } from "@/lib/utils";
import type { FeedEntry } from "@/lib/types";

export function EntryList({
  entries,
  emptyTitle,
  emptyBody,
  simulated = false,
}: {
  entries: FeedEntry[];
  emptyTitle: string;
  emptyBody: string;
  simulated?: boolean;
}) {
  if (entries.length === 0) {
    return (
      <div className="border border-dashed border-ink/20 px-4 py-10 text-center">
        <p className="font-heading text-lg font-semibold">{emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/65">{emptyBody}</p>
      </div>
    );
  }

  return (
    <ol className="space-y-2">
      {entries.map((entry) => {
        const showSim =
          simulated || entry.path === "simulated-review";
        const showDemo = Boolean(entry.demo) && !showSim;
        const satire = entry.satire ?? [];

        return (
          <li
            key={entry.id}
            className={cn(
              "border bg-card px-3 py-2.5 sm:px-4",
              entry.kind === "correction" && "border-masthead/40",
              entry.kind === "duplicate" && "opacity-70",
              entry.delayed && "border-dashed",
              showDemo && "border-ink/15",
              !showDemo && !showSim && "border-ink/12",
              showSim && "border-ink/12",
            )}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {showSim ? (
                <Badge className="bg-sim text-sim-foreground font-mono text-[10px] tracking-wide uppercase">
                  Simulated
                </Badge>
              ) : null}
              {showDemo ? (
                <Badge className="bg-demo text-demo-foreground font-mono text-[10px] tracking-wide uppercase">
                  Demo
                </Badge>
              ) : null}
              <Badge
                variant={entry.kind === "correction" ? "destructive" : "outline"}
                className="font-mono text-[10px] uppercase"
              >
                {kindLabel(entry.kind)}
              </Badge>
              {entry.kind === "commentary" ? (
                <Badge variant="secondary" className="font-mono text-[10px] uppercase">
                  Character
                </Badge>
              ) : null}
              {entry.delayed ? (
                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  Delayed
                </Badge>
              ) : null}
              <span className="font-mono text-[11px] text-ink/45">
                {entry.postedAtLabel}
              </span>
            </div>
            <h3 className="mt-1.5 font-heading text-base font-semibold leading-snug sm:text-lg">
              {entry.headline}
            </h3>
            <p className="mt-1 text-sm leading-6 text-ink/80">{entry.body}</p>
            {satire.length > 0 ? (
              <ul className="mt-2 space-y-2 border-t border-ink/10 pt-2">
                {satire.map((line) => (
                  <li key={`${entry.id}-${line.voiceId}-${line.line}`}>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant="secondary"
                        className="font-mono text-[10px] uppercase"
                      >
                        Satire
                      </Badge>
                      <Link
                        href={`/cast/${line.voiceId}`}
                        className="font-mono text-[11px] tracking-wide text-masthead uppercase underline-offset-4 hover:underline"
                      >
                        {line.voiceName}
                      </Link>
                    </div>
                    <p className="mt-1 font-heading text-[15px] leading-6 text-ink">
                      {line.line}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
            {entry.correctsId ? (
              <p className="mt-2 font-mono text-[11px] text-masthead uppercase">
                Corrects {entry.correctsId}
              </p>
            ) : null}
            {entry.duplicateOfId ? (
              <p className="mt-2 font-mono text-[11px] text-ink/50 uppercase">
                Duplicate of {entry.duplicateOfId}
              </p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
