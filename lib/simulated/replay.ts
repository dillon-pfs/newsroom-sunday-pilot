/**
 * SIMULATED replay tape. Import only from the private review desk.
 * Never import this module from public-live pages, layouts, or APIs.
 */
import type { SimulatedBeat } from "@/lib/types";

export const SIMULATED_GAME_ID = "sunday-pilot";

export const SIMULATED_REEL_MS = 30_000;

export const simulatedBeats: SimulatedBeat[] = [
  {
    id: "sim-armed",
    gameId: SIMULATED_GAME_ID,
    kind: "status",
    authorId: null,
    headline: "Replay armed",
    body: "This reel is a desk rehearsal. It is not a public live fact source.",
    postedAtLabel: "0:00",
    path: "simulated-review",
    atMs: 400,
    clockLabel: "Pregame",
    gameStatus: "scheduled",
    scoreAfter: { away: 0, home: 0 },
  },
  {
    id: "sim-kickoff",
    gameId: SIMULATED_GAME_ID,
    kind: "status",
    authorId: null,
    headline: "Kickoff window (fixture)",
    body: "SIMULATED kickoff for Sunday Pilot Game. Do not copy this clock to the public scoreboard.",
    postedAtLabel: "0:02",
    path: "simulated-review",
    atMs: 2_000,
    clockLabel: "Q1 15:00",
    gameStatus: "in_progress",
    scoreAfter: { away: 0, home: 0 },
  },
  {
    id: "sim-first-down",
    gameId: SIMULATED_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Greyshirts first down",
    body: "SIMULATED fact hook: Greyshirts convert at midfield. Treat as tape, not a live report.",
    postedAtLabel: "0:05",
    path: "simulated-review",
    atMs: 5_000,
    clockLabel: "Q1 12:40",
    gameStatus: "in_progress",
    scoreAfter: { away: 0, home: 0 },
  },
  {
    id: "sim-first-down-dup",
    gameId: SIMULATED_GAME_ID,
    kind: "duplicate",
    authorId: null,
    headline: "Greyshirts first down",
    body: "Same payload arrived twice. Desk should collapse this, not double-count it.",
    postedAtLabel: "0:05",
    path: "simulated-review",
    atMs: 5_400,
    duplicateOfId: "sim-first-down",
    clockLabel: "Q1 12:40",
    gameStatus: "in_progress",
    scoreAfter: { away: 0, home: 0 },
  },
  {
    id: "sim-comment-1",
    gameId: SIMULATED_GAME_ID,
    kind: "commentary",
    authorId: "lead-blogger",
    headline: "Lead Blogger",
    body: "If this were a real snap I'd wait for the official spot. The funnier line can wait thirty seconds.",
    postedAtLabel: "0:08",
    path: "simulated-review",
    atMs: 8_000,
    clockLabel: "Q1 12:40",
    gameStatus: "in_progress",
  },
  {
    id: "sim-correction",
    gameId: SIMULATED_GAME_ID,
    kind: "correction",
    authorId: null,
    headline: "Correction: spot was the 48",
    body: "Corrects the midfield hook. Resilience stub: a later fact replaces the earlier one instead of sitting beside it as truth.",
    postedAtLabel: "0:11",
    path: "simulated-review",
    atMs: 11_000,
    correctsId: "sim-first-down",
    clockLabel: "Q1 12:38",
    gameStatus: "in_progress",
  },
  {
    id: "sim-score",
    gameId: SIMULATED_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Red Caps score",
    body: "SIMULATED score: Red Caps 7, Greyshirts 0. Not an official public result.",
    postedAtLabel: "0:14",
    path: "simulated-review",
    atMs: 14_000,
    clockLabel: "Q1 8:12",
    gameStatus: "in_progress",
    scoreAfter: { away: 0, home: 7 },
  },
  {
    id: "sim-delayed",
    gameId: SIMULATED_GAME_ID,
    kind: "status",
    authorId: null,
    headline: "Updates delayed",
    body: "Feed hitch on the rehearsal wire. Banner stays up until the next recovered beat — or until you unpause.",
    postedAtLabel: "0:17",
    path: "simulated-review",
    atMs: 17_000,
    delayed: true,
    clockLabel: "Q1 8:12",
    gameStatus: "in_progress",
  },
  {
    id: "sim-recovered",
    gameId: SIMULATED_GAME_ID,
    kind: "status",
    authorId: null,
    headline: "Feed recovered",
    body: "Wire is back. Public live would still show official stubs only.",
    postedAtLabel: "0:20",
    path: "simulated-review",
    atMs: 20_000,
    clockLabel: "Q1 6:05",
    gameStatus: "in_progress",
  },
  {
    id: "sim-comment-2",
    gameId: SIMULATED_GAME_ID,
    kind: "commentary",
    authorId: "lead-blogger",
    headline: "Lead Blogger",
    body: "Delayed is honest. Inventing the next score to keep the timeline moving is how a desk gets fired.",
    postedAtLabel: "0:22",
    path: "simulated-review",
    atMs: 22_000,
    clockLabel: "Q1 6:05",
    gameStatus: "in_progress",
  },
  {
    id: "sim-tie",
    gameId: SIMULATED_GAME_ID,
    kind: "fact",
    authorId: null,
    headline: "Greyshirts answer",
    body: "SIMULATED score: 7–7. End of the sample reel after one more desk note.",
    postedAtLabel: "0:25",
    path: "simulated-review",
    atMs: 25_000,
    clockLabel: "Q1 1:44",
    gameStatus: "in_progress",
    scoreAfter: { away: 7, home: 7 },
  },
  {
    id: "sim-end",
    gameId: SIMULATED_GAME_ID,
    kind: "status",
    authorId: null,
    headline: "Sample reel complete",
    body: "Pause, rewind, or replay. None of these beats ship on / or /games.",
    postedAtLabel: "0:29",
    path: "simulated-review",
    atMs: 29_000,
    clockLabel: "Q1 1:44",
    gameStatus: "in_progress",
    scoreAfter: { away: 7, home: 7 },
  },
];

