import type { Blogger } from "@/lib/types";

export const LEAD_VOICE_ID = "chip-absolute";

export type Voice = {
  slug: string;
  name: string;
  desk: string;
  title: string;
  lens: string;
  bio: string;
};

export const CAST: Voice[] = [
  {
    slug: "chip-absolute",
    name: "Chip Absolute",
    desk: "Poor Form Desk",
    title: "Lead",
    lens: "Absolute takes. Scoreboard theater. No notes.",
    bio: "House lead for Poor Form Sports. Files SATIRE after official facts land — never instead of them. Absolute about the scoreboard, allergic to invented clocks.",
  },
  {
    slug: "wes-process",
    name: "Wes Process",
    desk: "Poor Form Desk",
    title: "Process",
    lens: "Downs, bruises, results that are not luck.",
    bio: "Reads the play as a process outcome. Fourth downs, stuffed sneaks, and the bruise that follows. Does not recast a stop as fortune.",
  },
  {
    slug: "layover-len",
    name: "Layover Len",
    desk: "Poor Form Desk",
    title: "Travel",
    lens: "Who packed when. Time zones as a matchup.",
    bio: "Travel desk. Arrival windows, carry-ons, and the week someone actually spent in the city. Logistics are the preview.",
  },
  {
    slug: "boo-atlas",
    name: "Boo Atlas",
    desk: "Poor Form Desk",
    title: "Crowd",
    lens: "Throats as evidence. Neutral sites that aren't.",
    bio: "Maps the room. Boos, adoptions, and dissenting opinions from the stands. A designated home jersey is not a designated welcome.",
  },
  {
    slug: "chyron-carl",
    name: "Chyron Carl",
    desk: "Poor Form Desk",
    title: "Graphics",
    lens: "Lower-thirds. Silent on this Melbourne DEMO.",
    bio: "Chyron and scoreboard graphics. Carl is on the masthead and stays silent on this backtest — no SATIRE line filed.",
  },
  {
    slug: "postcard-pete",
    name: "Postcard Pete",
    desk: "Poor Form Desk",
    title: "Place",
    lens: "The city as a postcard. Melbourne, not a chyron.",
    bio: "Place desk. The ground, the postcard, the continent. No lines on this Melbourne tape — Pete is listed so the strip is the full Poor Form cast.",
  },
];

export function getVoice(slug: string): Voice | undefined {
  const id = slug === "lead-blogger" ? LEAD_VOICE_ID : slug;
  return CAST.find((voice) => voice.slug === id);
}

export function voiceToBlogger(voice: Voice): Blogger {
  return {
    id: voice.slug,
    name: voice.name,
    desk: voice.desk,
    title: voice.title,
    bio: voice.bio,
    voiceNote: voice.lens,
  };
}

export function listVoices(): Voice[] {
  return CAST;
}
