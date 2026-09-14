import Link from "next/link";
import { CastStrip } from "@/components/cast-strip";
import { Scoreboard } from "@/components/scoreboard";
import { listPublicGames } from "@/lib/live/public";

export default function HomePage() {
  const games = listPublicGames();

  return (
    <div className="space-y-6">
      <section className="max-w-3xl space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          Poor Form Sports
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Melbourne DEMO on the board. Late window stays —.
        </h1>
        <p className="text-sm leading-6 text-ink/75 sm:text-base">
          Public seed is the MCG backtest: 49ers 27, Rams 7. Chip Absolute
          leads. SATIRE is Editor-approved and labeled. The SIMULATED desk
          tape is not on this page.
        </p>
      </section>

      <Scoreboard games={games} />
      <CastStrip />

      <section className="border-t border-ink/10 pt-4">
        <h2 className="font-heading text-lg font-semibold">Desk review</h2>
        <p className="mt-1 max-w-xl text-sm leading-6 text-ink/70">
          Private gate for the SIMULATED reel: Play, Pause, scrub, corrections,
          duplicates, and an updates-delayed hitch. Desk aliases stay on that
          screen, labeled SIMULATED.
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
