import { GameView } from "@/components/game-view";
import { getPublicGame, listPublicGames } from "@/lib/live/public";

export function generateStaticParams() {
  return listPublicGames().map((game) => ({ id: game.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/games/[id]">) {
  const { id } = await params;
  const game = getPublicGame(id);
  return { title: game?.name ?? "Game" };
}

export default async function GamePage({
  params,
}: PageProps<"/games/[id]">) {
  const { id } = await params;
  return <GameView id={id} paused={false} />;
}
