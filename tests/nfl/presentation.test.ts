import { test } from "node:test";
import assert from "node:assert/strict";
import { gamePresentation, scoreboardPresentation } from "../../lib/nfl/presentation.ts";
import { smokeOutage } from "../../lib/nfl/smoke-outage.ts";
import type { NflGame, ScoreboardResponse } from "../../lib/nfl/types.ts";

const game: NflGame = {
  id: "nfl:2026:2:CHI:GB", providerIds: { espn: "12345" }, season: 2026, seasonType: 2, week: 2,
  kickoffAt: "2026-09-20T17:00:00Z", state: "in_progress", statusLabel: "8:42 - 3rd",
  period: 3, clock: "8:42", possessionTeamId: "CHI", source: "espn",
  fetchedAt: "2026-09-20T18:00:00Z", sourceUpdatedAt: null, blogUrl: null,
  home: { id: "GB", abbreviation: "GB", name: "Packers", score: 14 },
  away: { id: "CHI", abbreviation: "CHI", name: "Bears", score: 17 },
};
const snapshot: ScoreboardResponse = {
  games: [game], availability: "fresh", lastSuccessfulFetchAt: game.fetchedAt,
  lastAttemptAt: game.fetchedAt, nextPollMs: 15_000, staleAfterMs: 90_000,
};

test("a stale card removes an embedded clock, live indicator and possession", () => {
  const view = gamePresentation(game, true);
  assert.equal(view.label, "Updates delayed");
  assert.equal(view.badge, "Delayed");
  assert.equal(view.clock, null);
  assert.equal(view.possessionTeamId, null);
  assert.equal(view.live, false);
});

test("client network failure and aged snapshots both show delayed scores", () => {
  const now = Date.parse(game.fetchedAt);
  assert.equal(scoreboardPresentation(snapshot, true, now).stale, true);
  assert.equal(scoreboardPresentation(snapshot, false, now + 91_000).stale, true);
  assert.equal(scoreboardPresentation(snapshot, false, now + 15_000).status, "Checked 15s ago");
  assert.equal(scoreboardPresentation(null, true, now).status, "Scores temporarily unavailable");
});

test("a saved final stays identified as a final result during an outage", () => {
  assert.equal(gamePresentation({ ...game, state: "final" }, true).label, "Final · saved result");
});

test("fault injection is restricted to preview and local development", () => {
  assert.equal(smokeOutage({ NODE_ENV: "production", VERCEL_ENV: "production", NFL_SMOKE_OUTAGE: "all" }), "none");
  assert.equal(smokeOutage({ NODE_ENV: "production", NFL_SMOKE_OUTAGE: "all" }), "none");
  assert.equal(smokeOutage({ NODE_ENV: "development", VERCEL_ENV: "production", NFL_SMOKE_OUTAGE: "all" }), "none");
  assert.equal(smokeOutage({ NODE_ENV: "production", VERCEL_ENV: "preview", NFL_SMOKE_OUTAGE: "espn" }), "espn");
  assert.equal(smokeOutage({ NODE_ENV: "development", NFL_SMOKE_OUTAGE: "all" }), "all");
});
