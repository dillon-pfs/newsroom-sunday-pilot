import assert from "node:assert/strict";
import { MemoryStore } from "../lib/nfl/cache.ts";
import { createScoreboardService } from "../lib/nfl/scoreboard-service.ts";
import { normalizeEspn } from "../lib/nfl/providers/espn.ts";
import { normalizeBalldontlie } from "../lib/nfl/providers/balldontlie.ts";
import { gamePresentation, scoreboardPresentation } from "../lib/nfl/presentation.ts";
import { forcedProviderFailure, smokeOutage } from "../lib/nfl/smoke-outage.ts";

// Controlled data, no API keys, network requests, or production cache writes.
// Exercises the same normalization, failover service and UI presentation logic.
let now = Date.parse("2026-09-20T18:00:00Z");
let mode = "none";
const selection = { season: 2026, seasonType: 2 as const, week: 2 };
const primary = () => normalizeEspn({ events: [{
  id: "900001", date: "2026-09-20T17:00:00Z", season: { year: 2026, type: 2 }, week: { number: 2 },
  competitions: [{ status: { period: 3, displayClock: "8:42", type: { name: "STATUS_IN_PROGRESS", shortDetail: "8:42 - 3rd" } },
    situation: { possession: "2" }, competitors: [
      { id: "1", homeAway: "home", score: "14", team: { abbreviation: "GB", displayName: "Green Bay Packers" } },
      { id: "2", homeAway: "away", score: "17", team: { abbreviation: "CHI", displayName: "Chicago Bears" } },
    ] }],
}] }, new Date(now).toISOString());
const backup = () => normalizeBalldontlie({ data: [{
  id: 900002, season: 2026, postseason: false, week: 2, date: "2026-09-20T17:00:00Z",
  status: "In Progress", status_state: "in_progress", home_team_score: 17, visitor_team_score: 21,
  home_team: { abbreviation: "GB", full_name: "Green Bay Packers" },
  visitor_team: { abbreviation: "CHI", full_name: "Chicago Bears" },
}], meta: { next_cursor: null } }, new Date(now).toISOString());
const outage = () => smokeOutage({ NODE_ENV: "development", NFL_SMOKE_OUTAGE: mode });
const run = createScoreboardService({ store: new MemoryStore(() => now), selection, now: () => now,
  espn: async () => outage() === "none" ? primary() : forcedProviderFailure(),
  backup: async () => outage() === "all" ? forcedProviderFailure() : backup(),
});

const espn = await run();
assert.equal(espn.games[0].source, "espn");
assert.equal(espn.availability, "fresh");
assert.equal(gamePresentation(espn.games[0], false).live, true);
console.log("PASS 1/4 · ESPN baseline → fresh scores, live indicator and source clock");

mode = "espn";
now += 21_000;
const fallback = await run();
assert.equal(fallback.games[0].source, "balldontlie");
assert.equal(fallback.availability, "fresh");
assert.equal(fallback.games[0].id, espn.games[0].id);
assert.equal(fallback.games[0].away.score, 21);
assert.equal(fallback.games[0].clock, null);
assert.equal(fallback.games[0].possessionTeamId, null);
assert.equal(gamePresentation(fallback.games[0], false).clock, null);
console.log("PASS 2/4 · Forced ESPN failure → BALLDONTLIE scores, old clock/possession removed");

mode = "all";
now += 31_000;
const stale = await run();
assert.equal(stale.availability, "stale");
assert.deepEqual(stale.games, fallback.games);
assert.equal(stale.lastSuccessfulFetchAt, fallback.lastSuccessfulFetchAt);
const boardView = scoreboardPresentation(stale, false, now);
const gameView = gamePresentation(stale.games[0], boardView.stale);
assert.match(boardView.status, /^Updates delayed · Last checked/);
assert.equal(gameView.badge, "Delayed");
assert.equal(gameView.live, false);
assert.equal(gameView.clock, null);
assert.equal(gameView.possessionTeamId, null);
console.log("PASS 3/4 · Both providers fail → saved scores, original timestamp, delayed UI, no live clock");

mode = "none";
now += 31_000;
const recovered = await run();
assert.equal(recovered.availability, "fresh");
assert.equal(recovered.games[0].source, "espn");
assert.notEqual(recovered.lastSuccessfulFetchAt, stale.lastSuccessfulFetchAt);
assert.equal(scoreboardPresentation(recovered, false, now).stale, false);
console.log("PASS 4/4 · Providers recover → fresh ESPN snapshot and normal UI restored");
console.log("Offline smoke passed. Use docs/failover-smoke.md for credentialed Preview/browser verification.");
