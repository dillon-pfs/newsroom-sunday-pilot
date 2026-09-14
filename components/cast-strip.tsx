import Link from "next/link";
import { CAST, LEAD_VOICE_ID } from "@/lib/cast";
import { cn } from "@/lib/utils";

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
        {CAST.map((voice) => {
          const lead = voice.slug === LEAD_VOICE_ID;
          return (
            <li key={voice.slug}>
              <Link
                href={`/cast/${voice.slug}`}
                className={cn(
                  "block h-full bg-card-loud px-2.5 py-2",
                  lead
                    ? "border-2 border-masthead"
                    : "border border-border",
                )}
              >
                <span
                  className="mb-2 inline-flex size-7 items-center justify-center font-mono text-[10px] font-medium text-demo-foreground"
                  style={{ backgroundColor: voice.mark }}
                >
                  {voice.initials}
                </span>
                <p className="font-heading text-sm font-semibold leading-tight">
                  {voice.name}
                </p>
                <p className="mt-1 font-mono text-[10px] tracking-wide text-ink-soft uppercase">
                  {voice.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-ink-soft">
                  {voice.lens}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
