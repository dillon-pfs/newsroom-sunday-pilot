import type { Blogger, FeedEntry, Game } from "@/lib/types";

/**
 * Public-live catalog only. Do not import simulated replay data here.
 * Scores stay empty until an official fact source exists — this pilot
 * does not invent live results on the public path.
 */

export const PUBLIC_FEED_PATH = "public-live" as const;

export const bloggers: Blogger[] = [
  {
    id: "lead-blogger",
    name: "Lead Blogger",
    desk: "Sunday desk",
    title: "Lead Blogger",
    bio: "House voice for the Sunday pilot. Writes character commentary after official facts land — never instead of them.",
    voiceNote:
      "Commentary is voice, not a scoreboard. If the desk does not have an official update, Lead Blogger does not fill the silence with a guess.",
  },
];

export const games: Game[] = [
  {
    id: "sunday-pilot",
    name: "Sunday Pilot Game",
    away: { id: "greyshirts", name: "Greyshirts", short: "GRY" },
    home: { id: "red-caps", name: "Red Caps", short: "CAP" },
    status: "awaiting_official",
    windowLabel: "Sunday window",
    liveBlogEnabled: true,
    officialScore: { away: null, home: null },
    clockLabel: null,
    assignedBloggerId: "lead-blogger",
    feedNote:
      "Public live path. Official score pending. Simulated replay is not loaded here.",
  },
  {
    id: "late-window",
    name: "Late Window Desk Game",
    away: { id: "night-owls", name: "Night Owls", short: "OWL" },
    home: { id: "blue-pencils", name: "Blue Pencils", short: "PEN" },
    status: "scheduled",
    windowLabel: "Late window",
    liveBlogEnabled: false,
    officialScore: { away: null, home: null },
    clockLabel: null,
    assignedBloggerId: null,
    feedNote:
      "Editorial has not enabled a live blog. Scoreboard listing only.",
  },
];

/** Official / desk hooks only. No play-by-play, no invented scores. */
export const publicLiveEntries: FeedEntry[] = [
  {
    id: "desk-open-sunday-pilot",
    gameId: "sunday-pilot",
    kind: "status",
    authorId: "lead-blogger",
    headline: "Desk is open",
    body: "Live blog is on for this game because editorial enabled it. Waiting on official facts. Character commentary will not invent a result.",
    postedAtLabel: "Desk open",
    path: PUBLIC_FEED_PATH,
  },
];
