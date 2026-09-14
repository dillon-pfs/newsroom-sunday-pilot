import Link from "next/link";
import { CastStrip } from "@/components/cast-strip";
import { CAST } from "@/lib/cast";

export const metadata = {
  title: "Cast",
};

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
          Six lenses. Chip Absolute leads. Carl is silent on the Melbourne
          DEMO. SATIRE lines on the timeline are Editor-approved copy, shown
          with byline.
        </p>
      </section>
      <CastStrip />
      <ul className="space-y-3">
        {CAST.map((voice) => (
          <li key={voice.slug} className="border border-ink/12 bg-card px-4 py-3">
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
          </li>
        ))}
      </ul>
    </div>
  );
}
