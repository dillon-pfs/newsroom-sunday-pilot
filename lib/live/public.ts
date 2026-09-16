import { getVoice, listVoices, voiceToBlogger } from "@/lib/cast";
import { games, publicLiveEntries } from "@/lib/live/catalog";
import type { Blogger, FeedEntry, Game } from "@/lib/types";

export function listPublicGames(): Game[] {
  return games;
}

export function getPublicGame(id: string): Game | undefined {
  if (id === "demo") {
    return games.find((game) => game.id === "sunday-pilot");
  }
  return games.find((game) => game.id === id);
}

export function getBlogger(id: string): Blogger | undefined {
  const voice = getVoice(id);
  return voice ? voiceToBlogger(voice) : undefined;
}

export function listBloggers(): Blogger[] {
  return listVoices().map(voiceToBlogger);
}

export function getPublicLiveBlog(gameId: string): FeedEntry[] {
  const game = getPublicGame(gameId);
  if (!game?.liveBlogEnabled) {
    return [];
  }
  const id = game.id;
  return publicLiveEntries.filter((entry) => entry.gameId === id);
}

export function gamesForBlogger(bloggerId: string): Game[] {
  const voice = getVoice(bloggerId);
  if (!voice) return [];
  return games.filter((game) => game.assignedBloggerId === voice.slug);
}

/** Public DEMO timelines where a named voice has a labeled SATIRE line. */
export function demoGamesForVoice(voiceId: string): Game[] {
  const gameIds = new Set(
    publicLiveEntries
      .filter((entry) => entry.demo && entry.satire?.some((line) => line.voiceId === voiceId))
      .map((entry) => entry.gameId),
  );
  return games.filter((game) => game.demo && gameIds.has(game.id));
}

export function voicesForDemoGame(gameId: string) {
  const ids = new Set(
    getPublicLiveBlog(gameId).flatMap((entry) => entry.satire?.map((line) => line.voiceId) ?? []),
  );
  return listVoices().filter((voice) => ids.has(voice.slug));
}
