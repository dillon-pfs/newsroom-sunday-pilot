import Link from "next/link";
import { VoiceAvatar } from "@/components/voice-avatar";
import { storyVoice, type Story } from "@/lib/stories";

export function StoryCard({ story }: { story: Story }) {
  const voice = storyVoice(story);

  return (
    <Link
      href={`/stories/${story.slug}`}
      className="block border-2 border-border bg-card-loud"
    >
      <article className="border-l-[6px] border-masthead px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[11px] tracking-wide text-ink-soft uppercase">
            Column
          </p>
          <p className="font-mono text-[11px] tracking-wide text-ink-soft uppercase">
            {story.dateLabel}
          </p>
        </div>
        <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-[28px]">
          {story.title}
        </h2>
        {story.dek ? <p className="mt-1 text-sm leading-6 text-ink-soft">{story.dek}</p> : null}
        {voice ? (
          <p className="mt-3 flex items-center gap-2 text-sm">
            <VoiceAvatar voice={voice} size={28} className="size-7" />
            <span className="font-medium text-ink">{voice.name}</span>
            {story.bylineDetail ? <span className="text-ink-soft">· {story.bylineDetail}</span> : null}
            <span className="font-mono text-[10px] tracking-wide text-ink-soft uppercase">
              Cast
            </span>
          </p>
        ) : null}
      </article>
    </Link>
  );
}

export function StoriesStrip({ stories }: { stories: Story[] }) {
  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
            Poor Form Desk
          </p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Stories
          </h2>
        </div>
        <Link
          href="/stories"
          className="font-mono text-[11px] tracking-wide text-masthead uppercase underline-offset-4 hover:underline"
        >
          All stories
        </Link>
      </div>
      <ul className="grid gap-2 md:grid-cols-2">
        {stories.map((story) => (
          <li key={story.slug}>
            <StoryCard story={story} />
          </li>
        ))}
      </ul>
    </section>
  );
}
