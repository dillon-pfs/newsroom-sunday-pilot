/** Public score data. Never import the review replay into this module. */
export type Provider = "espn" | "balldontlie";
export type SeasonType = 1 | 2 | 3;
export type GameState = "scheduled" | "in_progress" | "final" | "delayed" |
  "postponed" | "suspended" | "canceled" | "abandoned" | "unknown";

export interface WeekSelection {
  season: number;
  seasonType: SeasonType;
  week: number;
}

export interface ScoreboardTeam {
  id: string;
  abbreviation: string;
  name: string;
  score: number | null;
}

export interface NflGame {
  id: string;
  providerIds: Partial<Record<Provider, string>>;
  season: number;
  seasonType: SeasonType;
  week: number;
  kickoffAt: string | null;
  state: GameState;
  statusLabel: string;
  period: number | null;
  clock: string | null;
  possessionTeamId: string | null;
  home: ScoreboardTeam;
  away: ScoreboardTeam;
  source: Provider;
  fetchedAt: string;
  sourceUpdatedAt: string | null;
  blogUrl: string | null;
}

export interface ScoreboardResponse {
  games: NflGame[];
  availability: "fresh" | "stale" | "unavailable";
  lastSuccessfulFetchAt: string | null;
  lastAttemptAt: string | null;
  nextPollMs: number;
  staleAfterMs: number;
}

export interface Snapshot {
  games: NflGame[];
  fetchedAt: string;
  source: Provider;
}

export interface SavedState {
  snapshot: Snapshot | null;
  lastAttemptAt: string | null;
  lastAttemptFailed: boolean;
  nextRefreshAt: number;
  espnFailures: number;
  espnRetryAt: number;
  identities: Record<string, { id: string; providerIds: Partial<Record<Provider, string>> }>;
}

export interface Store {
  read(key: string): Promise<SavedState | null>;
  acquire(key: string, token: string): Promise<boolean>;
  save(key: string, token: string, state: SavedState): Promise<boolean>;
  release(key: string, token: string): Promise<void>;
  reserve(provider: Provider, intervalMs: number): Promise<boolean>;
}
