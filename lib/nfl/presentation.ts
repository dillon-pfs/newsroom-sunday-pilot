import type { NflGame, ScoreboardResponse } from "./types.ts";

/** Shared by the live components and the deterministic failover smoke check. */
export function scoreboardPresentation(data: ScoreboardResponse | null, failed: boolean, now: number | null) {
  const ageMs = data?.lastSuccessfulFetchAt && now !== null
    ? Math.max(0, now - Date.parse(data.lastSuccessfulFetchAt)) : null;
  const stale = failed || data?.availability === "stale" ||
    (ageMs !== null && ageMs > (data?.staleAfterMs ?? 90_000));
  const ageLabel = ageMs === null ? "" : ageMs < 60_000
    ? `${Math.floor(ageMs / 1000)}s ago` : `${Math.floor(ageMs / 60_000)}m ago`;
  const status = !data
    ? failed ? "Scores temporarily unavailable" : "Loading scores…"
    : `${stale ? "Updates delayed · Last checked" : "Checked"} ${ageLabel}`;
  return { stale, status };
}

export function gamePresentation(game: NflGame, stale: boolean) {
  const live = game.state === "in_progress" && !stale;
  const label = stale ? game.state === "final" ? "Final · saved result" : "Updates delayed"
    : game.state === "scheduled" ? "Scheduled" : game.statusLabel;
  const period = game.period && game.period > 4 ? "OT" : game.period ? `Q${game.period}` : "";
  return {
    live, label,
    badge: live ? "Live" : stale ? "Delayed" : game.state === "final" ? "Final" : "NFL",
    clock: live && game.clock && !game.statusLabel.includes(game.clock) ? `${period} · ${game.clock}` : null,
    possessionTeamId: live ? game.possessionTeamId : null,
  };
}
