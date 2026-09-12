export type FeedPath = "public-live" | "simulated-review";

export type GameStatus =
  | "scheduled"
  | "awaiting_official"
  | "in_progress"
  | "final";

export type EntryKind =
  | "fact"
  | "commentary"
  | "correction"
  | "duplicate"
  | "status";

export type Team = {
  id: string;
  name: string;
  short: string;
};

export type OfficialScore = {
  away: number | null;
  home: number | null;
};

export type Game = {
  id: string;
  name: string;
  away: Team;
  home: Team;
  status: GameStatus;
  windowLabel: string;
  /** Editorial flag: live blog is off unless the desk turns this on. */
  liveBlogEnabled: boolean;
  officialScore: OfficialScore;
  clockLabel: string | null;
  assignedBloggerId: string | null;
  feedNote: string;
};

export type Blogger = {
  id: string;
  name: string;
  desk: string;
  title: string;
  bio: string;
  voiceNote: string;
};

export type FeedEntry = {
  id: string;
  gameId: string;
  kind: EntryKind;
  authorId: string | null;
  headline: string;
  body: string;
  postedAtLabel: string;
  correctsId?: string;
  duplicateOfId?: string;
  delayed?: boolean;
  path: FeedPath;
};

export type SimulatedBeat = FeedEntry & {
  path: "simulated-review";
  atMs: number;
  scoreAfter?: { away: number; home: number };
  clockLabel?: string;
  gameStatus?: GameStatus;
};
