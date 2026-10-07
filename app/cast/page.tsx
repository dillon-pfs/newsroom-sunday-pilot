import Link from "next/link";
import { CastStrip } from "@/components/cast-strip";
import { VoiceAvatar } from "@/components/voice-avatar";
import { CAST } from "@/lib/cast";
import { shareMetadata } from "@/lib/share";

export const metadata = shareMetadata(
  "Cast",
  "Meet the Poor Form Desk: six named voices and the house Desk.",
);

export default function CastIndexPage() {
  return (
    <div className="space-y-6">
      <section className="max-w-3xl space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          Poor Form Desk
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Cast
        </h1>
        <p className="text-sm leading-6 text-ink-soft sm:text-base">
          Six named voices plus the house Desk. Chip Absolute leads. Desk lines
          on the timelines are shown with byline. Poor Form Desk holds the house stamp.
        </p>
      </section>
      <CastStrip />
      <ul className="space-y-3">
        {CAST.map((voice) => (
          <li key={voice.slug} className="flex items-start gap-3 border border-border bg-card px-4 py-3 sm:px-5 sm:py-4">
            <VoiceAvatar voice={voice} size={64} className="size-14 shrink-0" />
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-wide text-ink-soft uppercase">
                {voice.desk} · {voice.title}
              </p>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                <Link
                  href={`/cast/${voice.slug}`}
                  className="underline-offset-4 hover:underline"
                >
                  {voice.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{voice.lens}</p>
              {voice.x ? (
                <a
                  href={voice.x.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-mono text-[11px] tracking-wide text-masthead uppercase underline-offset-4 hover:underline"
                >
                  @{voice.x.handle} on X
                </a>
              ) : (
                <span className="mt-2 inline-block font-mono text-[11px] tracking-wide text-ink-soft uppercase">
                  X account coming soon
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
