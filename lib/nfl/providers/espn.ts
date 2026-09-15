import type { GameState, NflGame, WeekSelection } from "../types.ts";
import { array, date, fetchJson, identityKey, integer, object, requiredScore, score, seasonType, string, teamCode, validateGames } from "./common.ts";
import type { Fetcher } from "./common.ts";

const STATES: Record<string, GameState> = {
  STATUS_SCHEDULED: "scheduled", STATUS_PREGAME: "scheduled",
  STATUS_IN_PROGRESS: "in_progress", STATUS_HALFTIME: "in_progress", STATUS_END_PERIOD: "in_progress",
  STATUS_FINAL: "final", STATUS_FINAL_OVERTIME: "final", STATUS_FINAL_OVERTIME2: "final",
  STATUS_DELAYED: "delayed", STATUS_POSTPONED: "postponed", STATUS_SUSPENDED: "suspended",
  STATUS_CANCELED: "canceled", STATUS_CANCELLED: "canceled", STATUS_ABANDONED: "abandoned",
};

export function normalizeEspn(input: unknown, fetchedAt: string, selection?: WeekSelection): NflGame[] {
  const root = object(input);
  const games = array(root.events).map((value): NflGame => {
    const event = object(value);
    const eventSeason = object(event.season ?? root.season);
    const competitions = array(event.competitions);
    if (competitions.length !== 1) throw new Error("Unexpected NFL competition count");
    const competition = object(competitions[0]);
    const status = object(competition.status ?? event.status);
    const type = object(status.type);
    const state = STATES[String(type.name)] ??
      (type.state === "in" ? "in_progress" : type.state === "pre" ? "scheduled" : "unknown");
    const competitors = array(competition.competitors).map(object);
    if (competitors.length !== 2) throw new Error("Expected two competitors");
    const home = competitors.find(c => c.homeAway === "home");
    const away = competitors.find(c => c.homeAway === "away");
    if (!home || !away) throw new Error("Missing home/away team");
    const mapTeam = (competitor: Record<string, unknown>) => {
      const team = object(competitor.team);
      const abbreviation = teamCode(team.abbreviation);
      return {
        id: abbreviation, abbreviation,
        name: string(team.shortDisplayName ?? team.displayName ?? team.name),
        score: state === "scheduled" ? null : score(competitor.score, requiredScore(state)),
      };
    };
    const situation = competition.situation ? object(competition.situation) : null;
    const possession = situation?.possession;
    const possessionTeam = possession === undefined ? undefined : competitors.find(c => String(c.id) === String(possession));
    const game: NflGame = {
      id: "", providerIds: { espn: string(event.id) },
      season: integer(eventSeason.year, 2002, 2100),
      seasonType: seasonType(eventSeason.type),
      week: integer(object(event.week ?? root.week).number, 1, 25),
      kickoffAt: date(event.date), state,
      statusLabel: string(type.shortDetail ?? type.detail ?? type.description ?? "Status unavailable"),
      period: state === "in_progress" && status.period != null ? integer(status.period, 0, 20) : null,
      clock: state === "in_progress" && typeof status.displayClock === "string" && /^\d{1,2}:\d{2}$/.test(status.displayClock) ? status.displayClock : null,
      possessionTeamId: state === "in_progress" && possessionTeam ? teamCode(object(possessionTeam.team).abbreviation) : null,
      home: mapTeam(home), away: mapTeam(away), source: "espn", fetchedAt,
      sourceUpdatedAt: null, blogUrl: null,
    };
    game.id = `nfl:${identityKey(game)}`;
    if (selection && (game.season !== selection.season || game.seasonType !== selection.seasonType || game.week !== selection.week)) {
      throw new Error("ESPN returned a different week");
    }
    return game;
  });
  return validateGames(games);
}

export async function fetchEspn(selection?: WeekSelection, fetcher: Fetcher = fetch): Promise<NflGame[]> {
  const url = new URL("https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard");
  url.searchParams.set("limit", "100");
  if (selection) {
    url.searchParams.set("dates", String(selection.season));
    url.searchParams.set("seasontype", String(selection.seasonType));
    url.searchParams.set("week", String(selection.week));
  }
  const data = await fetchJson(url, {}, fetcher);
  return normalizeEspn(data, new Date().toISOString(), selection);
}
