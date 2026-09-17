import { LEAD_VOICE_ID, listVoices, voiceToBlogger } from "@/lib/cast";
import { dalNygSnfDemoEntries } from "@/lib/demo/dal-nyg-snf";
import { denKcMnfDemoEntries } from "@/lib/demo/den-kc-mnf";
import { melbourneDemoEntries } from "@/lib/demo/melbourne";
import type { Blogger, FeedEntry, Game } from "@/lib/types";

/**
 * Editorial DEMO catalog for /games/*: Melbourne, SNF and MNF backtests.
 * "public-live" is the legacy editorial feed path, not a live scores source.
 * Real NFL fixtures use lib/nfl and /api/nfl/scores. Never import simulated
 * review data here or map these demo IDs into live NFL coverage.
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
    windowLabel: "Melbourne",
    liveBlogEnabled: true,
    officialScore: { away: 27, home: 7 },
    clockLabel: "Final",
    assignedBloggerId: LEAD_VOICE_ID,
    demo: true,
    feedNote:
      "Melbourne MCG archive — not a live wire. Sources: ESPN, Reuters, Rams.com, NFL gamebook. Injury beats skipped. Carl silent.",
  },
  {
    id: "demo-dal-nyg-snf",
    name: "Cowboys at Giants · SNF",
    away: { id: "dal", name: "Cowboys", short: "DAL" },
    home: { id: "nyg", name: "Giants", short: "NYG" },
    status: "final",
    windowLabel: "SNF",
    liveBlogEnabled: true,
    officialScore: { away: 20, home: 28 },
    clockLabel: "Final",
    assignedBloggerId: LEAD_VOICE_ID,
    demo: true,
    feedNote:
      "DAL @ NYG Sunday night archive — not a live wire. Sources: ESPN, CBS, NBC, Giants.com. Injury beats skipped. Len, Boo, Carl silent.",
  },
  {
    id: "demo-den-kc-mnf",
    name: "Broncos at Chiefs · MNF",
    away: { id: "den", name: "Broncos", short: "DEN" },
    home: { id: "kc", name: "Chiefs", short: "KC" },
    status: "final",
    windowLabel: "MNF",
    liveBlogEnabled: true,
    officialScore: { away: 10, home: 31 },
    clockLabel: "Final",
    assignedBloggerId: LEAD_VOICE_ID,
    demo: true,
    feedNote:
      "DEN @ KC Monday night archive — not a live wire. Sources: ESPN recap gameId 401872931. X crawl metrics cited in digest only. Injury beats skipped. Len, Boo silent.",
  },
];

export const publicLiveEntries: FeedEntry[] = [
  ...melbourneDemoEntries,
  ...dalNygSnfDemoEntries,
  ...denKcMnfDemoEntries,
];
