# Preview failover drill — September 16, 2026 (Central)

## Scope and observed deployment

- Preview: https://newsroom-sunday-pilot-ec652q858-poor-form-sports.vercel.app/
- Deployment record: https://vercel.com/poor-form-sports/newsroom-sunday-pilot/7Hm42jRe9MSr9VSRuqT3tcvTh4Gi
- Vercel's Preview deployment list identified commit `0602201` on `cursor/demo-voice-flush-v4-0d7a`.
- Fix branch starts from main `7f4f5f2`; do not merge/promote this PR as part of the drill.
- Production environment values, Redis, and keys were not changed. No provider fault was injected. No cache was flushed.

## Stage results

| Stage | Acceptance result | Evidence / gap |
| --- | --- | --- |
| A — healthy | PARTIAL; full stage not passed | Preview browser loaded 16 Week 2 games, “Checked 8s ago” and “Scoreboard available.” Scheduled scores were em dashes. DET at BUF showed Sep 17, 7:15 PM CDT. Game-detail links used `nfl:` identities, while the separate archive retained DEMO labels. Later observation showed “Checked 1m ago.” Exact polling cadence and API provider/body were not independently measured. |
| B — ESPN failure | BLOCKED; not run | No `NFL_SMOKE_OUTAGE=espn` was set. Need authenticated API access and a Preview deployment incorporating the latest Preview credentials before testing actual BALLDONTLIE access. |
| C — all upstreams fail | BLOCKED; not run | No `NFL_SMOKE_OUTAGE=all` was set. Real Preview Redis snapshot retention, original fetch timestamp, and rendered delayed-state behavior remain unproven. |
| D — recovery | BLOCKED; not run | No outage was introduced, so no recovery claim is possible. Existing environment-flag mechanism requires Preview redeployment to change modes; it does not meet the requested no-redeploy drill control. |

At 2026-09-17 01:50:11 UTC, a direct request to `/api/nfl/scores` returned HTTP 302 to Vercel SSO, not an application API result. The signed-in browser could render the homepage, but navigation directly to the JSON endpoint returned `ERR_BLOCKED_BY_CLIENT`. No authentication was weakened or bypassed.

Vercel displayed distinct Preview-scoped entries for the Redis URL/token and BALLDONTLIE key. Secret values were not inspected or copied, so database inequality was not independently verified. The Preview BALLDONTLIE entry was updated more recently than the selected deployment was created; that older deployment cannot establish use of the new value.

## Flags and control gap

Actual environment edits in this session: **none**.

Existing documented drill flags: `NFL_SMOKE_OUTAGE=none` (baseline), `espn` (primary fault), `all` (total fault), then removal/`none` (recovery). The server ignores these in Vercel Production. These are deployment-time values, not runtime controls. See `docs/failover-smoke.md` for cooldown and polling intervals. Changing a dashboard value alone is not proof the deployed function adopted it.

Before continuing, obtain authenticated Vercel CLI access, verify the Preview target and its isolated store, deploy the current Preview configuration, and record the baseline API JSON/status. To satisfy recovery without redeployment, use an explicitly Preview-only runtime fault mechanism with automatic expiry and observable mode; the existing env-only mechanism is insufficient. Do not open a public fault-control endpoint or change Production to make the drill easier.

## Narrow fix and verification

Cold-load failure previously asserted that Production Redis was not wired. That assertion is now obsolete and also misdiagnosed network/provider failures. The notice now says the board cannot check scores, no saved scoreboard is available in this view, and this does not imply no NFL games. It retains DEMO archive links and the existing retry behavior.

Local verification: ESLint passed; route types and TypeScript passed; all 23 scoreboard tests passed; the deterministic four-stage failover smoke passed; `next build --webpack` passed with 37 static pages generated. These use controlled provider/cache responses for failure cases and are not substitutes for the blocked credentialed Preview stages. No new synthetic scores were sent to Preview.

## Safe enough for TNF?

**No — not yet demonstrated by this drill.** The Preview baseline visibly loads a real scheduled slate and the local failover checks pass, but actual BALLDONTLIE fallback, persistent Preview snapshot retention, and recovery without redeployment have not passed the requested acceptance checks. This is an evidence gap, not proof Production is broken. Finish B–D with authenticated Preview access before calling failover verified.
