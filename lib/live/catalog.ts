import { LEAD_VOICE_ID, listVoices, voiceToBlogger } from "@/lib/cast";
import { dalNygSnfDemoEntries } from "@/lib/demo/dal-nyg-snf";
import { denKcMnfDemoEntries } from "@/lib/demo/den-kc-mnf";
import { melbourneDemoEntries } from "@/lib/demo/melbourne";
import type { Blogger, FeedEntry, Game } from "@/lib/types";

/**
 * Public-live catalog only. Do not import simulated replay data here.
 * DEMO = three labeled backtests (Melbourne, SNF, MNF). Not the live NFL board.
 */

export const PUBLIC_FEED_PATH = "public-live" as const;

export const bloggers: Blogger[] = listVoices().map(voiceToBlogger);

export const games: Game[] = [
  {
    id: "sunday-pilot",
    name: "49ers at Rams · Melbourne",
    away: { id: "sf", name: "49ers", short: "SF" },
    home: { id: "lar", name: "Rams", short: "LAR" },
    status: "final",
    windowLabel: "Melbourne DEMO",
    liveBlogEnabled: true,
    officialScore: { away: 27, home: 7 },
    clockLabel: "Final",
    assignedBloggerId: LEAD_VOICE_ID,
    demo: true,
    feedNote:
      "DEMO backtest of the Melbourne MCG meeting — not a live wire. Sources: ESPN, Reuters, Rams.com, NFL gamebook. Injury beats skipped. Carl silent.",
  },
  {
    id: "demo-dal-nyg-snf",
    name: "Cowboys at Giants · SNF",
    away: { id: "dal", name: "Cowboys", short: "DAL" },
    home: { id: "nyg", name: "Giants", short: "NYG" },
    status: "final",
    windowLabel: "SNF DEMO",
    liveBlogEnabled: true,
    officialScore: { away: 20, home: 28 },
    clockLabel: "Final",
    assignedBloggerId: LEAD_VOICE_ID,
    demo: true,
    feedNote:
      "DEMO backtest of DAL @ NYG SNF — not a live wire. Sources: ESPN, CBS, NBC, Giants.com. Injury beats skipped. Len, Boo, Carl silent.",
  },
  {
    id: "demo-den-kc-mnf",
    name: "Broncos at Chiefs · MNF",
    away: { id: "den", name: "Broncos", short: "DEN" },
    home: { id: "kc", name: "Chiefs", short: "KC" },
    status: "final",
    windowLabel: "MNF DEMO",
    liveBlogEnabled: true,
    officialScore: { away: 10, home: 31 },
    clockLabel: "Final",
    assignedBloggerId: LEAD_VOICE_ID,
    demo: true,
    feedNote:
      "DEMO backtest of DEN @ KC MNF — not a live wire. Sources: ESPN recap gameId 401872931. X crawl metrics cited in digest only. Injury beats skipped. Len, Boo silent.",
  },
];

export const publicLiveEntries: FeedEntry[] = [
  ...melbourneDemoEntries,
  ...dalNygSnfDemoEntries,
  ...denKcMnfDemoEntries,
];
