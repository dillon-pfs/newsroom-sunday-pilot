# Poor Form Sports — Sunday Pilot

Satirical desk. Public surface is a labeled **Melbourne DEMO** (SF 27–LAR 7 at the MCG). Lead voice is **Chip Absolute**. A private **SIMULATED** replay stays behind the desk gate.

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

## Routes

| Path | What it is |
| --- | --- |
| `/` | Home board. Hot Bar tokens. TV-black Melbourne scorebug; Stories strip under Cast. |
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
- Non-demo public scores stay **—**.
- **SIMULATED** is `/review` only. Greyshirts and Red Caps are labeled **SIMULATED desk aliases**. Public pages never import `lib/simulated`.
- Pause on the public DEMO game marks the wire delayed without fabricating updates. Review Play / Pause / scrub / rewind stay on the alias tape.

## Pilot constraints

- Live blog is editorial (`liveBlogEnabled`). Sunday Pilot / DEMO is on; Late Window is not.
- Two jobs on a card: **Fact** is the official-shaped hook. **SATIRE** is character voice and is never a score source.
- The public-live path does not load the simulated reel.
