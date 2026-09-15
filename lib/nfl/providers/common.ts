import { CONFIG } from "../config.ts";
import type { GameState, NflGame, SeasonType } from "../types.ts";

export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected an object");
  return value as Record<string, unknown>;
}
export function array(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error("Expected an array");
  return value;
}
export function string(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new Error("Expected a nonempty string");
  return value;
}
export function integer(value: unknown, min = 0, max = 9999): number {
  if (value === null || value === undefined || value === "" || typeof value === "boolean") throw new Error("Missing integer");
  const n = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
  if (typeof n !== "number" || !Number.isInteger(n) || n < min || n > max) throw new Error("Invalid integer");
  return n;
}
export function score(value: unknown, required: boolean): number | null {
  if (value === null || value === undefined || value === "") {
    if (required) throw new Error("Missing live/final score");
    return null;
  }
  return integer(value, 0, 150);
}
export function date(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const result = new Date(string(value));
  if (!Number.isFinite(result.getTime())) throw new Error("Invalid date");
  return result.toISOString();
}

const TEAMS = new Set("ARI ATL BAL BUF CAR CHI CIN CLE DAL DEN DET GB HOU IND JAX KC LAC LAR LV MIA MIN NE NO NYG NYJ PHI PIT SEA SF TB TEN WSH".split(" "));
const ALIASES: Record<string, string> = { WAS: "WSH", WSH: "WSH", JAC: "JAX", LA: "LAR", OAK: "LV", SD: "LAC", STL: "LAR" };
export function teamCode(value: unknown): string {
  const raw = string(value).toUpperCase();
  const code = ALIASES[raw] ?? raw;
  if (!TEAMS.has(code)) throw new Error("Unknown NFL team");
  return code;
}
export function seasonType(value: unknown): SeasonType {
  const map: Record<string, SeasonType> = { preseason: 1, regular: 2, regular_season: 2, postseason: 3 };
  if (typeof value === "string" && map[value]) return map[value];
  return integer(value, 1, 3) as SeasonType;
}
export function identityKey(game: Pick<NflGame, "season" | "seasonType" | "home" | "away">): string {
  // NFL opponents meet at most once in this home/away configuration per phase.
  // Date and week are deliberately excluded to preserve rescheduled game IDs.
  return `${game.season}:${game.seasonType}:${game.away.id}:${game.home.id}`;
}
export function validateGames(games: NflGame[]): NflGame[] {
  const seen = new Set<string>();
  for (const game of games) {
    const key = identityKey(game);
    if (seen.has(key) || game.home.id === game.away.id) throw new Error("Duplicate or invalid matchup");
    seen.add(key);
  }
  return games.sort((a, b) => (a.kickoffAt ?? "z").localeCompare(b.kickoffAt ?? "z") || a.id.localeCompare(b.id));
}
export function requiredScore(state: GameState): boolean {
  return state === "in_progress" || state === "final";
}
export type Fetcher = typeof fetch;
export async function fetchJson(url: URL, headers: HeadersInit = {}, fetcher: Fetcher = fetch): Promise<unknown> {
  const response = await fetcher(url, {
    headers: { Accept: "application/json", ...headers },
    cache: "no-store",
    signal: AbortSignal.timeout(CONFIG.providerTimeoutMs),
  });
  if (!response.ok) throw new Error(`Provider HTTP ${response.status}`);
  return response.json() as Promise<unknown>;
}
