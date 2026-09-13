import { setPublicWire } from "@/app/games/actions";

export function PublicFeedControls({
  paused,
  gameId,
}: {
  paused: boolean;
  gameId: string;
}) {
  return (
    <form
      action={setPublicWire}
      className="flex flex-col gap-3 border border-ink/12 bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <input type="hidden" name="id" value={gameId} />
      <input type="hidden" name="next" value={paused ? "live" : "delayed"} />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-[11px] tracking-wide uppercase">
            Public live feed
          </p>
          {paused ? (
            <span className="inline-flex h-5 items-center rounded-full bg-destructive/10 px-2 font-mono text-[10px] text-destructive uppercase">
              Updates delayed
            </span>
          ) : (
            <span className="inline-flex h-5 items-center rounded-full border border-border px-2 font-mono text-[10px] uppercase">
              Listening
            </span>
          )}
        </div>
        <p className="mt-1 max-w-xl text-sm text-ink/65">
          {paused
            ? "Desk paused the public wire. No new official hooks will surface until you resume. This control does not invent facts."
            : "Resilience stub: pause to mark the wire delayed. Corrections and duplicates only appear when official items arrive."}
        </p>
      </div>
      <button
        type="submit"
        data-testid="public-feed-pause"
        className="inline-flex h-10 shrink-0 items-center rounded-md border border-ink/20 bg-background px-4 font-mono text-xs tracking-wide uppercase hover:bg-muted"
      >
        {paused ? "Resume feed" : "Pause feed"}
      </button>
    </form>
  );
}
