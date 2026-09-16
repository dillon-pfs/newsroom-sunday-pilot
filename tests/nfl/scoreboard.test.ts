import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryStore, RedisStore } from "../../lib/nfl/cache.ts";
import { CONFIG, selectedWeek } from "../../lib/nfl/config.ts";
import { normalizeEspn, fetchEspn } from "../../lib/nfl/providers/espn.ts";
import { normalizeBalldontlie, fetchBalldontlie } from "../../lib/nfl/providers/balldontlie.ts";
import { checkContinuity, createScoreboardService, emptyState, publicResponse } from "../../lib/nfl/scoreboard-service.ts";
import type { NflGame } from "../../lib/nfl/types.ts";

const selection = { season: 2026, seasonType: 2 as const, week: 2 };
const instant = "2026-09-20T18:00:00.000Z";

function espnFixture() {
  return { events: [{ id: "12345", date: instant, season: { year: 2026, type: 2 }, week: { number: 2 },
    competitions: [{ status: { period: 3, displayClock: "8:42", type: { name: "STATUS_IN_PROGRESS", state: "in", shortDetail: "8:42 - 3rd" } },
      situation: { possession: "2" }, competitors: [
        { id: "1", homeAway: "home", score: "14", team: { abbreviation: "GB", displayName: "Green Bay Packers" } },
        { id: "2", homeAway: "away", score: "17", team: { abbreviation: "CHI", displayName: "Chicago Bears" } },
      ] }],
  }] };
}
function backupFixture() {
  return { data: [{ id: 555, season: 2026, postseason: false, week: 2, date: instant,
    status: "In Progress", status_state: "in_progress", home_team_score: 14, visitor_team_score: 17,
    home_team: { abbreviation: "GB", full_name: "Green Bay Packers" },
    visitor_team: { abbreviation: "CHI", full_name: "Chicago Bears" },
  }], meta: { next_cursor: null } };
}
function game(): NflGame { return normalizeEspn(espnFixture(), instant)[0]; }

test("ESPN maps by homeAway rather than array order, parses scores and possession", () => {
  const result = game();
  assert.equal(result.away.score, 17);
  assert.equal(result.home.score, 14);
  assert.equal(result.possessionTeamId, "CHI");
  assert.equal(result.clock, "8:42");
  assert.equal(result.id, "nfl:2026:2:CHI:GB");
  assert.equal(result.blogUrl, null);
});

test("scheduled games have no invented zero scores and halftime remains in progress", () => {
  const raw = espnFixture();
  raw.events[0].competitions[0].status.type.name = "STATUS_SCHEDULED";
  assert.equal(normalizeEspn(raw, instant)[0].home.score, null);
  raw.events[0].competitions[0].status.type.name = "STATUS_HALFTIME";
  assert.equal(normalizeEspn(raw, instant)[0].state, "in_progress");
});

test("provider shape errors, wrong weeks and missing live scores fail validation", () => {
  assert.throws(() => normalizeEspn({}, instant));
  assert.throws(() => normalizeEspn(espnFixture(), instant, { ...selection, week: 3 }));
  const raw = espnFixture();
  raw.events[0].competitions[0].competitors[0].score = "";
  assert.throws(() => normalizeEspn(raw, instant));
  assert.throws(() => normalizeBalldontlie({ ...backupFixture(), meta: { next_cursor: 2 } }, instant));
});

test("backup uses the same canonical game ID and clears unsupported details", () => {
  const backup = normalizeBalldontlie(backupFixture(), instant)[0];
  assert.equal(backup.id, game().id);
  assert.equal(backup.clock, null);
  assert.equal(backup.period, null);
  assert.equal(backup.possessionTeamId, null);
  assert.equal(backup.sourceUpdatedAt, null);
});

test("team aliases normalize and rescheduling does not change game identity", () => {
  const raw = espnFixture();
  raw.events[0].competitions[0].competitors[0].team.abbreviation = "WAS";
  const a = normalizeEspn(raw, instant)[0];
  raw.events[0].date = "2026-09-22T18:00:00Z";
  raw.events[0].week.number = 3;
  const b = normalizeEspn(raw, instant)[0];
  assert.equal(a.home.id, "WSH");
  assert.equal(a.id, b.id);
});

