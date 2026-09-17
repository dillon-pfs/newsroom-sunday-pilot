import Link from "next/link";
import { notFound } from "next/navigation";
import { DeskPill } from "@/components/desk-pill";
import { VoiceAvatar } from "@/components/voice-avatar";
import { getStory, listStories, storyVoice } from "@/lib/stories";
import { shareMetadata } from "@/lib/share";

export function generateStaticParams() {
  return listStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = getStory(slug);
  return story
    ? shareMetadata(`${story.title} · DEMO / SATIRE`, story.dek)
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

      <div className="flex items-center gap-1.5">
        <DeskPill tone="demo">Demo</DeskPill>
        <DeskPill tone="satire">Satire</DeskPill>
      </div>

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
          <span className="font-mono text-[11px] tracking-wide text-ink-soft uppercase">
            {story.dateLabel}
          </span>
        </div>
      ) : null}

      <p className="max-w-2xl text-base leading-7 text-ink-soft">{story.dek}</p>

      <div className="max-w-2xl space-y-5 border-t border-border pt-5">
        {story.body.map((block, index) => {
          if (block.kind === "signoff") {
            return (
              <p
                key={`signoff-${index}`}
                className="font-heading text-base text-ink italic"
              >
                {block.text}
              </p>
            );
          }
          if (block.kind === "h2") {
            return (
              <h2
                key={`h2-${index}`}
                className="font-heading text-2xl font-semibold tracking-tight"
              >
                {block.text}
              </h2>
            );
          }
          if (block.kind === "table") {
            return (
              <div key={`table-${index}`} className="overflow-x-auto border-2 border-border">
                <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                  <thead className="bg-card-loud">
                    <tr>
                      {block.headers.map((header) => (
                        <th
                          key={header}
                          className="border-b border-border px-3 py-2 font-mono text-[11px] tracking-wide text-masthead uppercase"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={`row-${rowIndex}`} className="align-top">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`cell-${rowIndex}-${cellIndex}`}
                            className="border-b border-border px-3 py-2 text-ink"
                          >
                            {cellIndex === 0 ? (
                              <span className="font-mono text-[11px] tracking-wide uppercase">
                                {cell}
                              </span>
                            ) : cellIndex === 1 ? (
                              <span className="font-medium">{cell}</span>
                            ) : (
                              cell
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          if (block.kind === "ul") {
            return (
              <ul
                key={`ul-${index}`}
                className="list-disc space-y-2 pl-5 text-base leading-7 text-ink"
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`li-${index}-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            );
          }
          if (block.kind === "rich") {
            return (
              <p key={`p-${index}`} className="text-base leading-7 text-ink">
                {block.parts.map((part, partIndex) =>
                  part.italic ? (
                    <em key={partIndex}>{part.text}</em>
                  ) : (
                    <span key={partIndex}>{part.text}</span>
                  ),
                )}
              </p>
            );
          }
          if (block.kind === "p") {
            return (
              <p key={`p-${index}`} className="text-base leading-7 text-ink">
                {block.text}
              </p>
            );
          }
          return null;
        })}
      </div>

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
              Related DEMO
            </p>
            <Link
              href={story.relatedGameHref}
              className="flex h-[4.5rem] items-center justify-between gap-3 bg-bar px-4 text-bar-foreground"
            >
              <span className="flex items-center gap-2">
                <DeskPill tone="demo">Demo</DeskPill>
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