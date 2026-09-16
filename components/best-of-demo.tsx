import Link from "next/link";
import { DeskPill } from "@/components/desk-pill";
import { getPublicLiveBlog } from "@/lib/live/public";

const picks = [
  ["sunday-pilot", "demo-q1-pineiro-20", "chip-absolute"],
  ["sunday-pilot", "demo-q4-deebo-td", "chip-absolute"],
  ["sunday-pilot", "demo-ht-travel", "layover-len"],
  ["sunday-pilot", "demo-ht-travel", "boo-atlas"],
  ["demo-den-kc-mnf", "demo-den-kc-walker-60", "wes-process"],
  ["demo-den-kc-mnf", "demo-den-kc-walker-60", "postcard-pete"],
  ["demo-den-kc-mnf", "demo-den-kc-swift-cruise", "chyron-carl"],
  ["demo-dal-nyg-snf", "demo-dal-nyg-likely-td1", "chip-absolute"],
] as const;

export function BestOfDemo() {
  const lines = picks.flatMap(([gameId, entryId, voiceId]) => {
    const entry = getPublicLiveBlog(gameId).find((item) => item.id === entryId);
    const line = entry?.satire?.find((item) => item.voiceId === voiceId);
    return entry && line ? [{ gameId, entry, line }] : [];
  });
  return (
    <section className="space-y-3 border-t border-border pt-5">
      <div className="flex items-center gap-2"><DeskPill tone="demo">DEMO</DeskPill><h2 className="font-heading text-2xl font-semibold">Best of the Desk</h2></div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {lines.map(({ gameId, entry, line }) => (
          <li key={`${entry.id}-${line.voiceId}`} className="border border-border bg-card p-3">
            <p className="font-heading text-base leading-6 italic">“{line.line}”</p>
            <Link href={`/games/${gameId}#${entry.id}`} className="mt-2 inline-block font-mono text-[10px] tracking-wide text-masthead uppercase underline-offset-4 hover:underline">
              {line.voiceName} · open moment
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