test("initial ESPN fetch builds the real URL and validates its response", async () => {
  let requested = "";
  const games = await fetchEspn(selection, async (url, options) => {
    requested = String(url);
    assert.equal(options?.cache, "no-store");
    assert.ok(options?.signal);
    return Response.json(espnFixture());
  });
  assert.match(requested, /site.api.espn.com/);
  assert.match(requested, /week=2/);
  assert.equal(games.length, 1);
});

test("backup sends the key server-side and covers adjacent UTC dates on cold start", async () => {
  await fetchBalldontlie("test-only-key", undefined, async (url, options) => {
    const parsed = new URL(String(url));
    assert.equal(new Headers(options?.headers).get("Authorization"), "test-only-key");
    assert.deepEqual(parsed.searchParams.getAll("season_types[]"), ["2", "3"]);
    assert.equal(parsed.searchParams.getAll("dates[]")[0], "2026-09-19");
    assert.equal(parsed.searchParams.get("per_page"), "100");
    return Response.json(backupFixture());
  }, new Date(instant));
});

test("one refresh serves concurrent visitors; repeated polling uses the saved result", async () => {
  const now = Date.parse(instant);
  const store = new MemoryStore(() => now);
  let calls = 0;
  const run = createScoreboardService({ store, now: () => now, espn: async () => { calls++; return [game()]; } });
  await Promise.all(Array.from({ length: 50 }, () => run()));
  assert.equal(calls, 1);
  assert.equal((await run()).availability, "fresh");
  assert.equal(calls, 1);
});

test("ESPN outage selects backup, merges IDs and does not retain the ESPN clock", async () => {
  let now = Date.parse(instant);
  const store = new MemoryStore(() => now);
  let broken = false;
  const run = createScoreboardService({ store, now: () => now,
    espn: async () => { if (broken) throw new Error("timeout"); return [game()]; },
    backup: async () => normalizeBalldontlie(backupFixture(), new Date(now).toISOString()),
  });
  await run();
  now += 21_000; broken = true;
  const result = await run();
  assert.equal(result.availability, "fresh");
  assert.deepEqual(result.games[0].providerIds, { espn: "12345", balldontlie: "555" });
  assert.equal(result.games[0].clock, null);
});

test("total outage preserves scores and original successful-fetch timestamp", async () => {
  let now = Date.parse(instant);
  let broken = false;
  const store = new MemoryStore(() => now);
  const run = createScoreboardService({ store, now: () => now,
    espn: async () => { if (broken) throw new Error("503"); return [game()]; },
    backup: async () => { throw new Error("429"); },
  });
  const first = await run();
  now += 21_000; broken = true;
  const second = await run();
  assert.equal(second.availability, "stale");
  assert.equal(second.games[0].away.score, 17);
  assert.equal(second.lastSuccessfulFetchAt, first.lastSuccessfulFetchAt);
  assert.notEqual(second.lastAttemptAt, first.lastAttemptAt);
});

test("cold total outage is unavailable rather than a fabricated zero-score game", async () => {
  const run = createScoreboardService({ store: new MemoryStore(), espn: async () => { throw new Error("down"); } });
  const result = await run();
  assert.equal(result.availability, "unavailable");
  assert.deepEqual(result.games, []);
});

test("three ESPN failures open the circuit and backup respects its shared interval", async () => {
  let now = Date.parse(instant);
  let primaryCalls = 0;
  let backupCalls = 0;
  const run = createScoreboardService({ store: new MemoryStore(() => now), now: () => now,
    espn: async () => { primaryCalls++; throw new Error("down"); },
    backup: async () => { backupCalls++; return normalizeBalldontlie(backupFixture(), instant); },
  });
  for (let i = 0; i < 10; i++) { await run(); now += 30_000; }
  assert.equal(primaryCalls, 3);
  assert.equal(backupCalls, 10);
});

