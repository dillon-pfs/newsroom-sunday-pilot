import { StoryCard } from "@/components/story-card";
import { listStories } from "@/lib/stories";
import { shareMetadata } from "@/lib/share";

export const metadata = shareMetadata(
  "Stories",
  "Filed columns from the Poor Form Desk. Entertainment only. Not reporting. Not betting advice.",
);

export default function StoriesIndexPage() {
  const stories = listStories();

  return (
    <div className="space-y-6">
      <section className="max-w-3xl space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-masthead uppercase">
          Poor Form Desk
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Stories
        </h1>
        <p className="text-sm leading-6 text-ink-soft sm:text-base">
          Filed columns from the Poor Form Desk. Entertainment only.
        </p>
      </section>

      {stories.length > 0 ? (
        <ul className="space-y-3">
          {stories.map((story) => (
            <li key={story.slug}>
              <StoryCard story={story} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