export function beatsThrough(cursorMs: number): SimulatedBeat[] {
  return simulatedBeats.filter((beat) => beat.atMs <= cursorMs);
}

export function scoreAt(cursorMs: number): { away: number; home: number } {
  const withScore = [...beatsThrough(cursorMs)]
    .reverse()
    .find((beat) => beat.scoreAfter);
  return withScore?.scoreAfter ?? { away: 0, home: 0 };
}

export function clockAt(cursorMs: number): string {
  const withClock = [...beatsThrough(cursorMs)]
    .reverse()
    .find((beat) => beat.clockLabel);
  return withClock?.clockLabel ?? "Pregame";
}

export function statusAt(cursorMs: number) {
  const withStatus = [...beatsThrough(cursorMs)]
    .reverse()
    .find((beat) => beat.gameStatus);
  return withStatus?.gameStatus ?? "scheduled";
}

export function delayedAt(cursorMs: number): boolean {
  const visible = beatsThrough(cursorMs);
  const lastDelay = [...visible].reverse().find((beat) => beat.delayed);
  if (!lastDelay) return false;
  const recovered = visible.some(
    (beat) => beat.atMs > lastDelay.atMs && beat.id === "sim-recovered",
  );
  return !recovered;
}

export const SIMULATED_TICK_MS = 200;

export function serializeReplayTape() {
  return {
    reelMs: SIMULATED_REEL_MS,
    tickMs: SIMULATED_TICK_MS,
    firstBeatMs: simulatedBeats[0]?.atMs ?? 400,
    beats: simulatedBeats,
  };
}

export function clampCursor(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(value, SIMULATED_REEL_MS);
}
