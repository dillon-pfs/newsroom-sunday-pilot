import Link from "next/link";
import { notFound } from "next/navigation";
import { DeskPill } from "@/components/desk-pill";
import { AssignedScorebug } from "@/components/scorebug";
import { VoiceAvatar } from "@/components/voice-avatar";
import { CAST, LEAD_VOICE_ID, getVoice } from "@/lib/cast";
import { gamesForBlogger } from "@/lib/live/public";

export function generateStaticParams() {
  return CAST.map((voice) => ({ slug: voice.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/cast/[slug]">) {
  const { slug } = await params;
  const voice = getVoice(slug);
  return { title: voice?.name ?? "Cast" };
}

export default async function CastVoicePage({
  params,
}: PageProps<"/cast/[slug]">) {
  const { slug } = await params;
  const voice = getVoice(slug);
  if (!voice) {
    notFound();
  }

  const assigned = gamesForBlogger(voice.slug);
  const lead = voice.slug === LEAD_VOICE_ID;

  return (
    <div className="space-y-6">
      <p className="font-mono text-[11px] tracking-wide uppercase">
        <Link href="/cast" className="text-ink-soft hover:text-masthead">
          Cast
        </Link>
        <span className="mx-2 text-ink/30">/</span>
        <span>{voice.name}</span>
      </p>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <VoiceAvatar
          voice={voice}
          size={lead ? 160 : 112}
          labelled
          className={
            lead
              ? "size-[88px] shrink-0 sm:size-32"
              : "size-20 shrink-0 sm:size-24"
          }
        />
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
            {voice.desk}
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            {voice.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {lead ? <DeskPill tone="lead">Lead</DeskPill> : (
              <DeskPill tone="outline">{voice.title}</DeskPill>
            )}
            {lead ? (
              <span className="font-mono text-[11px] tracking-wide text-ink-soft uppercase">
                Files satire after facts
              </span>
            ) : null}
          </div>
          <p className="max-w-2xl text-base leading-7 text-ink">{voice.bio}</p>
        </div>
      </section>

      <section className="border border-border bg-card-loud py-4 pr-4 pl-0">
        <div className="border-l-[6px] border-masthead px-4">
          <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
            Lens
          </p>
          <p className="mt-2 font-heading text-2xl leading-snug text-ink italic sm:text-[28px]">
            {voice.lens}
          </p>
        </div>
      </section>

      {voice.slug === "chyron-carl" ? (
        <p className="text-sm text-ink-soft">
          Carl is silent on the Melbourne DEMO. One SATIRE line on the MNF
          platform beat.
        </p>
      ) : null}

      {voice.slug === "poor-form-desk" ? (
        <p className="text-sm text-ink-soft">
          House desk. Holds the PFS stamp. SATIRE stays on the named voices.
        </p>
      ) : null}

      <section className="space-y-3">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          On the board
        </p>
        <h2 className="font-heading text-2xl font-semibold">Assigned games</h2>
        {assigned.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No game assigned on the public board. Voice still sits on the Poor
            Form Desk strip.
          </p>
        ) : (
          <ul className="space-y-3">
            {assigned.map((game) => (
              <li key={game.id}>
                {game.demo ? (
                  <AssignedScorebug game={game} />
                ) : (
                  <Link
                    href={`/games/${game.id}`}
                    className="block border border-border bg-card px-4 py-3"
                  >
                    <p className="font-heading text-lg font-semibold">
                      {game.name}
                    </p>
                    <p className="font-mono text-xs tracking-wide text-ink-soft uppercase">
                      {game.away.short} — {game.home.short}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
