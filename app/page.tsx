import Link from "next/link";
import { CastStrip } from "@/components/cast-strip";
import { BestOfDemo } from "@/components/best-of-demo";
import { Scoreboard } from "@/components/scoreboard";
import { LiveScoreboard } from "@/components/scoreboard/live-scoreboard";
import { StoriesStrip } from "@/components/story-card";
import { listPublicGames } from "@/lib/live/public";
import { listStories } from "@/lib/stories";
import { shareMetadata } from "@/lib/share";

export const metadata = shareMetadata(
  "NFL board + satirical desk",
  "A labeled NFL scoreboard pilot with DEMO backtests and SATIRE from the Poor Form Desk.",
);

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
          The desk has opinions. The board labels its work.
        </h1>
        <p className="text-sm leading-6 text-ink-soft sm:text-base">
          Follow the NFL scoreboard when the pilot cache is awake, then catch
          up with Chip Absolute and the desk. SATIRE is Editor-approved and
          labeled. The Melbourne, SNF and MNF DEMO backtests have their own archive below.
        </p>
      </section>

      <LiveScoreboard />
      <Scoreboard games={games.filter((game) => game.demo)} />
      <BestOfDemo />
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
