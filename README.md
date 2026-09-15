# Poor Form Sports — Sunday Pilot

Satirical desk with a live NFL scoreboard. Lead voice is **Chip Absolute**. The labeled **Melbourne DEMO** (SF 27–LAR 7 at the MCG) remains in its own archive section. A private **SIMULATED** replay stays behind the desk gate.

## Run locally

```bash
npm install
npm run dev
```

Dev server: [http://localhost:43147](http://localhost:43147)

```bash
npm run build
npm start
```

`npm start` is the stable preview (port 43147).

## Live NFL scoreboard

The complete implementation and setup guide is in [docs/nfl-scoreboard.md](docs/nfl-scoreboard.md).

- ESPN is the primary source; the first browser load calls `/api/nfl/scores`.
- `BALLDONTLIE_API_KEY` enables backup scores and game status.
- Production requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- Local development uses an in-memory cache if Redis is not configured.
- Copy `.env.example` to `.env.local` and fill in the values you need.
- Do not put credentials in `NEXT_PUBLIC_` variables or commit `.env.local`.
- Use Node 22.18+ (or Node 24) for the TypeScript test/smoke scripts.

```bash
npm run test:nfl
npm run typecheck
npm run lint
npm run smoke:espn
```

## Routes

| Path | What it is |
| --- | --- |
| `/` | Live NFL board, labeled Melbourne demo archive, Cast and Stories. |
| `/api/nfl/scores` | Normalized scores with cache age and availability; no credentials. |
| `/scores/[id]` | Live game details for a fixture in the current scoreboard window. |
| `/demo` | Redirects to `/games/sunday-pilot`. |
| `/games/sunday-pilot` | Canonical Melbourne DEMO timeline. Full Editor fact + SATIRE beats. |
| `/games/sunday-pilot/delayed` | Public pause. Banner: **Updates delayed**. Resume returns to the game. |
| `/games/late-window` | Hold listing. Live blog **off**. Scores **—**. |
| `/stories` | DEMO/SATIRE longform index. Editor-owned seeds. |
| `/stories/fifteen-plays-one-continent-zero-chill` | Chip Absolute Melbourne column. |
| `/stories/conversion-referendums-week1` | Wes Process Week 1 process column. |
| `/cast` | Poor Form Desk strip. |
| `/cast/chip-absolute` (and other slugs) | Voice stubs. Chip Absolute is the lead profile. |
| `/review` | Private review desk. Gate phrase: `desk`. |

`/bloggers/lead-blogger` redirects to `/cast/chip-absolute`.

Override the gate with `REVIEW_PASSWORD` if you need a local secret. Default remains `desk`.

## DEMO vs SIMULATED

- **DEMO** is Melbourne only: SF 27 – LAR 7, MCG backtest, not live. Sources named on the sticky banner: ESPN / Reuters / Rams.com / NFL gamebook. Injury beats skipped. Chyron Carl is silent.
- SATIRE lines on DEMO cards are Editor-approved copy, shown with byline. Fact-only cards have no commentary.
- The legacy Late Window hold listing stays **—**. Real NFL fixtures use the independent `/api/nfl/scores` feed and `/scores/[id]` view.
- **SIMULATED** is `/review` only. Greyshirts and Red Caps are labeled **SIMULATED desk aliases**. Public pages never import `lib/simulated`.
- Pause on the public DEMO game marks the wire delayed without fabricating updates. Review Play / Pause / scrub / rewind stay on the alias tape.

## Pilot constraints

- Live blog is editorial (`liveBlogEnabled`). Sunday Pilot / DEMO is on; Late Window is not.
- Two jobs on a card: **Fact** is the official-shaped hook. **SATIRE** is character voice and is never a score source.
- The public-live path does not load the simulated reel.
