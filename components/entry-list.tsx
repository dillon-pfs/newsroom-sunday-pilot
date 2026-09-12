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
      <div className="border border-dashed border-ink/20 px-4 py-12 text-center">
        <p className="font-heading text-lg font-semibold">{emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/65">{emptyBody}</p>
      </div>
    );
  }

  return (
    <ol className="space-y-3">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className={cn(
            "border border-ink/12 bg-card px-4 py-3",
            entry.kind === "correction" && "border-masthead/40",
            entry.kind === "duplicate" && "opacity-70",
            entry.delayed && "border-dashed",
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            {simulated || entry.path === "simulated-review" ? (
              <Badge className="bg-sim text-sim-foreground font-mono text-[10px] tracking-wide uppercase">
                Simulated
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
          <h3 className="mt-2 font-heading text-lg font-semibold">
            {entry.headline}
          </h3>
          <p className="mt-1 text-sm leading-6 text-ink/75">{entry.body}</p>
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
      ))}
    </ol>
  );
}
