import type { WeekSelection } from "./types.ts";

export const CONFIG = {
  providerTimeoutMs: 3_000,
  espnRefreshMs: 20_000,
  backupRefreshMs: 30_000,
  livePollMs: 15_000,
  scheduledPollMs: 120_000,
  finalPollMs: 300_000,
  staleAfterMs: 90_000,
  lockMs: 25_000,
  failureThreshold: 3,
  cooldownMs: 300_000,
} as const;

export function selectedWeek(env: Record<string, string | undefined> = process.env): WeekSelection | undefined {
  const raw = [env.NFL_SEASON, env.NFL_SEASON_TYPE, env.NFL_WEEK];
  if (raw.every(v => !v)) return undefined;
  if (!raw.every(v => v && /^\d+$/.test(v))) throw new Error("Set all three NFL week variables to integers");
  const [season, seasonType, week] = raw.map(Number);
  if (season < 2002 || season > 2100 || ![1, 2, 3].includes(seasonType) || week < 1 || week > 25) {
    throw new Error("Invalid NFL week selection");
  }
  return { season, seasonType: seasonType as 1 | 2 | 3, week };
}
