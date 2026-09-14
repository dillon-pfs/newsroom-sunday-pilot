import Link from "next/link";
import { notFound } from "next/navigation";
import { EntryList } from "@/components/entry-list";
import { GameScore } from "@/components/game-score";
import { PublicFeedControls } from "@/components/public-feed-controls";
import { Badge } from "@/components/ui/badge";
import { getBlogger, getPublicGame, getPublicLiveBlog } from "@/lib/live/public";

export function GameView({ id, paused }: { id: string; paused: boolean }) {
  const game = getPublicGame(id);
  if (!game) {
    notFound();
  }

  const entries = getPublicLiveBlog(game.id);
  const blogger = game.assignedBloggerId
    ? getBlogger(game.assignedBloggerId)
    : undefined;

  return (
    <div className="space-y-5">
      <p className="font-mono text-[11px] tracking-wide uppercase">
        <Link href="/" className="text-ink/55 hover:text-masthead">
          Scoreboard
        </Link>
        <span className="mx-2 text-ink/30">/</span>
        <span>{game.name}</span>
      </p>

      <GameScore game={game} />

      <p className="text-sm text-ink/65">{game.feedNote}</p>

      {blogger ? (
        <p className="text-sm">
          Lead:{" "}
          <Link
            href={`/cast/${blogger.id}`}
            className="text-masthead underline-offset-4 hover:underline"
          >
            {blogger.name}
          </Link>
        </p>
      ) : null}

      {game.liveBlogEnabled ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
                {game.demo ? "DEMO timeline" : "Editorial live blog"}
              </p>
              <h2 className="font-heading text-xl font-semibold sm:text-2xl">
                Timeline
              </h2>
            </div>
            <Badge
              className={
                game.demo
                  ? "bg-demo text-demo-foreground font-mono text-[10px] uppercase"
                  : "font-mono text-[10px] uppercase"
              }
            >
              {game.demo ? "Demo" : "Flag on"}
            </Badge>
          </div>
          <PublicFeedControls paused={paused} gameId={game.id} />
          <EntryList
            entries={entries}
            emptyTitle="No official hooks yet"
            emptyBody="The blog is open, but the public-live path will not invent a play or a score. Commentary waits on facts."
          />
        </section>
      ) : (
        <section className="border border-dashed border-ink/20 px-4 py-8">
          <Badge variant="outline" className="font-mono text-[10px] uppercase">
            Flag off
          </Badge>
          <h2 className="mt-3 font-heading text-2xl font-semibold">
            Live blog is not enabled
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink/70">
            Editorial left this game as scoreboard-only. Scores stay — unless
            a labeled DEMO result is on the board.
          </p>
        </section>
      )}
    </div>
  );
}
