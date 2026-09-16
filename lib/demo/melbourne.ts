import type { FeedEntry } from "@/lib/types";

export const DEMO_GAME_ID = "sunday-pilot";

export const DEMO_BANNER =
  "DEMO — SF 27 LAR 7 · Melbourne MCG backtest · not live · ESPN/Reuters/Rams.com/NFL gamebook";

export const melbourneDemoEntries: FeedEntry[] = [
  {
    id: "demo-q1-pineiro-20",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Pineiro 20-yard FG — SF 3–0",
    body: "After LAR punt, SF 15-play ~65-yd → Pineiro 20 FG. SF 3–0.",
    postedAtLabel: "Q1 6:15",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chip-absolute",
        voiceName: "Chip Absolute",
        line: "Fifteen plays for a field goal on a new continent. That’s not football — that’s a hostage negotiation with uprights.",
      },
      {
        voiceId: "wes-process",
        voiceName: "Wes Process",
        line: "Conversion Referendum: fifteen plays, three points, first Australian regular-season stamp. Process showed up. Drama did not.",
      },
    ],
  },
  {
    id: "demo-q2-kyren-td",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Kyren Williams 5-yard TD — LAR 7–3",
    body: "Stafford→Nacua 41; Kyren Williams 5-yd TD. LAR 7–3. First NFL TD on Australian soil.",
    postedAtLabel: "Q2 14:57",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chip-absolute",
        voiceName: "Chip Absolute",
        line: "First NFL touchdown on Australian soil and it’s Kyren Williams. History just wore a Rams jersey for six seconds and I need a minute.",
      },
      {
        voiceId: "postcard-pete",
        voiceName: "Postcard Pete",
        line: "Notarized Postcard: first TD on a new continent. Cool plaque. Stamp refused until someone scores again.",
      },
    ],
  },
  {
    id: "demo-q2-lake-int",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Quentin Lake intercepts Purdy",
    body: "Quentin Lake INT of Purdy (intended Kittle).",
    postedAtLabel: "Q2 ~12:04",
    path: "public-live",
    demo: true,
  },
  {
    id: "demo-q2-green-int",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Renardo Green intercepts Stafford",
    body: "Renardo Green INT of Stafford deep to Nacua.",
    postedAtLabel: "Q2 ~8:52",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chip-absolute",
        voiceName: "Chip Absolute",
        line: "Interception. Interception. Same quarter. At this point the football is applying for dual citizenship.",
      },
    ],
  },
  {
    id: "demo-q2-robinson-td",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Robinson 39-yard TD — SF 10–7 HT",
    body: "Purdy→Demarcus Robinson (ex-Ram) 39-yd TD. SF 10–7 HT.",
    postedAtLabel: "Q2 4:28",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chip-absolute",
        voiceName: "Chip Absolute",
        line: "Ex-Ram Demarcus Robinson just scored on the Rams in Australia. Somewhere a group chat just combusted.",
      },
    ],
  },
  {
    id: "demo-ht-travel",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Travel and the MCG crowd",
    body: "SF in Melbourne ~1 week; Rams day-before; crowd booed Rams / cheered 49ers.",
    postedAtLabel: "HT travel",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "layover-len",
        voiceName: "Layover Len",
        line: "One team packed a week early. The other packed a carry-on. That is a matchup.",
      },
      {
        voiceId: "boo-atlas",
        voiceName: "Boo Atlas",
        line: "The building booed one jersey and adopted the other. Neutral site? The throats filed a dissenting opinion.",
      },
    ],
  },
  {
    id: "demo-q3-evans-td",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Evans first TD as a 49er — SF 17–7",
    body: "Deebo KR ~45–46; Purdy→Mike Evans 2-yd TD (first as 49er). SF 17–7.",
    postedAtLabel: "Q3 11:03",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chip-absolute",
        voiceName: "Chip Absolute",
        line: "Deebo sets the table, Evans scores his first as a 49er, and Melbourne high-fives itself like it drafted him.",
      },
    ],
  },
  {
    id: "demo-late-q3-stuffed",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Stafford sneak stuffed — turnover on downs",
    body: "Nacua inches short; 4th-and-goal SF 1 Stafford sneak stuffed (TOD).",
    postedAtLabel: "Late Q3",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "wes-process",
        voiceName: "Wes Process",
        line: "Conversion Referendum: fourth-and-goal from the one, sneak stuffed, turnover on downs. Not unlucky — process with a bruise.",
      },
    ],
  },
  {
    id: "demo-q4-deebo-td",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Deebo 15-yard TD after 99-yard drive — SF 24–7",
    body: "99-yd drive; Purdy→Deebo 15-yd TD. SF 24–7.",
    postedAtLabel: "Q4 12:57",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "chip-absolute",
        voiceName: "Chip Absolute",
        line: "You stuff them at the one, then they go ninety-nine yards. That’s not a drive — that’s revenge tourism.",
      },
    ],
  },
  {
    id: "demo-q4-pineiro-56",
    gameId: DEMO_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Pineiro 56-yard FG — SF 27–7",
    body: "Pineiro 56 FG. SF 27–7.",
    postedAtLabel: "Q4 9:43",
    path: "public-live",
    demo: true,
    satire: [
      {
        voiceId: "postcard-pete",
        voiceName: "Postcard Pete",
        line: "Notarized Postcard: fifty-six-yard bow on a new continent. Cool ending. Still not a dynasty stamp.",
      },
    ],
  },
];
