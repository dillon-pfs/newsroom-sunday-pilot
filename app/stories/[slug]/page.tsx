import Link from "next/link";
import { StoryBody } from "@/components/story-body";
import { notFound } from "next/navigation";
import { VoiceAvatar } from "@/components/voice-avatar";
import { getStory, listStories, storyVoice } from "@/lib/stories";
import { shareMetadata } from "@/lib/share";

export const dynamicParams = false;

export function generateStaticParams() {
  return listStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = getStory(slug);
  return story
    ? shareMetadata(story.title, story.dek)
    : { title: "Story" };
}

export default async function StoryArticlePage({
  params,
}: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) {
    notFound();
  }
  const voice = storyVoice(story);

  return (
    <article className="space-y-6">
      <p className="font-mono text-[11px] tracking-wide uppercase">
        <Link href="/stories" className="text-ink-soft hover:text-masthead">
          Stories
        </Link>
        <span className="mx-2 text-ink/30">/</span>
        <span>{story.title}</span>
      </p>

      <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        {story.title}
      </h1>

      {voice ? (
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/cast/${voice.slug}`}
            className="flex items-center gap-2"
          >
            <VoiceAvatar voice={voice} size={36} className="size-9" />
            <span className="font-medium text-ink">{voice.name}</span>
          </Link>
          {story.bylineDetail ? (
            <span className="text-sm text-ink-soft">{story.bylineDetail}</span>
          ) : null}
          <span className="font-mono text-[11px] tracking-wide text-ink-soft uppercase">
            {story.dateLabel}
          </span>
        </div>
      ) : null}

      {story.dek ? <p className="max-w-2xl text-base leading-7 text-ink-soft">{story.dek}</p> : null}

      <StoryBody html={story.html} />

      <section className="grid gap-2 border-t border-border pt-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
            Related cast
          </p>
          {voice ? (
            <Link
              href={`/cast/${voice.slug}`}
              className="flex items-center gap-3 border-2 border-border bg-card-loud px-3 py-3"
            >
              <VoiceAvatar voice={voice} size={40} className="size-10" />
              <span>
                <span className="block font-heading text-lg font-semibold">
                  {voice.name}
                </span>
                <span className="font-mono text-[10px] tracking-wide text-ink-soft uppercase">
                  {voice.title}
                </span>
              </span>
            </Link>
          ) : null}
        </div>
        {story.relatedGameHref ? (
          <div>
            <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
              Related game
            </p>
            <Link
              href={story.relatedGameHref}
              className="flex h-[4.5rem] items-center justify-between gap-3 bg-bar px-4 text-bar-foreground"
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs tracking-wide uppercase">
                  {story.relatedGameLabel ?? "Melbourne game →"}
                </span>
              </span>
            </Link>
          </div>
        ) : null}
      </section>
    </article>
  );
}
