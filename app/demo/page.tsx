import { GameView } from "@/components/game-view";

export const metadata = {
  title: "DEMO · SF 27–LAR 7 Melbourne",
};

export default function DemoPage() {
  return <GameView id="sunday-pilot" paused={false} />;
}
