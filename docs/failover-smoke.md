# Scoreboard failover smoke

Run `npm run smoke:failover` for a deterministic check of the actual provider adapters, failover service and UI presentation functions. It uses controlled sample responses and a memory store, makes no network requests, and needs no credentials. The four steps are ESPN → forced ESPN failure/BALLDONTLIE → both fail/stale UI → ESPN recovery.

For a real account and browser check, use a Vercel Preview deployment with its own persistent Redis database and a valid `BALLDONTLIE_API_KEY`. Use the same Preview Redis database through the following steps so its saved result survives redeployments. Perform this during a live game; completed or distant games refresh more slowly.

| Step | Preview variable | Check |
| --- | --- | --- |
| 1. Baseline | `NFL_SMOKE_OUTAGE=none` | Open the home page. `/api/nfl/scores` returns `availability: fresh` and games sourced from `espn`. Record `lastSuccessfulFetchAt`. |
| 2. Force ESPN down | `NFL_SMOKE_OUTAGE=espn` | Redeploy Preview. After the next eligible refresh, source is `balldontlie`; score/status remain available. Unsupported clock and possession disappear. |
| 3. Force both down | `NFL_SMOKE_OUTAGE=all` | Redeploy Preview. The saved scores stay visible and `lastSuccessfulFetchAt` stops advancing. Header shows “Updates delayed · Last checked …”; the old live clock/indicator is hidden. |
| 4. Recover | Remove `NFL_SMOKE_OUTAGE` | Redeploy Preview. ESPN returns after any existing five-minute circuit cooldown; successful-fetch time advances and delayed UI clears. |

Allow for the current refresh interval: 20–30 seconds for active games, two minutes for future games, five minutes for final/empty slates, plus browser polling and the five-second CDN cache. The test flag deliberately does not bypass rate limits or purge your saved result. It is ignored on Vercel Production and non-development servers outside Vercel Preview. Do not add it to Production environment variables.

For the browser-only network case, load scores first and then take that browser offline. Saved scores should remain with the delayed label. Restore the connection and verify refresh resumes. A cold browser with no saved response should show “Scores temporarily unavailable” rather than zeroes.

Check `/games/sunday-pilot`, `/games/demo-dal-nyg-snf` and `/games/demo-den-kc-mnf`: each remains a labeled DEMO with its own seeded timeline and source banner, unaffected by score-provider failures. `/demo` still redirects to Melbourne. The live response must contain only `nfl:` game IDs, never DEMO/review IDs. Leave `lib/nfl/coverage.ts` unmapped unless a real live editorial blog has been published.

Record Preview URL, observed source, timestamp and UI result at each step. The offline smoke does not claim that credentialed API access, Redis connectivity or browser rendering have been verified. Run this credentialed Preview checklist after the integration Preview deploy; do not point the outage flag at Production.
