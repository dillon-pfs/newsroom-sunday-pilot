import Link from "next/link";
import { CAST } from "@/lib/cast";

export function CastStrip() {
  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
            Poor Form Desk
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Cast
          </h2>
        </div>
        <Link
          href="/cast"
          className="font-mono text-[11px] tracking-wide text-masthead uppercase underline-offset-4 hover:underline"
        >
          Full strip
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {CAST.map((voice) => (
          <li key={voice.slug}>
            <Link
              href={`/cast/${voice.slug}`}
              className="block h-full border border-ink/12 bg-card px-2.5 py-2 transition-colors hover:border-masthead/50"
            >
              <p className="font-heading text-sm font-semibold leading-tight">
                {voice.name}
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-wide text-ink/50 uppercase">
                {voice.title}
              </p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-ink/65">
                {voice.lens}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
