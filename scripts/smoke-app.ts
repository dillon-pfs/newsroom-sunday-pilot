import assert from "node:assert/strict";
import type { ScoreboardResponse } from "../lib/nfl/types.ts";

// Read-only HTTP integration check against the local development preview.
const origin = "http://127.0.0.1:43147";
const scores = await fetch(`${origin}/api/nfl/scores`);
assert.equal(scores.status, 200, "The dev API should return a valid ESPN snapshot");
const body = await scores.json() as ScoreboardResponse;
assert.equal(body.availability, "fresh");
assert.ok(body.games.length > 0);
assert.ok(body.lastSuccessfulFetchAt);
assert.equal(scores.headers.get("cache-control"), "public, max-age=0, must-revalidate");
const again = await (await fetch(`${origin}/api/nfl/scores`)).json() as ScoreboardResponse;
assert.equal(again.lastSuccessfulFetchAt, body.lastSuccessfulFetchAt, "Repeated requests should reuse the snapshot");
const home = await (await fetch(origin)).text();
assert.ok(home.includes("Around the league"));
assert.ok(home.includes("Melbourne backtest"));
assert.ok(!home.includes("Greyshirts"), "Review-only simulated teams must not reach the public board");
const detail = await fetch(`${origin}/scores/${encodeURIComponent(body.games[0].id)}`);
assert.equal(detail.status, 200);
assert.ok((await detail.text()).includes("Game details"));
assert.equal((await fetch(`${origin}/scores/not-a-game`)).status, 404);
console.log(JSON.stringify({ api: scores.status, games: body.games.length, cached: true, home: "passed", details: "passed", invalidGame: 404 }, null, 2));
