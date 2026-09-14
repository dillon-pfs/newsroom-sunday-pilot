import { DeskPill } from "@/components/desk-pill";

export function PublicFeedControls({
  paused,
  gameId,
}: {
  paused: boolean;
  gameId: string;
}) {
  const href = paused ? `/games/${gameId}` : `/games/${gameId}/delayed`;

  return (
    <div className="flex flex-col gap-3 border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {paused ? (
            <DeskPill tone="warn">Updates delayed</DeskPill>
          ) : (
            <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide uppercase">
              <span className="size-1.5 rounded-full bg-live-green" />
              Listening stub
            </span>
          )}
        </div>
        <p className="mt-1 max-w-xl text-sm text-ink-soft">
          {paused
            ? "Desk paused the public wire. No new official hooks will surface until you resume. This control does not invent facts."
            : "Resilience stub: pause to mark the wire delayed. Corrections and duplicates only appear when official items arrive."}
        </p>
      </div>
      <a
        href={href}
        data-testid="public-feed-pause"
        className="inline-flex h-9 shrink-0 items-center border border-border bg-card-loud px-4 font-mono text-xs tracking-wide uppercase hover:bg-muted"
      >
        {paused ? "Resume feed" : "Pause feed"}
      </a>
    </div>
  );
}
