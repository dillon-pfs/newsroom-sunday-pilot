import Link from "next/link";
import { CastStrip } from "@/components/cast-strip";
import { VoiceAvatar } from "@/components/voice-avatar";
import { CAST } from "@/lib/cast";
import { shareMetadata } from "@/lib/share";

export const metadata = shareMetadata(
  "Cast · DEMO / SATIRE",
  "Meet the Poor Form Desk: six named voices and the house Desk, each with a defined satire lane.",
);

export default function CastIndexPage() {
  return (
    <div className="space-y-6">
      <section className="max-w-2xl space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          Poor Form Desk
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Cast
        </h1>
        <p className="text-sm leading-6 text-ink/75">
          Six named voices plus the house Desk. Chip Absolute leads. SATIRE lines on the timelines are
          Editor-approved copy, shown with byline. Carl is silent on Melbourne
          and files one MNF platform beat. Poor Form Desk holds the house stamp.
        </p>
      </section>
      <CastStrip />
      <ul className="space-y-3">
        {CAST.map((voice) => (
          <li key={voice.slug} className="flex items-start gap-3 border border-ink/12 bg-card px-4 py-3">
            <VoiceAvatar voice={voice} size={64} className="size-14 shrink-0" />
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-wide text-ink/50 uppercase">
                {voice.desk} · {voice.title}
              </p>
              <h2 className="font-heading text-xl font-semibold">
                <Link
                  href={`/cast/${voice.slug}`}
                  className="underline-offset-4 hover:underline"
                >
                  {voice.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-ink/70">{voice.lens}</p>
              <a
                href={`https://x.com/${voice.xHandle}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block font-mono text-[11px] tracking-wide text-masthead uppercase underline-offset-4 hover:underline"
              >
                @{voice.xHandle} on X
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
