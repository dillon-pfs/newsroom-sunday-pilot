import { getVoice } from "@/lib/cast";

export type StoryParagraph =
  | { kind: "p"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "rule" }
  | { kind: "list"; items: string[] }
  | { kind: "table"; headers: [string, string, string]; rows: Array<[string, string, string]> }
  | {
      kind: "figure";
      src: string;
      alt: string;
      caption?: string;
    }
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
  bylineDetail?: string;
  demo?: boolean;
  relatedGameHref?: string;
  relatedGameLabel?: string;
  body: StoryParagraph[];
};

export const stories: Story[] = [
  {
    slug: "tnf-det-buf-recap-highmark-2026-09-17",
    title: "Highmark Housewarming: Bills 41, Lions 31",
    dek: "Buffalo opened the new house and collected rent — Josh Allen five total TDs, Detroit climbed, Chip’s Lions pick paid the bill.",
    dateLabel: "Sep 17, 2026",
    voiceId: "chip-absolute",
    bylineDetail: "with Desk segments",
    body: [
      { kind: "p", text: "Buffalo opened the new house and collected rent. Josh Allen finished with five total touchdowns. Detroit climbed from 0–21 to a 41–31 deficit that still felt like unpaid rent." },
      { kind: "p", text: "Chip Absolute picked the Lions before kickoff. That pick got expensive. In Chip’s head, friends were already texting. The housewarming did not RSVP him back." },
      { kind: "heading", text: "The ceremony sold first" },
      { kind: "p", text: "Chyron Carl’s read: the broadcast sold Allen’s first Highmark intro before the game had a score. Platform put the house on the marquee; football filled in later." },
      { kind: "heading", text: "The referendum passed. The night didn’t." },
      { kind: "p", text: "Trailing, Detroit went for it on fourth down and Sam LaPorta converted. Wes files the ballot as a yes — final still belonged to Buffalo." },
      { kind: "heading", text: "Allen night ≠ bronze" },
      { kind: "p", text: "Five TDs and a Highmark opener is cool tape. Postcard Pete refuses the stamp until the sample isn’t one primetime." },
      { kind: "heading", text: "The seal, not the statue" },
      { kind: "p", text: "James Cook finished the night. Cool late score. Pete’s anti-coronation still holds — one kitchen seal is not forever bronze, and Chip doesn’t double-dip that lane." },
      { kind: "heading", text: "Lions offense, post-Ben edition" },
      { kind: "p", text: "One owned parody still for this recap — not a pile-on thread." },
      {
        kind: "figure",
        src: "/graphics/dan-with-without-ben-parody-2026-09-17.jpg",
        alt: "Parody two-panel graphic comparing Lions coach Dan Campbell with offensive coordinator Ben Johnson versus Campbell alone beside a first-down marker; with Ben shows a full yard, without Ben shows inches; PARODY watermark. Desk parody graphic.",
        caption: "With Ben. Without Ben.",
      },
      { kind: "heading", text: "Close" },
      { kind: "p", text: "New house. Same Bills. Chip’s Lions pick paid rent, missed the furniture, and left before dessert." },
      { kind: "p", text: "Engrave nothing before breakfast—not Allen, not Cook, and definitely not one loud night in a new building." },
      { kind: "signoff", text: "— Chip Absolute / Poor Form Desk · Sep 17, 2026" },
    ],
  },
  {
    slug: "staff-picks-rest-of-2026",
    title: "Staff Picks: Rest of 2026 (Before Anyone Engraves Anything)",
    dek: "Staff ballot. Week 2 is not a mandate. It is a dare.",
    dateLabel: "Sep 17, 2026",
    voiceId: "poor-form-desk",
    bylineDetail: "with the whole newsroom",
    body: [
      { kind: "p", text: "Week 2 is not a mandate. It is a dare. Before the league starts handing out imaginary plaques in September, every seat in the newsroom filed a rest-of-season ballot. One table. Five categories. No committee rewrite of each other’s personality." },
      { kind: "p", text: "**Categories:** MVP · Super Bowl champion · Offensive or overall ROY (as each voice defines it) · Coach of the Year · Most disappointing team *vs current public expectation*" },
      { kind: "rule" },
      { kind: "heading", text: "Chip Absolute" },
      { kind: "table", headers: ["Category", "Pick", "One-line why"], rows: [
        ["**MVP**", "Josh Allen", "Loudest remaining argument for “this is still his league,” and Chip needs something to scream about in January."],
        ["**Super Bowl**", "Buffalo Bills", "New building, old hunger, and Chip refuses to pretend the ceremony energy isn’t half the product."],
        ["**ROY**", "Jaxson Dart", "Opening night already made group chats unbearable; Chip is not waiting for a larger sample to pick a fight."],
        ["**COY**", "Jim Harbaugh (NYG)", "First-week possession bully energy. Chip crowns vibes; Wes can argue the math later."],
        ["**Most disappointing**", "Dallas Cowboys", "Public expectation still acts like October is optional. Chip expects the group chat to age poorly."],
      ] },
      { kind: "rule" },
      { kind: "heading", text: "Wes" },
      { kind: "table", headers: ["Category", "Pick", "One-line why"], rows: [
        ["**MVP**", "Lamar Jackson", "Best remaining marriage of scheme leverage and forced-choice defense — math that survives contact."],
        ["**Super Bowl**", "Baltimore Ravens", "Conversion equity + complementary football; Wes does not bet vibes when the ballot has better math."],
        ["**ROY**", "Cam Skattebo", "First points of a new shop are vibes; surviving early-down usage is the film. Wes is watching the touches, not the ribbon-cutting."],
        ["**COY**", "John Harbaugh", "Quiet conversion excellence over viral debut theater."],
        ["**Most disappointing**", "New York Jets", "Public expectation still prices competence; Wes prices decision quality until proven otherwise."],
      ] },
      { kind: "rule" },
      { kind: "heading", text: "Postcard Pete" },
      { kind: "table", headers: ["Category", "Pick", "One-line why"], rows: [
        ["**MVP**", "**No plaque yet**", "September MVP talk is a Notarized Postcard with the stamp still in the drawer."],
        ["**Super Bowl**", "Detroit Lions", "Will pick a real team — and will refuse every midseason “proves the conference” article until January."],
        ["**ROY**", "**Stamp refused**", "Debut lines are cool tape. They are not bronzes. Ask again after Thanksgiving."],
        ["**COY**", "Dan Campbell", "Culture that already survived a lead-blow narrative; Pete will not coronate a soft schedule."],
        ["**Most disappointing**", "Kansas City Chiefs *(vs dynasty expectation)*", "Public still prices rings as default. Pete prices sample size. One Walker night is not a dynasty renewal."],
      ] },
      { kind: "rule" },
      { kind: "heading", text: "Chyron Carl" },
      { kind: "table", headers: ["Category", "Pick", "One-line why"], rows: [
        ["**MVP**", "Patrick Mahomes", "Still the name the chyron knows how to sell on a cold Monday."],
        ["**Super Bowl**", "Kansas City Chiefs", "Platform gravity + December TV real estate; Carl is honest about what the booth wants."],
        ["**ROY**", "Walker (KC)", "The booth already sold “real RB” in twelve characters. Carl picks the chyron, not the bronze."],
        ["**COY**", "Andy Reid", "The chyron already has the font."],
        ["**Most disappointing**", "Miami Dolphins *(vs summer hype reel)*", "Preseason chyrons wrote a thriller; Carl expects the editing bay to need a softer cut."],
      ] },
      { kind: "rule" },
      { kind: "heading", text: "Layover Len" },
      { kind: "table", headers: ["Category", "Pick", "One-line why"], rows: [
        ["**MVP**", "Brock Purdy", "Week-early to Melbourne and still the one asking questions at the end. Arrival ops as résumé."],
        ["**Super Bowl**", "San Francisco 49ers", "Already proved a week-early pack job on another continent; Len respects the itinerary."],
        ["**ROY**", "Jaxson Dart", "New city, new shop, zero time-zone excuses on the opener — Len grades the body clock by the box score."],
        ["**COY**", "Kyle Shanahan", "Packs early. Wins the matchup before kickoff."],
        ["**Most disappointing**", "Los Angeles Rams *(vs “we’ll be fine by Sunday” travel assumption)*", "Day-before packing is a choice. Len keeps the receipt."],
      ] },
      { kind: "rule" },
      { kind: "heading", text: "Boo Atlas" },
      { kind: "table", headers: ["Category", "Pick", "One-line why"], rows: [
        ["**MVP**", "Jalen Hurts", "The building already voted. Boo just counts the throats."],
        ["**Super Bowl**", "Philadelphia Eagles", "Neutral sites still remember what a hostile building feels like; Philly exports that weather."],
        ["**ROY**", "Isaiah Likely", "Followed a coach into a new building and heard the census change before the MetroCard warmed up."],
        ["**COY**", "Nick Sirianni", "Keeps a building pointed in one direction when the scoreboard wobbles."],
        ["**Most disappointing**", "Las Vegas Raiders *(vs “destination franchise” talk)*", "Public expectation sells neon. Boo sells empty noise after halftime."],
      ] },
      { kind: "rule" },
      { kind: "heading", text: "Poor Form Desk (optional house row)" },
      { kind: "table", headers: ["Category", "Pick", "One-line why"], rows: [
        ["**MVP**", "We’ll cite the play. We’ll fight about what it meant.", "Brand voice stays rare; Desk declines a fourth fake consensus."],
        ["**Super Bowl**", "File under “ask us in February”", "Pin stays up either way."],
        ["**ROY**", "Notarize nothing before breakfast", "Desk amplifies Pete’s stamp policy."],
        ["**COY**", "The coach whose fourth downs Wes can diagram without a novel", "House points at the call, not vibes."],
        ["**Most disappointing**", "Any team the timeline already crowned in Week 1", "Desk’s job is the receipt, not the parade permit."],
      ] },
      { kind: "rule" },
      { kind: "heading", text: "How to read this" },
      { kind: "list", items: [
        "**Chip** picks fights fans can forward.",
        "**Wes** picks the call that still stands after a bad bounce.",
        "**Pete** refuses the plaque until the sample earns it — and still names Lions / Campbell where a real pick is required.",
        "**Carl** admits what television wants.",
        "**Len / Boo** stay in travel and throats — specific names, no fake medical jet-lag.",
        "**Desk** mostly refuses to play — on purpose.",
      ] },
      { kind: "p", text: "Desk may refresh these picks. Do not treat as betting advice. Do not engrave." },
      { kind: "signoff", text: "— Poor Form Desk · staff ballot · Sep 17, 2026" },
    ],
  },
  {
    slug: "tnf-whats-ahead-lions-at-bills-2026-09-17",
    title: "What’s Ahead: Lions at Bills — Ceremony Meets a Visiting Spoiler",
    dek: "Poor Form Desk is not here to hand you a money line. We are here to hand Chip Absolute a building that wants a coronation and a visitor that does not have to clap along.",
    dateLabel: "Sep 17, 2026",
    voiceId: "poor-form-desk",
    bylineDetail: "Chip Absolute in the room",
    demo: false,
    body: [
      { kind: "p", text: "Game Detroit Lions at Buffalo Bills · TNF · Highmark regular-season opener · kick 8:15 p.m. ET / 7:15 p.m. CT" },
      { kind: "rule" },
      { kind: "p", text: "Poor Form Desk is not here to hand you a money line. We are here to hand Chip Absolute a building that wants a coronation and a visitor that does not have to clap along." },
      { kind: "p", text: "Buffalo opens the regular-season book on a new Highmark night. That is real ceremony energy: ribbons, volume, the timeline treating architecture like a defensive coordinator. Chip’s job is not to mock the building. Chip’s job is to notice when the building starts writing the ending before the first possession." },
      { kind: "p", text: "Detroit arrives with its own unfinished sentence. Week 1 already taught Lions fans what a twenty-one-point lead can turn into when the night gets long. That is not a collapse bit for pregame. It is a permission slip: nobody in Honolulu blue gets to use the phrase “comfortable win” unless the scoreboard earns it again." },
      { kind: "p", text: "Buffalo’s Week 1 late scramble is the mirror. A finish is not the same thing as a finished product. If the home timeline starts selling calm competence before the Lions have the ball, Chip will be in the replies with visiting spoiler energy — and only against a real boast, not a straw man." },
      { kind: "p", text: "**What Chip is watching (one bit, not a buffet):**" },
      { kind: "list", items: [
        "A late lead change that flips the mixed group chat",
        "An explosive score that makes a fade look personal",
        "A turnover that immediately becomes points (sequence verified, not reversed)",
        "Blowout manners if one side turns the night into a quiet-cope problem",
      ] },
      { kind: "p", text: "**What Chip is not stealing:**" },
      { kind: "list", items: [
        "Fourth-down and two-point math → **Wes** (Desk byline)",
        "Debut / “they finally have a ___” coronations → **Postcard Pete**",
        "Booth virality without a clip → **Chyron Carl** stays seated",
      ] },
      { kind: "p", text: "Package rule tonight: **one Chip sendable joke** if the play earns it → plain Desk repost. Empty window beats a filler paragraph. Spent mechanisms stay spent (delete-the-paragraph, parade parking, admin-removal, subject-change — not tonight)." },
      { kind: "p", text: "Losing-fan banter is allowed after the room picks a side: needle `#OnePride` or `#BillsMafia`, not both, and never the Raiders/Dolphins/Cardinals deflection lane mid-game. That lane is for hate replies, not the primary post." },
      { kind: "p", text: "Ceremony is allowed to be loud. Spoilers are allowed to be louder. Engrave nothing before breakfast." },
      { kind: "signoff", text: "— Poor Form Desk · Chip Absolute on call · Sep 17, 2026" },
    ],
  },
  {
    slug: "likely-debut-not-a-plaque",
    title: "Likely Debut, Not a Plaque",
    dek: "Sunday night column — Giants 28, Cowboys 20, and the first Harbaugh New York night that gave Giants fans a clean reason to be loud.",
    dateLabel: "Sep 16, 2026",
    voiceId: "chip-absolute",
    relatedGameHref: "/games/demo-dal-nyg-snf",
    relatedGameLabel: "Giants–Cowboys SNF →",
    body: [
      {
        kind: "p",
        text: "This is a Sunday night column, filed after the final: Giants 28, Cowboys 20. Giants fans may proceed directly to the part where the group chat gets louder than the television.",
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
        text: "— Chip Absolute / Files after the facts land. Never instead of them.",
      },
    ],
  },
  {
    slug: "notarized-postcard-walker-week1",
    title: "Notarized Postcard: Walker, Week 1",
    dek: "Monday night column — Chiefs 31, Broncos 10, a 173-yard splash, and the desk refusing a Day 1 coronation.",
    dateLabel: "Sep 16, 2026",
    voiceId: "postcard-pete",
    relatedGameHref: "/games/demo-den-kc-mnf",
    relatedGameLabel: "Broncos–Chiefs MNF →",
    body: [
      {
        kind: "p",
        text: "This is a Monday night column, filed after Chiefs 31, Broncos 10. Walker ran for 173 yards and two touchdowns. That is a line you put on the fridge. It is not a franchise seal.",
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
    dek: "Monday night column — the fourth-and-one handoff, sixty yards, and a ballot that counted itself.",
    dateLabel: "Sep 16, 2026",
    voiceId: "wes-process",
    relatedGameHref: "/games/demo-den-kc-mnf",
    relatedGameLabel: "Broncos–Chiefs MNF →",
    body: [
      {
        kind: "p",
        text: "This is a Monday night column, filed after Chiefs 31, Broncos 10. The score is the receipt. The question is fourth-and-one at Arrowhead: what did Kansas City choose to trust?",
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
        text: "Argue the math if you want. Argue the call if you want. But do not wait for the touchdown and call the choice obvious. That is not analysis. That is reading the ballot after the count.",
      },
      {
        kind: "signoff",
        text: "— Wes / Reads the play as a decision, not luck.",
      },
    ],
  },
  {
    slug: "fifteen-plays-one-continent-zero-chill",
    title: "Fifteen Plays, One Continent, Zero Chill",
    dek: "Melbourne MCG column — first Aussie points, revenge tourism, and a stolen-home soundtrack.",
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
        text: "— Chip Absolute / Files after the facts land. Never instead of them.",
      },
    ],
  },
  {
    slug: "conversion-referendums-week1",
    title: "Conversion Referendums: Week 1",
    dek: "Week 1 column — Maye end-zone ballot, OT go-for-two, and stuffed two-point tries as conversion referendums.",
    dateLabel: "Sep 14, 2026",
    voiceId: "wes-process",
    body: [
      {
        kind: "p",
        text: "People keep calling these “chaos games.” Chaos is what happens when the ball bounces funny. What I saw in Week 1 was something colder: teams walking into conversion moments with their eyes open and filing the results under the choice they made.",
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
        text: "I’m not here to moralize. I’m here to name the category. Fourth-and-shorts, wiped touchdowns that become threes, delay-of-game before a short fourth, stuffed sneaks at the one, OT go-for-twos — Week 1 kept handing out conversion exams and then acting surprised when the answer key hurt.",
      },
      {
        kind: "p",
        text: "If your fantasy app only shows the final, you missed the referendum. If your group chat only says “unlucky,” you flunked it.",
      },
      {
        kind: "signoff",
        text: "— Wes / Reads the play as a decision, not luck.",
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
