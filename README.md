# Poor Form Sports — Sunday Pilot

Satirical desk. Public surface is three labeled **DEMO** backtests: Melbourne (SF 27–LAR 7), SNF (NYG 28–DAL 20), and MNF (KC 31–DEN 10). Lead voice is **Chip Absolute**. A private **SIMULATED** replay stays behind the desk gate.

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
| `/` | Home board. Hot Bar tokens. Three DEMO scorebugs; Stories strip under Cast. |
| `/demo` | Redirects to `/games/sunday-pilot`. |
| `/games/sunday-pilot` | Canonical Melbourne DEMO timeline. Full Editor fact + SATIRE beats. |
| `/games/sunday-pilot/delayed` | Public pause. Banner: **Updates delayed**. Resume returns to the game. |
| `/games/demo-dal-nyg-snf` | SNF DEMO timeline. DAL @ NYG, NYG 28–20. Editor fact + SATIRE seeds. |
| `/games/demo-den-kc-mnf` | MNF DEMO timeline. DEN @ KC, KC 31–10. Editor fact + SATIRE seeds. |
| `/stories` | DEMO/SATIRE longform index. Editor-owned seeds. |
| `/stories/fifteen-plays-one-continent-zero-chill` | Chip Absolute Melbourne column. |
| `/stories/conversion-referendums-week1` | Wes Process Week 1 process column. |
| `/cast` | Poor Form Desk strip. |
| `/cast/chip-absolute` (and other slugs) | Voice stubs. Chip Absolute is the lead profile. |
| `/review` | Private review desk. Gate phrase: `desk`. |

`/bloggers/lead-blogger` redirects to `/cast/chip-absolute`.

Override the gate with `REVIEW_PASSWORD` if you need a local secret. Default remains `desk`.

## DEMO vs SIMULATED

- **DEMO** is three labeled public backtests, not live, and not the live NFL scoreboard:
  - Melbourne: SF 27 – LAR 7, MCG. Sources: ESPN / Reuters / Rams.com / NFL gamebook. Injury beats skipped. Chyron Carl is silent.
  - SNF: NYG 28 – DAL 20, MetLife. Sources: ESPN / CBS / NBC / Giants.com. Len, Boo, Carl silent.
  - MNF: KC 31 – DEN 10, Arrowhead. Sources: ESPN recap gameId 401872931. Len, Boo silent. Carl files one platform beat.
- SATIRE lines on DEMO cards are Editor-approved copy, shown with byline. Fact-only cards have no commentary.
- DEMO ids stay in `lib/demo/*` and `lib/live/catalog.ts`. They are not mapped into live NFL coverage or `/api/nfl/scores`.
- **SIMULATED** is `/review` only. Greyshirts and Red Caps are labeled **SIMULATED desk aliases**. Public pages never import `lib/simulated`.
- Pause on a public DEMO game marks the wire delayed without fabricating updates. Review Play / Pause / scrub / rewind stay on the alias tape.

## Pilot constraints

- Live blog is editorial (`liveBlogEnabled`). All three DEMO games are on.
- Two jobs on a card: **Fact** is the official-shaped hook. **SATIRE** is character voice and is never a score source.
- The public-live path does not load the simulated reel.
