import { LEAD_VOICE_ID, listVoices, voiceToBlogger } from "@/lib/cast";
import { melbourneDemoEntries } from "@/lib/demo/melbourne";
import type { Blogger, FeedEntry, Game } from "@/lib/types";

/**
 * Public-live catalog only. Do not import simulated replay data here.
 * DEMO = Melbourne SF 27–LAR 7. Non-demo public scores stay empty (—).
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
    id: "late-window",
    name: "Late window",
    away: { id: "tbd-away", name: "TBD", short: "TBD" },
    home: { id: "tbd-home", name: "TBD", short: "TBD" },
    status: "scheduled",
    windowLabel: "Late window",
    liveBlogEnabled: false,
    officialScore: { away: null, home: null },
    clockLabel: null,
    assignedBloggerId: null,
    feedNote:
      "Hold listing. No DEMO result and no invented score. Public stays — until an official source exists.",
  },
];

export const publicLiveEntries: FeedEntry[] = melbourneDemoEntries;
