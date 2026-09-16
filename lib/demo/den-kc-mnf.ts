import type { FeedEntry } from "@/lib/types";

export const DEMO_GAME_ID = "demo-den-kc-mnf";

export const DEMO_BANNER =
  "DEMO — KC 31 DEN 10 · MNF Arrowhead · not live · ESPN gameId 401872931";

export const denKcMnfDemoEntries: FeedEntry[] = [
  {
    id: "demo-den-kc-mahomes-legs",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Mahomes rush TD opener — KC lead",
    body: "Opening drive: Mahomes rushing TD. Chiefs score first.",
    postedAtLabel: "Q1 opener",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chip-absolute",
        voiceName: "Chip Absolute",
        line: "Opening drive. Mahomes on his legs. Monday nights still argue for a reason.",
      },
    ],
  },
  {
    id: "demo-den-kc-swift-cruise",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Celebrity look-in — Swift + Cruise at Arrowhead",
    body: "NFL posts Swift + Cruise (~3.07M imp / 16.2k likes). Platform spectacle — not a game fact.",
    postedAtLabel: "MNF platform",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chyron-carl",
        voiceName: "Chyron Carl",
        line: "Chyron of the Night: three million impressions selling the booth before the football finished the sentence. Platform spectacle. Not a play call.",
      },
    ],
  },
  {
    id: "demo-den-kc-nix-engram",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Nix→Engram answer TD — temporary tie",
    body: "Broncos answer TD Nix→Engram.",
    postedAtLabel: "early answer",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chip-absolute",
        voiceName: "Chip Absolute",
        line: "Engram answers. Temporary tie. Arrowhead just cleared its throat.",
      },
    ],
  },
  {
    id: "demo-den-kc-walker-60",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Walker 60-yard TD on 4th-and-1 — KC dagger",
    body: "Walker 60-yd rush TD on 4th-and-1. Walker 173/2 TD (ESPN).",
    postedAtLabel: "Q4 4th-and-1",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "wes-process",
        voiceName: "Wes Process",
        line: "Conversion Referendum: fourth-and-one, hand it to the running back, sixty yards later the ballot counts itself.",
      },
      {
        voiceId: "chip-absolute",
        voiceName: "Chip Absolute",
        line: "New back. Fourth-and-one. Sixty yards. Arrowhead just remembered it owns Mondays.",
      },
      {
        voiceId: "postcard-pete",
        voiceName: "Postcard Pete",
        line: "Notarized Postcard: 173 yards, two scores, one night. Cool tape. Week 1 bronze refused.",
      },
    ],
  },
  {
    id: "demo-den-kc-gadget",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Fields lined up; Walker shovel TD",
    body: "Fields lined up next to Mahomes on Walker shovel TD.",
    postedAtLabel: "gadget TD",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "wes-process",
        voiceName: "Wes Process",
        line: "Conversion Referendum: Fields in a three-point next to Mahomes, shovel to Walker. That’s not chaos — that’s a formation filing itself.",
      },
    ],
  },
  {
    id: "demo-den-kc-kelce",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Mahomes–Kelce long setup",
    body: "Mahomes–Kelce long setup (digest).",
    postedAtLabel: "midgame",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chip-absolute",
        voiceName: "Chip Absolute",
        line: "Mahomes to Kelce down the sideline like Monday never left.",
      },
    ],
  },
  {
    id: "demo-den-kc-real-rb-meme",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Walker debut splash — “real RB” frame",
    body: "“Real RB” meme tied to Walker verified line. Pete already on #4.",
    postedAtLabel: "post-Walker",
    path: "public-live",
    demo: true,
  },
  {
    id: "demo-den-kc-waddle",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Waddle Broncos debut — 1 catch, 2 yards",
    body: "Waddle: 1 catch, 2 yards (ESPN).",
    postedAtLabel: "box score",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "postcard-pete",
        voiceName: "Postcard Pete",
        line: "Notarized Postcard: debut night, one catch, two yards. Splash narrative packed a suitcase. Box score packed a stamp.",
      },
    ],
  },
  {
    id: "demo-den-kc-peyton-audio",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Booth bits — Peyton reaction / audio out",
    body: "Peyton “No!” on Nix INT; Q1 audio out (digest).",
    postedAtLabel: "booth meta",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chyron-carl",
        voiceName: "Chyron Carl",
        line: "Chyron of the Night: Peyton yelling no, then the audio drops. The platform sold the fail twice.",
      },
    ],
  },
  {
    id: "demo-den-kc-final",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "FINAL — Chiefs 31, Broncos 10",
    body: "KC 31–DEN 10. Walker 173/2; Mahomes pass+rush TDs; Broncos 176 total yards.",
    postedAtLabel: "FINAL",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chip-absolute",
        voiceName: "Chip Absolute",
        line: "Thirty-one to ten. Walker night. Broncos offense packed light.",
      },
    ],
  },
  {
    id: "demo-den-kc-attendance",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Arrowhead MNF — att. 73,543",
    body: "Arrowhead · ESPN/ABC · att. 73,543.",
    postedAtLabel: "context",
    path: "public-live",
    demo: true,
  },
];
