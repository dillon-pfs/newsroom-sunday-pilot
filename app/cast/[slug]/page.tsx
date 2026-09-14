import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CAST, getVoice } from "@/lib/cast";
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

  return (
    <div className="space-y-6">
      <p className="font-mono text-[11px] tracking-wide uppercase">
        <Link href="/cast" className="text-ink/55 hover:text-masthead">
          Cast
        </Link>
        <span className="mx-2 text-ink/30">/</span>
        <span>{voice.name}</span>
      </p>

      <section className="max-w-2xl space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          {voice.desk}
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          {voice.name}
        </h1>
        <p className="text-sm font-medium text-ink/70">{voice.title}</p>
        <p className="text-base leading-7 text-ink/80">{voice.bio}</p>
      </section>

      <section className="border border-ink/12 bg-card px-4 py-4">
        <Badge variant="outline" className="font-mono text-[10px] uppercase">
          Lens
        </Badge>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/75">
          {voice.lens}
        </p>
      </section>

      {voice.slug === "chyron-carl" ? (
        <p className="text-sm text-ink/65">
          Carl is silent on the Melbourne DEMO. No SATIRE line filed.
        </p>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-semibold">Assigned games</h2>
        {assigned.length === 0 ? (
          <p className="text-sm text-ink/65">
            No game assigned on the public board. Voice still sits on the Poor
            Form Desk strip.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {assigned.map((game) => (
              <li key={game.id}>
                <Link href={game.demo ? "/demo" : `/games/${game.id}`}>
                  <Card className="border-ink/15 transition-colors hover:border-masthead/50">
                    <CardContent className="space-y-2 pt-1">
                      <p className="font-heading text-lg font-semibold">
                        {game.name}
                      </p>
                      <p className="font-mono text-xs tracking-wide text-ink/55 uppercase">
                        {game.away.short} {game.officialScore.away ?? "—"} –{" "}
                        {game.home.short} {game.officialScore.home ?? "—"}
                      </p>
                      <p className="font-mono text-[11px] tracking-wide text-masthead uppercase">
                        {game.demo
                          ? "DEMO timeline"
                          : game.liveBlogEnabled
                            ? "Live blog enabled"
                            : "Live blog off"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
