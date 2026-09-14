import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatScore, statusLabel } from "@/lib/copy";
import type { Game } from "@/lib/types";

export function Scoreboard({
  games,
  sourceLabel = "Public board",
}: {
  games: Game[];
  sourceLabel?: string;
}) {
  if (games.length === 0) {
    return (
      <div className="border border-dashed border-ink/20 px-4 py-8 text-center text-sm text-ink/65">
        No games on the Sunday board.
      </div>
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
            Live scoreboard
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            Sunday window
          </h2>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] uppercase">
          {sourceLabel}
        </Badge>
      </div>
      <ul className="divide-y divide-ink/10 border border-ink/15 bg-card">
        {games.map((game) => (
          <li key={game.id}>
            <Link
              href={game.demo ? "/demo" : `/games/${game.id}`}
              className="block px-3 py-2.5 transition-colors hover:bg-muted/70 sm:px-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[10px] tracking-wide text-ink/50 uppercase">
                  {game.windowLabel}
                  <span className="mx-1.5 text-ink/25">·</span>
                  {statusLabel(game.status)}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {game.demo ? (
                    <Badge className="bg-demo text-demo-foreground font-mono text-[10px] tracking-wide uppercase">
                      Demo
                    </Badge>
                  ) : null}
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] uppercase"
                  >
                    {game.liveBlogEnabled ? "Blog on" : "Blog off"}
                  </Badge>
                </div>
              </div>
              <div className="mt-1.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 font-mono">
                <TeamScore
                  short={game.away.short}
                  name={game.away.name}
                  score={game.officialScore.away}
                  align="left"
                  demo={game.demo}
                />
                <span className="text-[10px] tracking-wide text-ink/35 uppercase">
                  {game.demo ? "Final" : "@"}
                </span>
                <TeamScore
                  short={game.home.short}
                  name={game.home.name}
                  score={game.officialScore.home}
                  align="right"
                  demo={game.demo}
                />
              </div>
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
  demo,
}: {
  short: string;
  name: string;
  score: number | null;
  align: "left" | "right";
  demo?: boolean;
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p
        className={
          demo
            ? "text-3xl font-semibold tracking-tight sm:text-4xl"
            : "text-2xl font-medium tracking-tight text-ink/55 sm:text-3xl"
        }
      >
        {formatScore(score)}
      </p>
      <p className="text-xs tracking-wide text-ink/80 uppercase">{short}</p>
      <p className="text-[11px] text-ink/50 normal-case">{name}</p>
    </div>
  );
}
