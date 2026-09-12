import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatScore, statusLabel } from "@/lib/copy";
import type { Game } from "@/lib/types";

export function Scoreboard({
  games,
  sourceLabel = "Public live",
}: {
  games: Game[];
  sourceLabel?: string;
}) {
  if (games.length === 0) {
    return (
      <div className="border border-dashed border-ink/20 px-4 py-10 text-center text-sm text-ink/65">
        No games on the Sunday board.
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
            Live scoreboard
          </p>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Sunday window
          </h2>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] uppercase">
          {sourceLabel}
        </Badge>
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {games.map((game) => (
          <li key={game.id}>
            <Link href={`/games/${game.id}`} className="block h-full">
              <Card className="h-full border-ink/15 bg-card/80 transition-colors hover:border-masthead/50 hover:bg-card">
                <CardContent className="flex h-full flex-col gap-4 pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] tracking-wide text-ink/55 uppercase">
                        {game.windowLabel}
                      </p>
                      <h3 className="font-heading text-xl font-semibold">
                        {game.name}
                      </h3>
                    </div>
                    <Badge
                      variant={
                        game.status === "awaiting_official"
                          ? "destructive"
                          : "secondary"
                      }
                      className="font-mono text-[10px] uppercase"
                    >
                      {statusLabel(game.status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 font-mono">
                    <TeamScore
                      short={game.away.short}
                      name={game.away.name}
                      score={game.officialScore.away}
                      align="left"
                    />
                    <span className="text-xs text-ink/40">@</span>
                    <TeamScore
                      short={game.home.short}
                      name={game.home.name}
                      score={game.officialScore.home}
                      align="right"
                    />
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wide uppercase">
                    <span
                      className={
                        game.liveBlogEnabled ? "text-masthead" : "text-ink/50"
                      }
                    >
                      {game.liveBlogEnabled
                        ? "Live blog on"
                        : "Live blog off"}
                    </span>
                    <span className="text-ink/30">·</span>
                    <span className="text-ink/50">Open game</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TeamScore({
  short,
  name,
  score,
  align,
}: {
  short: string;
  name: string;
  score: number | null;
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p className="text-3xl font-medium tracking-tight">{formatScore(score)}</p>
      <p className="text-xs tracking-wide text-ink/70 uppercase">{short}</p>
      <p className="text-[11px] text-ink/50 normal-case">{name}</p>
    </div>
  );
}
