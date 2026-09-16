import type { Blogger } from "@/lib/types";

export const LEAD_VOICE_ID = "chip-absolute";

export type Voice = {
  slug: string;
  name: string;
  desk: string;
  title: string;
  lens: string;
  bio: string;
  initials: string;
  mark: string;
  avatar: string;
};

export const CAST: Voice[] = [
  {
    slug: "chip-absolute",
    name: "Chip Absolute",
    desk: "Poor Form Desk",
    title: "Lead",
    lens: "Absolute takes. Scoreboard theater. No notes.",
    bio: "House lead for Poor Form Sports. Files SATIRE after official facts land — never instead of them. Absolute about the scoreboard, allergic to invented clocks.",
    initials: "CA",
    mark: "#c41e12",
    avatar: "/cast/chip-absolute.png",
  },
  {
    slug: "wes-process",
    name: "Wes Process",
    desk: "Poor Form Desk",
    title: "Process",
    lens: "Downs, bruises, results that are not luck.",
    bio: "Reads the play as a process outcome. Fourth downs, stuffed sneaks, and the bruise that follows. Does not recast a stop as fortune.",
    initials: "WP",
    mark: "#3d4f3a",
    avatar: "/cast/wes-process.png",
  },
  {
    slug: "layover-len",
    name: "Layover Len",
    desk: "Poor Form Desk",
    title: "Travel",
    lens: "Who packed when. Time zones as a matchup.",
    bio: "Travel desk. Arrival windows, carry-ons, and the week someone actually spent in the city. Logistics are the preview.",
    initials: "LL",
    mark: "#2a4a6e",
    avatar: "/cast/layover-len.png",
  },
  {
    slug: "boo-atlas",
    name: "Boo Atlas",
    desk: "Poor Form Desk",
    title: "Crowd",
    lens: "Throats as evidence. Neutral sites that aren't.",
    bio: "Maps the room. Boos, adoptions, and dissenting opinions from the stands. A designated home jersey is not a designated welcome.",
    initials: "BA",
    mark: "#6b2d5b",
    avatar: "/cast/boo-atlas.png",
  },
  {
    slug: "chyron-carl",
    name: "Chyron Carl",
    desk: "Poor Form Desk",
    title: "Graphics",
    lens: "Lower-thirds. Silent on Melbourne; one MNF platform beat.",
    bio: "Chyron and scoreboard graphics. Silent on Melbourne. One SATIRE line on MNF platform spectacle — celebrity as TV meta, not a play.",
    initials: "CC",
    mark: "#4a5560",
    avatar: "/cast/chyron-carl.png",
  },
  {
    slug: "postcard-pete",
    name: "Postcard Pete",
    desk: "Poor Form Desk",
    title: "Place",
    lens: "The city as a postcard. Anti-coronation on Week 1 debuts.",
    bio: "Place desk. Silent on the Melbourne tape. Files anti-coronation on SNF/MNF debuts — cool tape, still a postcard.",
    initials: "PP",
    mark: "#8a5a2b",
    avatar: "/cast/postcard-pete.png",
  },
  {
    slug: "poor-form-desk",
    name: "Poor Form Desk",
    desk: "Poor Form Desk",
    title: "House",
    lens: "The stamp on the strip. House voice, house clock.",
    bio: "House desk for Poor Form Sports. Carries the PFS mark and the cast strip. Not a SATIRE column — the desk the named voices file through after official facts land.",
    initials: "PFS",
    mark: "#0e0c0b",
    avatar: "/cast/poor-form-desk.png",
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
