import { GhostWindowCard, HeroScorebug } from "@/components/scorebug";
import type { Game } from "@/lib/types";

export function Scoreboard({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return (
      <div className="border border-dashed border-border px-4 py-8 text-center text-sm text-ink-soft">
        No games on the Sunday board.
      </div>
    );
  }

  const featured = games.filter((game) => game.demo);
  const rest = games.filter((game) => !game.demo);

  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
            Filed archive · not live
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            Melbourne, SNF &amp; MNF
          </h2>
        </div>
        <span className="inline-flex h-5 items-center rounded-full border border-border px-2 font-mono text-[10px] tracking-wide text-ink-soft uppercase">
          Archive
        </span>
      </div>
      <div className="space-y-2">
        {featured.map((game) => (
          <HeroScorebug key={game.id} game={game} />
        ))}
        {rest.map((game) => (
          <GhostWindowCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
