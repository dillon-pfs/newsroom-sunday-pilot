import { CONFIG, selectedWeek } from "./config.ts";
import { getStore } from "./cache.ts";
import { fetchEspn } from "./providers/espn.ts";
import { fetchBalldontlie } from "./providers/balldontlie.ts";
import { identityKey } from "./providers/common.ts";
import { forcedProviderFailure, smokeOutage } from "./smoke-outage.ts";
import type { NflGame, Provider, SavedState, ScoreboardResponse, Store, WeekSelection } from "./types.ts";

export function emptyState(): SavedState {
  return { snapshot: null, lastAttemptAt: null, lastAttemptFailed: false,
    nextRefreshAt: 0, espnFailures: 0, espnRetryAt: 0, identities: {} };
}

function refreshInterval(games: NflGame[], now: number): number {
  if (games.some(g => ["in_progress", "delayed", "suspended", "unknown"].includes(g.state))) return CONFIG.espnRefreshMs;
  if (games.some(g => g.state === "scheduled" && g.kickoffAt &&
    Math.abs(Date.parse(g.kickoffAt) - now) < 3_600_000)) return CONFIG.espnRefreshMs;
  return games.some(g => g.state === "scheduled") ? CONFIG.scheduledPollMs : CONFIG.finalPollMs;
}

export function publicResponse(state: SavedState, now: number, forceStale = false): ScoreboardResponse {
  const snapshot = state.snapshot;
  const interval = snapshot ? refreshInterval(snapshot.games, now) : CONFIG.espnRefreshMs;
  const staleAfterMs = Math.max(CONFIG.staleAfterMs, interval + 30_000);
  const stale = forceStale || state.lastAttemptFailed ||
    (snapshot !== null && now - Date.parse(snapshot.fetchedAt) > staleAfterMs);
  return {
    games: snapshot?.games ?? [],
    availability: !snapshot ? "unavailable" : stale ? "stale" : "fresh",
    lastSuccessfulFetchAt: snapshot?.fetchedAt ?? null,
    lastAttemptAt: state.lastAttemptAt,
    nextPollMs: stale || !snapshot || interval === CONFIG.espnRefreshMs ? CONFIG.livePollMs : interval,
    staleAfterMs,
  };
}

function sameWeek(a: NflGame, b: NflGame): boolean {
  return a.season === b.season && a.seasonType === b.seasonType && a.week === b.week;
}

export function checkContinuity(games: NflGame[], previous: NflGame[], now: number, pinned: boolean): void {
  for (const old of previous) {
    const next = games.find(g => identityKey(g) === identityKey(old));
    const active = ["in_progress", "delayed", "suspended"].includes(old.state);
    const imminent = old.state === "scheduled" && old.kickoffAt && Math.abs(Date.parse(old.kickoffAt) - now) < 3_600_000;
    const withinSameWeek = games.some(g => sameWeek(g, old));
    // An absent active game is never interpreted as an empty slate.
    // Finals/scheduled games may leave the automatic current-week window.
    if (!next && (active || imminent || pinned || withinSameWeek)) throw new Error("Expected game missing from feed");
    if (next && old.state === "final" && ["scheduled", "in_progress"].includes(next.state)) {
      throw new Error("Provider returned a game state older than the saved final");
    }
    if (next && old.state === "in_progress" && next.state === "scheduled") {
      throw new Error("Provider returned a pregame snapshot for an active game");
    }
    // Score reductions are allowed: reviews and official corrections can remove points.
  }
}

function backupWeek(previous: NflGame[], now: number): WeekSelection | undefined {
  // Reuse a known week only while it still has relevant unfinished games.
  // Once that slate finishes, the backup searches a rolling date window.
  const game = previous.find(g => ["in_progress", "delayed", "suspended"].includes(g.state) ||
    (g.state === "scheduled" && g.kickoffAt && Date.parse(g.kickoffAt) > now - 86_400_000));
  return game ? { season: game.season, seasonType: game.seasonType, week: game.week } : undefined;
}

interface Dependencies {
  store: Store;
  now?: () => number;
  selection?: WeekSelection;
  espn: (selection?: WeekSelection) => Promise<NflGame[]>;
  backup?: (selection?: WeekSelection) => Promise<NflGame[]>;
  log?: (provider: Provider, error: unknown) => void;
}

