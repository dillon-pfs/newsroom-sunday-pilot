import type { GameState, NflGame, WeekSelection } from "../types.ts";
import { array, date, fetchJson, identityKey, integer, object, requiredScore, score, seasonType, string, teamCode, validateGames } from "./common.ts";
import type { Fetcher } from "./common.ts";

const STATES = new Set<GameState>(["scheduled", "in_progress", "final", "delayed", "postponed", "suspended", "canceled", "abandoned", "unknown"]);

export function normalizeBalldontlie(input: unknown, fetchedAt: string, selection?: WeekSelection): NflGame[] {
  const root = object(input);
  if (root.meta && object(root.meta).next_cursor != null) throw new Error("Backup response is incomplete (pagination)");
  return validateGames(array(root.data).map((value): NflGame => {
    const raw = object(value);
    const label = typeof raw.status === "string" ? raw.status : "Status unavailable";
    const state: GameState = STATES.has(raw.status_state as GameState) ? raw.status_state as GameState :
      /^final/i.test(label) ? "final" : "unknown";
    const mapTeam = (value: unknown, valueScore: unknown) => {
      const team = object(value);
      const abbreviation = teamCode(team.abbreviation);
      return { id: abbreviation, abbreviation, name: string(team.full_name ?? team.name),
        score: state === "scheduled" ? null : score(valueScore, requiredScore(state)) };
    };
    // Current Games responses may omit season_type. An explicit query establishes
    // the phase; auto-date requests are restricted to regular/postseason.
    const phase = raw.season_type != null ? seasonType(raw.season_type) :
      selection?.seasonType ?? (raw.postseason === true ? 3 : raw.postseason === false ? 2 : null);
    if (!phase) throw new Error("Backup season phase unavailable");
    const game: NflGame = {
      id: "", providerIds: { balldontlie: String(integer(raw.id, 1, Number.MAX_SAFE_INTEGER)) },
      season: integer(raw.season, 2002, 2100), seasonType: phase,
      week: integer(raw.week, 1, 25), kickoffAt: date(raw.date), state, statusLabel: label,
      period: null, clock: null, possessionTeamId: null,
      home: mapTeam(raw.home_team, raw.home_team_score),
      away: mapTeam(raw.visitor_team, raw.visitor_team_score),
      source: "balldontlie", fetchedAt, sourceUpdatedAt: null, blogUrl: null,
    };
    game.id = `nfl:${identityKey(game)}`;
    if (selection && (game.season !== selection.season || game.seasonType !== selection.seasonType || game.week !== selection.week)) {
      throw new Error("Backup returned a different week");
    }
    return game;
  }));
}

export async function fetchBalldontlie(key: string, selection?: WeekSelection, fetcher: Fetcher = fetch, now = new Date()): Promise<NflGame[]> {
  if (!key) throw new Error("Backup key is not configured");
  const url = new URL("https://api.balldontlie.io/nfl/v1/games");
  url.searchParams.set("per_page", "100");
  if (selection) {
    url.searchParams.append("seasons[]", String(selection.season));
    url.searchParams.append("weeks[]", String(selection.week));
    url.searchParams.append("season_types[]", String(selection.seasonType));
  } else {
    // Cold-start fallback: cover overnight games and the next seven days.
    // ESPN normally supplies the week; preseason requires an explicit selection.
    for (let offset = -1; offset <= 7; offset++) {
      const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offset));
      url.searchParams.append("dates[]", day.toISOString().slice(0, 10));
    }
    url.searchParams.append("season_types[]", "2");
    url.searchParams.append("season_types[]", "3");
  }
  const data = await fetchJson(url, { Authorization: key }, fetcher);
  return normalizeBalldontlie(data, new Date().toISOString(), selection);
}
