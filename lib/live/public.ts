import { bloggers, games, publicLiveEntries } from "@/lib/live/catalog";
import type { Blogger, FeedEntry, Game } from "@/lib/types";

export function listPublicGames(): Game[] {
  return games;
}

export function getPublicGame(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}

export function getBlogger(id: string): Blogger | undefined {
  return bloggers.find((blogger) => blogger.id === id);
}

export function listBloggers(): Blogger[] {
  return bloggers;
}

export function getPublicLiveBlog(gameId: string): FeedEntry[] {
  const game = getPublicGame(gameId);
  if (!game?.liveBlogEnabled) {
    return [];
  }
  return publicLiveEntries.filter((entry) => entry.gameId === gameId);
}

export function gamesForBlogger(bloggerId: string): Game[] {
  return games.filter((game) => game.assignedBloggerId === bloggerId);
}
