# Newsroom — Sunday Pilot

Satirical fantasy-football newsroom desk. Smallest working slice: a live scoreboard, clickable games, an editorial live-blog flag, a Lead Blogger profile, and a private SIMULATED replay.

Temp brand: **Newsroom**. Blogger: **Lead Blogger**. Featured game: **Sunday Pilot Game**.

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

`npm start` is the stable preview (port 43147). `npm run dev` is fine on a local machine; this slice does not depend on a live WebSocket.

## Routes

| Path | What it is |
| --- | --- |
| `/` | Home live scoreboard. Games are clickable. |
| `/games/sunday-pilot` | Sunday Pilot Game. Editorial live blog **on**. Official stubs only. |
| `/games/late-window` | Second listing. Editorial live blog **off**. |
| `/bloggers/lead-blogger` | Lead Blogger profile and voice rule. |
| `/review` | Private review desk. Gate phrase: `desk`. |

Override the gate with `REVIEW_PASSWORD` if you need a local secret. Default remains `desk`.

## Pilot constraints

- **Live blog is editorial.** `liveBlogEnabled` is a desk flag. It is off unless editorial turns it on. Sunday Pilot Game is the only enabled game in this slice.
- **No invented live facts on the public path.** `/`, `/games/*`, and `/bloggers/*` read `lib/live` only. Scores stay `—` until an official source exists. The public timeline can hold desk hooks (fact / commentary slots) but will not invent play-by-play.
- **SIMULATED tape is review-only.** `lib/simulated/replay.ts` is imported by the private review desk, not by public-live pages. Every replay beat is labeled **SIMULATED**.
- **Feed resilience stubs** (review reel + public pause control): corrections, duplicates, “updates delayed”, and play/pause. Pause on the public game page marks the wire delayed without fabricating updates.
- **Two hooks, two jobs.** `fact` entries are official-shaped updates. `commentary` is Lead Blogger character voice and is never a score source.

## What this pilot is not

Not a real NFL feed. Not a public live blog of invented scores. Not every game on the board automatically gets a timeline.
