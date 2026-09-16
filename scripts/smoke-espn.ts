import { fetchEspn } from "../lib/nfl/providers/espn.ts";
import { selectedWeek } from "../lib/nfl/config.ts";

const games = await fetchEspn(selectedWeek());
console.log(JSON.stringify({ provider: "espn", count: games.length, games: games.map(game => ({
  id: game.id, away: game.away.abbreviation, home: game.home.abbreviation,
  score: [game.away.score, game.home.score], state: game.state, status: game.statusLabel,
})) }, null, 2));