test("shared request reservation includes failures and spans scoreboard selections", async () => {
  let now = Date.parse(instant);
  const store = new MemoryStore(() => now);
  assert.equal(await store.reserve("balldontlie", CONFIG.backupRefreshMs), true);
  now += 29_999;
  assert.equal(await store.reserve("balldontlie", CONFIG.backupRefreshMs), false);
  now += 1;
  assert.equal(await store.reserve("balldontlie", CONFIG.backupRefreshMs), true);
});

test("an expired lock holder cannot overwrite or release a newer owner's state", async () => {
  let now = Date.parse(instant);
  const store = new MemoryStore(() => now);
  assert.equal(await store.acquire("current", "old"), true);
  now += CONFIG.lockMs + 1;
  assert.equal(await store.acquire("current", "new"), true);
  assert.equal(await store.save("current", "old", emptyState()), false);
  await store.release("current", "old");
  assert.equal(await store.acquire("current", "third"), false);
  assert.equal(await store.save("current", "new", emptyState()), true);
});

test("continuity rejects missing active games and stale final regressions, allows score corrections", () => {
  assert.throws(() => checkContinuity([], [game()], Date.parse(instant), false));
  assert.throws(() => checkContinuity([game()], [{ ...game(), state: "final" }], Date.parse(instant), false));
  const corrected = game(); corrected.away.score = 10;
  assert.doesNotThrow(() => checkContinuity([corrected], [game()], Date.parse(instant), false));
});

test("a valid empty off-season response stays empty, and old successful fetches become stale", async () => {
  const result = await createScoreboardService({ store: new MemoryStore(), espn: async () => [] })();
  assert.equal(result.availability, "fresh");
  const state = emptyState();
  state.snapshot = { source: "espn", fetchedAt: instant, games: [game()] };
  assert.equal(publicResponse(state, Date.parse(instant) + 91_000).availability, "stale");
});

test("week selection is explicit and rejects partial environment configuration", () => {
  assert.equal(selectedWeek({}), undefined);
  assert.throws(() => selectedWeek({ NFL_WEEK: "2" }));
  assert.deepEqual(selectedWeek({ NFL_SEASON: "2026", NFL_SEASON_TYPE: "2", NFL_WEEK: "2" }), selection);
});

test("Redis REST authenticates on the server and uses atomic reserve/save/release commands", async (t) => {
  const commands: unknown[][] = [];
  t.mock.method(globalThis, "fetch", async (_url: unknown, options: RequestInit) => {
    assert.equal(new Headers(options.headers).get("Authorization"), "Bearer test-redis-token");
    const command = JSON.parse(String(options.body)) as unknown[];
    commands.push(command);
    const result = command[0] === "GET" ? null : command[0] === "EVAL" ? 1 : "OK";
    return Response.json({ result });
  });
  const store = new RedisStore("https://example.upstash.io", "test-redis-token");
  assert.equal(await store.read("current"), null);
  assert.equal(await store.acquire("current", "owner"), true);
  assert.equal(await store.reserve("balldontlie", 30_000), true);
  assert.equal(await store.save("current", "owner", emptyState()), true);
  await store.release("current", "owner");
  assert.deepEqual(commands[2].slice(0, 1), ["SET"]);
  assert.deepEqual(commands[2].slice(-3), ["NX", "PX", 30_000]);
  assert.equal(commands[3][0], "EVAL");
  assert.match(String(commands[3][1]), /redis.call\('GET',KEYS\[1\]\) == ARGV\[1\]/);
  assert.match(String(commands[4][1]), /redis.call\('DEL',KEYS\[1\]\)/);
});

test("Redis refuses insecure URLs and failed REST commands", async (t) => {
  assert.throws(() => new RedisStore("http://example.upstash.io", "token"));
  t.mock.method(globalThis, "fetch", async () => Response.json({ error: "ERR unavailable" }));
  await assert.rejects(() => new RedisStore("https://example.upstash.io", "token").read("current"));
});
