import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogger, gamesForBlogger, listBloggers } from "@/lib/live/public";

export function generateStaticParams() {
  return listBloggers().map((blogger) => ({ id: blogger.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/bloggers/[id]">) {
  const { id } = await params;
  const blogger = getBlogger(id);
  return { title: blogger?.name ?? "Blogger" };
}

export default async function BloggerPage({
  params,
}: PageProps<"/bloggers/[id]">) {
  const { id } = await params;
  const blogger = getBlogger(id);
  if (!blogger) {
    notFound();
  }

  const assigned = gamesForBlogger(blogger.id);

  return (
    <div className="space-y-8">
      <p className="font-mono text-[11px] tracking-wide uppercase">
        <Link href="/" className="text-ink/55 hover:text-masthead">
          Scoreboard
        </Link>
        <span className="mx-2 text-ink/30">/</span>
        <span>{blogger.name}</span>
      </p>

      <section className="max-w-2xl space-y-3">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          {blogger.desk}
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          {blogger.name}
        </h1>
        <p className="text-sm font-medium text-ink/70">{blogger.title}</p>
        <p className="text-base leading-7 text-ink/80">{blogger.bio}</p>
      </section>

      <section className="border border-ink/12 bg-card px-4 py-4">
        <Badge variant="outline" className="font-mono text-[10px] uppercase">
          Voice rule
        </Badge>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/75">
          {blogger.voiceNote}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-semibold">Assigned games</h2>
        {assigned.length === 0 ? (
          <p className="text-sm text-ink/65">No games on this desk yet.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {assigned.map((game) => (
              <li key={game.id}>
                <Link href={`/games/${game.id}`}>
                  <Card className="border-ink/15 transition-colors hover:border-masthead/50">
                    <CardContent className="space-y-2 pt-1">
                      <p className="font-heading text-lg font-semibold">
                        {game.name}
                      </p>
                      <p className="font-mono text-xs tracking-wide text-ink/55 uppercase">
                        {game.away.short} @ {game.home.short}
                      </p>
                      <p className="font-mono text-[11px] tracking-wide text-masthead uppercase">
                        {game.liveBlogEnabled
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
