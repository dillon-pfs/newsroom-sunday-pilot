"use client";

import { useEffect, useMemo, useState } from "react";
import { lockReview } from "@/app/review/actions";
import { EntryList } from "@/components/entry-list";
import { GameScore } from "@/components/game-score";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPublicGame } from "@/lib/live/public";
import {
  SIMULATED_REEL_MS,
  beatsThrough,
  clockAt,
  delayedAt,
  scoreAt,
  statusAt,
} from "@/lib/simulated/replay";

const TICK_MS = 200;

export function ReplayDesk() {
  const game = getPublicGame("sunday-pilot");
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setCursor((current) => {
        const next = Math.min(current + TICK_MS, SIMULATED_REEL_MS);
        if (next >= SIMULATED_REEL_MS) {
          setPlaying(false);
        }
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  const entries = useMemo(() => [...beatsThrough(cursor)].reverse(), [cursor]);
  const score = scoreAt(cursor);
  const delayed = delayedAt(cursor) || playing === false && cursor > 0 && cursor < SIMULATED_REEL_MS;

  if (!game) {
    return (
      <p className="text-sm text-ink/70">Sunday Pilot Game is missing from the catalog.</p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="border border-sim bg-sim px-4 py-3 text-sim-foreground">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase">
          Simulated · Review only
        </p>
        <p className="mt-1 text-sm">
          This reel is labeled SIMULATED on every beat. It is not wired to
          the public scoreboard, game page, or blogger profile.
        </p>
      </div>

      {(delayed || !playing) && cursor > 0 && cursor < SIMULATED_REEL_MS ? (
        <div className="border border-dashed border-masthead/50 bg-card px-4 py-3">
          <Badge variant="destructive" className="font-mono text-[10px] uppercase">
            Updates delayed
          </Badge>
          <p className="mt-2 text-sm text-ink/70">
            {playing
              ? "The tape itself called a hitch. Wait for the recovered beat."
              : "Replay is paused. Resume to keep the simulated wire moving."}
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border border-ink/15 bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-wide uppercase">
            Replay · {(cursor / 1000).toFixed(1)}s / {SIMULATED_REEL_MS / 1000}s
          </p>
          <p className="text-sm text-ink/65">
            Play walks the Sunday Pilot Game tape. Pause is a feed-resilience stub.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => {
              if (cursor >= SIMULATED_REEL_MS) {
                setCursor(0);
                setPlaying(true);
                return;
              }
              setPlaying((value) => !value);
            }}
          >
            {playing ? "Pause" : cursor >= SIMULATED_REEL_MS ? "Play again" : "Play"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPlaying(false);
              setCursor(0);
            }}
          >
            Rewind
          </Button>
          <form action={lockReview}>
            <Button type="submit" variant="ghost">
              Lock desk
            </Button>
          </form>
        </div>
      </div>

      <GameScore
        game={game}
        score={score}
        status={statusAt(cursor)}
        clockLabel={clockAt(cursor)}
        simulated
      />

      <section className="space-y-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
            Simulated live blog
          </p>
          <h2 className="font-heading text-2xl font-semibold">Timeline</h2>
        </div>
        <EntryList
          entries={entries}
          simulated
          emptyTitle="Tape is cued"
          emptyBody="Press Play to walk the SIMULATED Sunday reel. Facts, commentary, a duplicate, a correction, and a delayed hitch are on the tape."
        />
      </section>
    </div>
  );
}
