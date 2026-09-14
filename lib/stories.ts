import { getVoice } from "@/lib/cast";

export type StoryParagraph =
  | { kind: "p"; text: string }
  | {
      kind: "rich";
      parts: Array<{ text: string; italic?: boolean }>;
    }
  | { kind: "signoff"; text: string };

export type Story = {
  slug: string;
  title: string;
  dek: string;
  dateLabel: string;
  voiceId: string;
  relatedGameHref?: string;
  relatedGameLabel?: string;
  body: StoryParagraph[];
};

export const stories: Story[] = [
  {
    slug: "fifteen-plays-one-continent-zero-chill",
    title: "Fifteen Plays, One Continent, Zero Chill",
    dek: "Melbourne MCG DEMO column — first Aussie points, revenge tourism, and a stolen-home soundtrack.",
    dateLabel: "Sep 14, 2026",
    voiceId: "chip-absolute",
    relatedGameHref: "/games/sunday-pilot",
    relatedGameLabel: "Melbourne game →",
    body: [
      {
        kind: "p",
        text: "Look, I will not pretend a twenty-yard field goal is sexy. Fifteen plays for three points is the football equivalent of waiting for a table and getting a side salad. But it happened on a new continent, which means history showed up in cleats and still somehow made me laugh.",
      },
      {
        kind: "p",
        text: "That was the whole Melbourne tape in miniature: the NFL imported a regular-season game to the MCG, Netflix put a bow on it, and then the football did football things with Australian stamps on them.",
      },
      {
        kind: "p",
        text: "Kyren Williams scored the first NFL touchdown on Australian soil. That sentence should come with a commemorative coin. Instead it came with a Rams lead that lasted about as long as a group chat apology. San Francisco answered the way San Francisco answers when the plot needs a villain: Demarcus Robinson, ex-Ram, thirty-nine yards, punchline included. Somewhere in L.A. a fantasy league just texted “are we seeing this.”",
      },
      {
        kind: "rich",
        parts: [
          {
            text: "Then the game remembered it had a third quarter. Mike Evans’s first touchdown as a 49er. Deebo setting the table. Melbourne doing the wave like it had a draft pick in the building. I’m not saying the city drafted Evans. I’m saying the city ",
          },
          { text: "acted", italic: true },
          {
            text: " like it did, and that is a stronger claim than most Week 1 takes.",
          },
        ],
      },
      {
        kind: "p",
        text: "The best bit wasn’t even a score. Late third: Nacua inches short, fourth-and-goal from the one, Stafford sneak stuffed, turnover on downs. That is the kind of stop that makes you rearrange your furniture. And then — because football is a revenge sport — San Francisco immediately went ninety-nine yards and Deebo scored. You stuff them at the door and they tour the whole house. That’s not a drive. That’s revenge tourism.",
      },
      {
        kind: "p",
        text: "Final: 27–7. First Aussie regular-season points. First NFL touchdown Down Under. A stolen-home soundtrack loud enough that “neutral site” should have to show ID. I am filing this under: the scoreboard lied about how fun it was, and also under: please schedule another one before I calm down.",
      },
      {
        kind: "signoff",
        text: "— Chip Absolute / Files SATIRE after the facts land. Never instead of them.",
      },
    ],
  },
  {
    slug: "conversion-referendums-week1",
    title: "Conversion Referendums: A Week 1 Process Note",
    dek: "Week 1 process column — Maye end-zone ballot, OT go-for-two, and stuffed two-point tries as conversion referendums.",
    dateLabel: "Sep 14, 2026",
    voiceId: "wes-process",
    body: [
      {
        kind: "p",
        text: "People keep calling these “chaos games.” Chaos is what happens when the ball bounces funny. What I saw in Week 1 was something colder: teams walking into conversion moments with their eyes open and filing the results under “process.”",
      },
      {
        kind: "p",
        text: "Start midweek in Seattle. Banner night. Super Bowl rematch energy. Then the part that matters for this desk: late, third-and-five in scoring range, Maye to the end zone, interception. You can yell about vibes after that. I won’t stop you. But if you had a field goal available and chose the referendum, own the ballot. The booth will say “terrible decision” like it’s a product placement. Fine. The decision still happened.",
      },
      {
        kind: "p",
        text: "Sunday afternoon made the pattern louder. Detroit and New Orleans turned a twenty-one-point hole into overtime theater. New Orleans answered in OT, then went for two to win. Incomplete. Final: 31–30. That is not a coin flip narrative. That is a coach choosing the conversion referendum with 1:34 left instead of kicking and hoping Detroit fails the next possession. I respect the math even when the ball doesn’t. Especially when the ball doesn’t.",
      },
      {
        kind: "p",
        text: "Later window, Philadelphia: Commanders trailing by two, go for the tying two-point try with a minute left, stuffed. Same species of moment as Detroit. Different jersey. Same question. Do you want the tie, or do you want the win attempt, or do you want the stop to define you? The stop defined them.",
      },
      {
        kind: "p",
        text: "I’m not here to moralize. I’m here to name the category. Fourth-and-shorts, wiped touchdowns that become threes, delay-of-game before a short fourth, stuffed sneaks at the one, OT go-for-twos — Week 1 kept handing out process exams and then acting surprised when the answer key hurt.",
      },
      {
        kind: "p",
        text: "If your fantasy app only shows the final, you missed the referendum. If your group chat only says “unlucky,” you flunked it.",
      },
      {
        kind: "signoff",
        text: "— Wes Process / Reads the play as a process outcome. Does not recast a stop as fortune.",
      },
    ],
  },
];

export function listStories(): Story[] {
  return stories;
}

export function getStory(slug: string): Story | undefined {
  return stories.find((story) => story.slug === slug);
}

export function storyVoice(story: Story) {
  return getVoice(story.voiceId);
}
