import Link from "next/link";
import { Scoreboard } from "@/components/scoreboard";
import { listPublicGames } from "@/lib/live/public";

export default function HomePage() {
  const games = listPublicGames();

  return (
    <div className="space-y-10">
      <section className="max-w-2xl space-y-3">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          Sunday pilot
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          The board is live. The facts are not invented.
        </h1>
        <p className="text-base leading-7 text-ink/75">
          Newsroom lists every window game. Click through for score and
          status. A live blog opens only when editorial flips the flag —
          Sunday Pilot Game is on, Late Window is not.
        </p>
      </section>

      <Scoreboard games={games} />

      <section className="grid gap-4 border-t border-ink/10 pt-8 md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="font-heading text-xl font-semibold">Lead Blogger</h2>
          <p className="text-sm leading-6 text-ink/70">
            House voice for the pilot. Commentary is character, filed after
            official hooks — never as a substitute for them.
          </p>
          <Link
            href="/bloggers/lead-blogger"
            className="font-mono text-xs tracking-wide text-masthead uppercase underline-offset-4 hover:underline"
          >
            Open profile
          </Link>
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-xl font-semibold">Desk review</h2>
          <p className="text-sm leading-6 text-ink/70">
            Private gate for the SIMULATED replay: play, pause, corrections,
            duplicates, and an updates-delayed hitch. Kept off this page.
          </p>
          <Link
            href="/review"
            className="font-mono text-xs tracking-wide text-masthead uppercase underline-offset-4 hover:underline"
          >
            Unlock review
          </Link>
        </div>
      </section>
    </div>
  );
}
