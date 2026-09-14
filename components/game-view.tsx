import Link from "next/link";
import { notFound } from "next/navigation";
import { DeskPill } from "@/components/desk-pill";
import { EntryList } from "@/components/entry-list";
import { GameScore } from "@/components/game-score";
import { PublicFeedControls } from "@/components/public-feed-controls";
import { MiniScorebug } from "@/components/scorebug";
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

  if (game.demo) {
    return (
      <div className="-mx-4 space-y-5 sm:-mx-6">
        <MiniScorebug game={game} sticky />
        <div className="space-y-5 px-4 sm:px-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
              Melbourne · MCG
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {game.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              {blogger ? (
                <p>
                  Lead:{" "}
                  <Link
                    href={`/cast/${blogger.id}`}
                    className="text-masthead underline-offset-4 hover:underline"
                  >
                    {blogger.name}
                  </Link>
                </p>
              ) : null}
              <DeskPill tone="demo">Demo</DeskPill>
              <DeskPill tone="final">Final</DeskPill>
            </div>
            <p className="mt-2 font-mono text-[11px] tracking-wide text-ink-soft uppercase">
              Sources: ESPN, Reuters, Rams.com, NFL gamebook · Injury beats
              skipped · Carl silent
            </p>
          </div>

          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="font-mono text-[11px] tracking-[0.18em] text-demo uppercase">
                  DEMO timeline
                </p>
                <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                  Timeline
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <DeskPill tone="outline">Public live feed</DeskPill>
                {paused ? (
                  <DeskPill tone="warn">Updates delayed</DeskPill>
                ) : (
                  <DeskPill tone="outline">Listening</DeskPill>
                )}
              </div>
            </div>
            <PublicFeedControls paused={paused} gameId={game.id} />
            <EntryList
              entries={entries}
              emptyTitle="No official hooks yet"
              emptyBody="The blog is open, but the public-live path will not invent a play or a score. Commentary waits on facts."
            />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="font-mono text-[11px] tracking-wide uppercase">
        <Link href="/" className="text-ink-soft hover:text-masthead">
          Scoreboard
        </Link>
        <span className="mx-2 text-ink/30">/</span>
        <span>{game.name}</span>
      </p>

      <GameScore game={game} />

      <p className="text-sm text-ink-soft">{game.feedNote}</p>

      {game.liveBlogEnabled ? (
        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
                Editorial live blog
              </p>
              <h2 className="font-heading text-xl font-semibold sm:text-2xl">
                Timeline
              </h2>
            </div>
          </div>
          <PublicFeedControls paused={paused} gameId={game.id} />
          <EntryList
            entries={entries}
            emptyTitle="No official hooks yet"
            emptyBody="The blog is open, but the public-live path will not invent a play or a score. Commentary waits on facts."
          />
        </section>
      ) : (
        <section className="border border-dashed border-border px-4 py-8">
          <DeskPill tone="outline">Flag off</DeskPill>
          <h2 className="mt-3 font-heading text-2xl font-semibold">
            Live blog is not enabled
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">
            Editorial left this game as scoreboard-only. Scores stay — unless
            a labeled DEMO result is on the board.
          </p>
        </section>
      )}
    </div>
  );
}
