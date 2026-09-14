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