export function createScoreboardService(deps: Dependencies) {
  const now = deps.now ?? Date.now;
  const key = deps.selection ? `${deps.selection.season}:${deps.selection.seasonType}:${deps.selection.week}` : "current";

  return async function scoreboard(): Promise<ScoreboardResponse> {
    let state = await deps.store.read(key) ?? emptyState();
    if (state.nextRefreshAt > now()) return publicResponse(state, now());
    const token = crypto.randomUUID();
    if (!await deps.store.acquire(key, token)) {
      // Cold callers retry shortly in the client; existing visitors keep saved scores.
      return publicResponse(state, now());
    }
    try {
      state = await deps.store.read(key) ?? state;
      if (state.nextRefreshAt > now()) return publicResponse(state, now());
      const previous = state.snapshot?.games ?? [];
      let games: NflGame[] | undefined;
      let source: Provider = "espn";
      let attempted = false;

      if (state.espnRetryAt <= now() && await deps.store.reserve("espn", CONFIG.espnRefreshMs)) {
        attempted = true;
        state.lastAttemptAt = new Date(now()).toISOString();
        try {
          games = await deps.espn(deps.selection);
          checkContinuity(games, previous, now(), Boolean(deps.selection));
          state.espnFailures = 0;
          state.espnRetryAt = 0;
        } catch (error) {
          games = undefined;
          state.espnFailures++;
          if (state.espnFailures >= CONFIG.failureThreshold) state.espnRetryAt = now() + CONFIG.cooldownMs;
          deps.log?.("espn", error);
        }
      }

      if (!games && deps.backup && await deps.store.reserve("balldontlie", CONFIG.backupRefreshMs)) {
        attempted = true;
        state.lastAttemptAt = new Date(now()).toISOString();
        try {
          games = await deps.backup(deps.selection ?? backupWeek(previous, now()));
          checkContinuity(games, previous, now(), Boolean(deps.selection));
          source = "balldontlie";
        } catch (error) {
          games = undefined;
          deps.log?.("balldontlie", error);
        }
      }

      if (games) {
        const fetchedAt = new Date(now()).toISOString();
        for (const game of games) {
          const identity = identityKey(game);
          const existing = state.identities[identity];
          game.id = existing?.id ?? game.id;
          game.providerIds = { ...existing?.providerIds, ...game.providerIds };
          state.identities[identity] = { id: game.id, providerIds: game.providerIds };
          game.fetchedAt = fetchedAt;
          // Editorial links are supplied separately by the public app component.
          game.blogUrl = null;
        }
        state.snapshot = { games, fetchedAt, source };
        state.lastAttemptFailed = false;
        const interval = refreshInterval(games, now());
        state.nextRefreshAt = now() + Math.max(interval, source === "balldontlie" ? CONFIG.backupRefreshMs : 0);
      } else {
        if (attempted) state.lastAttemptFailed = true;
        state.nextRefreshAt = now() + CONFIG.espnRefreshMs;
      }

      if (!await deps.store.save(key, token, state)) {
        return publicResponse(await deps.store.read(key) ?? emptyState(), now(), true);
      }
      return publicResponse(state, now());
    } finally {
      await deps.store.release(key, token);
    }
  };
}

export async function getScoreboard(): Promise<ScoreboardResponse> {
  try {
    const outage = smokeOutage();
    return await createScoreboardService({
      store: getStore(), selection: selectedWeek(),
      espn: outage === "none" ? fetchEspn : forcedProviderFailure,
      backup: process.env.BALLDONTLIE_API_KEY
        ? outage === "all" ? forcedProviderFailure : selection => fetchBalldontlie(process.env.BALLDONTLIE_API_KEY!, selection)
        : undefined,
      log: (provider, error) => console.warn("[nfl] Provider refresh failed", { provider,
        reason: error instanceof Error ? error.message : "Unknown error" }),
    })();
  } catch (error) {
    // Never bypass the shared limiter when Redis is unavailable.
    console.error("[nfl] Score service unavailable", error instanceof Error ? error.message : "Unknown error");
    return publicResponse(emptyState(), Date.now());
  }
}
