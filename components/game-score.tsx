import { Badge } from "@/components/ui/badge";
import { formatScore, statusLabel } from "@/lib/copy";
import type { Game, GameStatus, OfficialScore } from "@/lib/types";

export function GameScore({
  game,
  score = game.officialScore,
  status = game.status,
  clockLabel = game.clockLabel,
  simulated = false,
}: {
  game: Game;
  score?: OfficialScore;
  status?: GameStatus;
  clockLabel?: string | null;
  simulated?: boolean;
}) {
  return (
    <section className="border border-ink/15 bg-card px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
            {game.windowLabel}
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {game.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {simulated ? (
            <Badge className="bg-sim text-sim-foreground font-mono text-[10px] tracking-wide uppercase">
              Simulated
            </Badge>
          ) : (
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              Public live
            </Badge>
          )}
          <Badge variant="secondary" className="font-mono text-[10px] uppercase">
            {statusLabel(status)}
          </Badge>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div>
          <p className="font-mono text-5xl font-medium tracking-tight sm:text-6xl">
            {formatScore(score.away)}
          </p>
          <p className="mt-1 font-heading text-lg">{game.away.name}</p>
          <p className="font-mono text-xs tracking-wide text-ink/50 uppercase">
            {game.away.short} · Away
          </p>
        </div>
        <div className="text-center font-mono text-xs tracking-wide text-ink/45 uppercase">
          <p>{clockLabel ?? "No official clock"}</p>
          <p className="mt-1 text-ink/30">vs</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-5xl font-medium tracking-tight sm:text-6xl">
            {formatScore(score.home)}
          </p>
          <p className="mt-1 font-heading text-lg">{game.home.name}</p>
          <p className="font-mono text-xs tracking-wide text-ink/50 uppercase">
            {game.home.short} · Home
          </p>
        </div>
      </div>
    </section>
  );
}
