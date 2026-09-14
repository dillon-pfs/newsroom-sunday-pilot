/**
 * Review-only SIMULATED fixture. Import from /review, never from public pages.
 * Greyshirts / Red Caps are desk aliases for the tape — not public teams.
 */
import type { Game } from "@/lib/types";

export function getSimulatedFixture(): Game {
  return {
    id: "simulated-desk",
    name: "SIMULATED desk aliases",
    away: { id: "greyshirts", name: "Greyshirts", short: "GRY" },
    home: { id: "red-caps", name: "Red Caps", short: "CAP" },
    status: "in_progress",
    windowLabel: "Review tape",
    liveBlogEnabled: true,
    officialScore: { away: 0, home: 0 },
    clockLabel: "Pregame",
    assignedBloggerId: null,
    simulated: true,
    feedNote:
      "Greyshirts and Red Caps are SIMULATED desk aliases for /review only. They are not public teams and are not the Melbourne DEMO.",
  };
}
