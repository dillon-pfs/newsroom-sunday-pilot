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
    slug: "likely-debut-not-a-plaque",
    title: "Likely Debut, Not a Plaque",
    dek: "SNF DEMO column — Giants 28, Cowboys 20, and the first Harbaugh New York night that gave Giants fans a clean reason to be loud.",
    dateLabel: "Sep 16, 2026",
    voiceId: "chip-absolute",
    relatedGameHref: "/games/demo-dal-nyg-snf",
    relatedGameLabel: "Giants–Cowboys SNF DEMO →",
    body: [
      {
        kind: "p",
        text: "This is a SNF DEMO column, filed after the final: Giants 28, Cowboys 20. Giants fans may proceed directly to the part where the group chat gets louder than the television.",
      },
      {
        kind: "p",
        text: "New York opened with a ten-play, eighty-three-yard drive and Cam Skattebo’s three-yard touchdown. First points of the Harbaugh New York era. Dallas had time to answer, and CeeDee Lamb did: replay reversed one call, the next snap ended in a one-yard touchdown, and the game went 7–7.",
      },
      {
        kind: "p",
        text: "Then Jevón Holland intercepted Prescott at the Giants 45. Twenty seconds before halftime, Dart found Isaiah Likely for fifteen yards and the lead. Followed the coach up I-95 and caught two touchdowns before the MetroCard even warmed up.",
      },
      {
        kind: "p",
        text: "Likely’s second score came after a twelve-play, seventy-four-yard, eight-minute-and-one-second drive. The line: eight catches on eight targets, seventy-eight yards, two touchdowns. That is a beautiful opening statement. It is also not a plaque. Pete can hold the bronze; Giants fans can hold the remote over the Cowboys group chat.",
      },
      {
        kind: "p",
        text: "Dallas made it 28–20 when Prescott found Javonte Williams for seventeen and Aubrey’s extra point went wide right. Five minutes and twenty-one seconds remained. New York converted a third down, kneeled three times, and never gave the ball back. That is how you make a rival cope: keep the last possession and the last word.",
      },
      {
        kind: "p",
        text: "Dart finished 23-of-29 for 230 yards, three touchdowns, and no interceptions. Enjoy the opener. Replay the Likely catches. Call it a good night. Just do not ask the desk to engrave anything before breakfast.",
      },
      {
        kind: "signoff",
        text: "— Chip Absolute / Files SATIRE after the facts land. Never instead of them.",
      },
    ],
  },
  {
    slug: "notarized-postcard-walker-week1",
    title: "Notarized Postcard: Walker, Week 1",
    dek: "MNF DEMO column — Chiefs 31, Broncos 10, a 173-yard splash, and the desk refusing a Day 1 coronation.",
    dateLabel: "Sep 16, 2026",
    voiceId: "postcard-pete",
    relatedGameHref: "/games/demo-den-kc-mnf",
    relatedGameLabel: "Broncos–Chiefs MNF DEMO →",
    body: [
      {
        kind: "p",
        text: "This is a MNF DEMO column, filed after Chiefs 31, Broncos 10. Walker ran for 173 yards and two touchdowns. That is a line you put on the fridge. It is not a franchise seal.",
      },
      {
        kind: "p",
        text: "The loudest number came on fourth-and-one: a sixty-yard rushing touchdown. Arrowhead got its Monday night moment, and the ‘real RB’ frame immediately arrived beside the verified box score. Fine. The frame has been received. The frame does not get its own parade route.",
      },
      {
        kind: "p",
        text: "Notarized Postcard: 173 yards, two scores, one night. Cool tape. Week 1 bronze refused. You may disagree with the stamp. That is the job. Bring a second week, then we can discuss furniture.",
      },
      {
        kind: "p",
        text: "The splash has a useful opposite side on the same card. Waddle’s Broncos debut: one catch, two yards. The acquisition narrative arrived with luggage; the box score arrived with a stamp. Neither line turns a player into a permanent forecast by itself.",
      },
      {
        kind: "p",
        text: "Mahomes had passing and rushing touchdowns. Denver finished with 176 total yards. The final was decisive. None of that requires pretending every Week 1 headline is a career list in a trench coat.",
      },
      {
        kind: "p",
        text: "Side with the coronation if you want. The tape is good enough to defend. But if the defense begins with ‘real RB’ and ends before the next game, you are arguing for a postcard to be a passport.",
      },
      {
        kind: "signoff",
        text: "— Postcard Pete / Cool tape. Stamp refused until the sample earns it.",
      },
    ],
  },
  {
    slug: "conversion-referendum-arrowhead-fourth",
    title: "Conversion Referendum: Arrowhead, Fourth-and-One",
    dek: "MNF DEMO process column — the fourth-and-one handoff, sixty yards, and a ballot that counted itself.",
    dateLabel: "Sep 16, 2026",
    voiceId: "wes-process",
    relatedGameHref: "/games/demo-den-kc-mnf",
    relatedGameLabel: "Broncos–Chiefs MNF DEMO →",
    body: [
      {
        kind: "p",
        text: "This is a MNF DEMO column, filed after Chiefs 31, Broncos 10. The score is the receipt. The question is fourth-and-one at Arrowhead: what did Kansas City choose to trust?",
      },
      {
        kind: "p",
        text: "They handed it to the running back. Walker ran sixty yards for a touchdown. Conversion Referendum: fourth-and-one, hand it to the running back, sixty yards later the ballot counts itself.",
      },
      {
        kind: "p",
        text: "Do not call that vibes because the result looked easy afterward. The point of a referendum is that the choice exists before the result. Fourth-and-one turns a possession into a public statement: trust the line, trust the back, accept the consequences.",
      },
      {
        kind: "p",
        text: "Kansas City also lined Fields up next to Mahomes on Walker’s shovel touchdown. That is not chaos. That is a formation filing itself: enough structure to make the defense account for more than one answer, enough commitment to use the answer it created.",
      },
      {
        kind: "p",
        text: "Walker finished with 173 rushing yards and two touchdowns. The numbers describe the night. They do not replace the decision. The decision was made at fourth-and-one, where every reasonable person had time to pick a side before the sixty-yard result became available.",
      },
      {
        kind: "p",
        text: "Argue the math if you want. Argue the call if you want. But do not wait for the touchdown and call the process obvious. That is not analysis. That is reading the ballot after the count.",
      },
      {
        kind: "signoff",
        text: "— Wes Process / Reads the play as a process outcome. Does not recast a stop as fortune.",
      },
    ],
  },
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
