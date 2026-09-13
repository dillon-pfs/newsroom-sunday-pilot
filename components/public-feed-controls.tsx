"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function PublicFeedControls() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex flex-col gap-3 border border-ink/12 bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-[11px] tracking-wide uppercase">
            Public live feed
          </p>
          {paused ? (
            <Badge variant="destructive" className="font-mono text-[10px] uppercase">
              Updates delayed
            </Badge>
          ) : (
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              Listening
            </Badge>
          )}
        </div>
        <p className="mt-1 max-w-xl text-sm text-ink/65">
          {paused
            ? "Desk paused the public wire. No new official hooks will surface until you resume. This control does not invent facts."
            : "Resilience stub: pause to mark the wire delayed. Corrections and duplicates only appear when official items arrive."}
        </p>
      </div>
      <button
        type="button"
        data-testid="public-feed-pause"
        onClick={() => setPaused((value) => !value)}
        className="inline-flex h-10 shrink-0 items-center rounded-md border border-ink/20 bg-background px-4 font-mono text-xs tracking-wide uppercase hover:bg-muted"
      >
        {paused ? "Resume feed" : "Pause feed"}
      </button>
    </div>
  );
}
