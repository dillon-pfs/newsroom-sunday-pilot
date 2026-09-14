import Link from "next/link";
import { CastStrip } from "@/components/cast-strip";
import { Scoreboard } from "@/components/scoreboard";
import { StoriesStrip } from "@/components/story-card";
import { listPublicGames } from "@/lib/live/public";
import { listStories } from "@/lib/stories";

export default function HomePage() {
  const games = listPublicGames();
  const stories = listStories();

  return (
    <div className="space-y-6">
      <section className="max-w-3xl space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          Poor Form Sports
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Melbourne DEMO owns the board. Late window waits.
        </h1>
        <p className="text-sm leading-6 text-ink-soft sm:text-base">
          Public seed is the MCG backtest: 49ers 27, Rams 7. Chip Absolute
          leads. SATIRE is Editor-approved and labeled. The SIMULATED desk
          tape is not on this page.
        </p>
      </section>

      <Scoreboard games={games} />
      <CastStrip />
      <StoriesStrip stories={stories} />

      <section className="border-t border-border pt-4">
        <h2 className="font-heading text-lg font-semibold">Desk review</h2>
        <p className="mt-1 max-w-xl text-sm leading-6 text-ink-soft">
          Private gate for the SIMULATED reel. Stay labeled SIMULATED — never
          on the public board.
        </p>
        <Link
          href="/review"
          className="mt-2 inline-block font-mono text-xs tracking-wide text-masthead uppercase underline-offset-4 hover:underline"
        >
          Unlock review
        </Link>
      </section>
    </div>
  );
}
