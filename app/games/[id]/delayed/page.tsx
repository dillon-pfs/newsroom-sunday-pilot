import { GameView } from "@/components/game-view";
import { getPublicGame, listPublicGames } from "@/lib/live/public";

export function generateStaticParams() {
  return listPublicGames()
    .filter((game) => game.liveBlogEnabled)
    .map((game) => ({ id: game.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/games/[id]/delayed">) {
  const { id } = await params;
  const game = getPublicGame(id);
  return { title: game ? `${game.name} · Updates delayed` : "Game" };
}

export default async function DelayedGamePage({
  params,
}: PageProps<"/games/[id]/delayed">) {
  const { id } = await params;
  return <GameView id={id} paused />;
}
