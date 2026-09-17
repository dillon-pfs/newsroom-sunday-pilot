"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GameScoreCard } from "./game-score-card";
import { NFL_BLOG_LINKS } from "@/lib/nfl/coverage";
import type { NflGame, ScoreboardResponse } from "@/lib/nfl/types";
import { scoreboardPresentation } from "@/lib/nfl/presentation";

function isScoreboard(value: unknown): value is ScoreboardResponse {
  if (!value || typeof value !== "object") return false;
  const data = value as ScoreboardResponse;
  return Array.isArray(data.games) && ["fresh", "stale", "unavailable"].includes(data.availability) &&
    typeof data.nextPollMs === "number" && Number.isFinite(data.nextPollMs) &&
    typeof data.staleAfterMs === "number" && Number.isFinite(data.staleAfterMs) &&
    (data.lastSuccessfulFetchAt === null || Number.isFinite(Date.parse(data.lastSuccessfulFetchAt)));
}

function UnavailableBoardNotice({ gameId }: { gameId?: string }) {
  return (
    <div className="border-2 border-masthead bg-card-loud px-4 py-6 text-left">
      <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">Updates unavailable</p>
      <h3 className="mt-1 font-heading text-2xl font-semibold">The board can’t check scores right now.</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
        We don’t have a saved scoreboard to show in this view. This does not mean there are no NFL games. We’ll keep trying for updates; meanwhile, the labeled DEMO archive is available below.
      </p>
      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 font-mono text-[11px] tracking-wide text-masthead uppercase">
        <Link href="/games/sunday-pilot" className="underline-offset-4 hover:underline">Melbourne DEMO</Link>
        <Link href="/games/demo-dal-nyg-snf" className="underline-offset-4 hover:underline">SNF DEMO</Link>
        <Link href="/games/demo-den-kc-mnf" className="underline-offset-4 hover:underline">MNF DEMO</Link>
        <Link href="/stories" className="underline-offset-4 hover:underline">Desk stories</Link>
        <Link href="/about" className="underline-offset-4 hover:underline">How labels work</Link>
      </div>
      {gameId ? <p className="mt-4 text-xs text-ink-soft">This game’s live details will return when score updates are available.</p> : null}
    </div>
  );
}

export function LiveScoreboard({ gameId }: { gameId?: string }) {
  const [data, setData] = useState<ScoreboardResponse | null>(null);
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let disposed = false;
    let running = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let pollMs = 15_000;

    async function refresh() {
      if (disposed || running || document.hidden) return;
      clearTimeout(timer);
      running = true;
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 30_000);
      try {
        const response = await fetch("/api/nfl/scores", { signal: controller.signal });
        const result: unknown = await response.json();
        if (!response.ok || !isScoreboard(result) || result.availability === "unavailable") throw new Error("Scores unavailable");
        if (!disposed) {
          setData(result);
          setFailed(false);
          setNow(Date.now());
          pollMs = Math.min(300_000, Math.max(15_000, result.nextPollMs));
        }
      } catch {
        if (!disposed) {
          // Keep the last response and its original timestamps on HTTP/network failure.
          setFailed(true);
          setNow(Date.now());
          pollMs = 15_000;
        }
      } finally {
        clearTimeout(timeout);
        running = false;
        if (!disposed && !document.hidden) timer = setTimeout(refresh, pollMs);
      }
    }

    const visible = () => {
      clearTimeout(timer);
      if (!document.hidden) void refresh();
    };
    const tick = setInterval(() => setNow(Date.now()), 10_000);
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("online", visible);
    void refresh();
    return () => {
      disposed = true;
      clearTimeout(timer);
      clearInterval(tick);
      controller?.abort();
      document.removeEventListener("visibilitychange", visible);
      window.removeEventListener("online", visible);
    };
  }, []);

  const { stale, status } = scoreboardPresentation(data, failed, now);
  const games = (data?.games ?? []).filter(game => !gameId || game.id === gameId).map((game): NflGame => {
    const url = NFL_BLOG_LINKS[game.id];
    return { ...game, blogUrl: url?.startsWith("/") && !url.startsWith("//") ? url : null };
  });
  const featured = games.find(g => g.state === "in_progress") ?? games.find(g => g.state === "scheduled") ?? games.at(-1);
  const others = games.filter(g => g.id !== featured?.id);

  return (
    <section className="space-y-3" aria-label="NFL scoreboard" aria-busy={!data && !failed}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">NFL scoreboard</p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">{gameId ? "Game details" : "Around the league"}</h2>
        </div>
        <p className={`font-mono text-[10px] uppercase ${stale ? "text-warn" : "text-ink-soft"}`}>
          {status}
        </p>
      </div>
      <p role="status" className="sr-only">{!data ? failed ? "Scores temporarily unavailable." : "Loading scoreboard." : stale ? "Score updates are delayed." : "Scoreboard available."}</p>
      {featured ? <GameScoreCard game={featured} stale={stale} featured details={Boolean(gameId)} /> : (
        !data && failed ? <UnavailableBoardNotice gameId={gameId} /> : (
          <div className="border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-ink-soft">
            {!data ? "Fetching NFL scores…" : gameId ? "This game is outside the current scoreboard window." : "No games scheduled in this window."}
          </div>
        )
      )}
      {others.length > 0 ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{others.map(game => <GameScoreCard key={game.id} game={game} stale={stale} />)}</div> : null}
      {data ? <p className="text-xs text-ink-soft">Kickoff times shown in Central Time. Scores may lag the game.</p> : null}
      {gameId ? <Link href="/" className="font-mono text-xs text-masthead underline underline-offset-4">← All games</Link> : null}
    </section>
  );
}
