import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { loadStories } from "../lib/stories/content.ts";
import { CAST } from "../lib/cast.ts";
import { dalNygSnfDemoEntries, DEMO_BANNER as dalNygBanner } from "../lib/demo/dal-nyg-snf.ts";
import { denKcMnfDemoEntries, DEMO_BANNER as denKcBanner } from "../lib/demo/den-kc-mnf.ts";
import { melbourneDemoEntries, DEMO_BANNER as melbourneBanner } from "../lib/demo/melbourne.ts";

const FORBIDDEN = [
  /\bDillon\b/i,
  /\bDEMO\b/,
  /\bSATIRE\b/i,
  /\bGitHub\b/i,
  /github\.com/i,
  /vercel\.app/i,
  /\/workspace\b/,
  /\bAstra\b/,
  /\bCodex\b/,
  /\bCursor\b/,
];

const SKIP_KEYS = new Set(["slug", "id", "voiceId", "gameId", "avatar", "url"]);

function collect(value: unknown, path: string, into: Array<[string, string]>) {
  if (typeof value === "string") {
    into.push([path, value]);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, `${path}[${index}]`, into));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      if (SKIP_KEYS.has(key)) continue;
      collect(nested, `${path}.${key}`, into);
    }
  }
}

function assertClean(label: string, strings: Array<[string, string]>, alsoBanProcess = false) {
  for (const [path, text] of strings) {
    for (const pattern of FORBIDDEN) {
      assert.equal(
        pattern.test(text),
        false,
        `${label} ${path} still has public chrome "${pattern}": ${text}`,
      );
    }
    if (alsoBanProcess) {
      assert.equal(/\bprocess\b/i.test(text), false, `${label} ${path} still says process: ${text}`);
    }
  }
}

function source(relativePath: string) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("public cast display names stay house voice", () => {
  const wes = CAST.find((voice) => voice.slug === "wes-process");
  assert.ok(wes);
  assert.equal(wes.name, "Wes");
  assert.notEqual(wes.title.toLowerCase(), "process");
  const strings: Array<[string, string]> = [];
  collect(CAST, "cast", strings);
  assertClean("cast", strings, true);
});

test("shared archive banners stay unlabeled", () => {
  assertClean(
    "banners",
    [
      ["melbourne", melbourneBanner],
      ["snf", dalNygBanner],
      ["mnf", denKcBanner],
    ],
  );
  const banners = source("lib/demo/banners.ts");
  assert.match(banners, /Archive · SF 27 LAR 7 · NYG 28 DAL 20 · KC 31 DEN 10 · not live/);
  assert.equal(/\bDEMO —/.test(banners), false);
  assert.equal(/LABELED BACKTESTS/i.test(banners), false);
});

test("timeline bylines do not show Wes Process or DEMO/SATIRE words", () => {
  const strings: Array<[string, string]> = [];
  collect(
    [...melbourneDemoEntries, ...dalNygSnfDemoEntries, ...denKcMnfDemoEntries].flatMap(
      (entry) => entry.satire ?? [],
    ),
    "lines",
    strings,
  );
  assertClean("timeline", strings, true);
});

test("staff picks and other story copy stay house voice", () => {
  // Inspect rendered content fields, not loader code or classification metadata.
  const stories = loadStories().map((story) => [story.title, story.dek, story.bylineDetail, story.relatedGameLabel, story.dateLabel, story.body].filter(Boolean).join("\n")).join("\n").replaceAll("wes-process", "wes");
  for (const pattern of FORBIDDEN) {
    assert.equal(pattern.test(stories), false, `content/stories still has ${pattern}`);
  }
  assert.equal(/\bprocess\b/i.test(stories), false, "content/stories still lectures process");
  assert.match(
    stories,
    /\*\*Wes\*\* picks the call that still stands after a bad bounce\./,
  );
  assert.match(stories, /Desk may refresh these picks\. Do not treat as betting advice\. Do not engrave\./);
  assert.match(stories, /— Poor Form Desk · staff ballot · Sep 17, 2026/);
  assert.equal(/Update after Dillon curation/.test(stories), false);
  assert.equal(/picks process that survives/.test(stories), false);
});

test("Option A public corrections land in live staff-picks and cast copy", () => {
  const staff = loadStories().find((story) => story.slug === "staff-picks-rest-of-2026");
  const stories = loadStories().map((story) => [story.title, story.dek, story.bylineDetail, story.dateLabel, story.body].filter(Boolean).join("\n")).join("\n").replaceAll("wes-process", "wes");
  const cast = source("lib/cast.ts");
  const castIndex = source("app/cast/page.tsx");
  const castProfile = source("app/cast/[slug]/page.tsx");

  assert.ok(staff);
  assert.equal(staff.dateLabel, "Filed Sep 17, 2026 · Corrected Sep 18, 2026");
  assert.match(
    stories,
    /\*\*Correction — Sep 18, 2026:\*\* An earlier version named Jim Harbaugh as the Giants coach; the correct name is John Harbaugh\. It also listed Kenneth Walker III, Isaiah Likely, Jaxson Dart and Cam Skattebo in 2026 Rookie of the Year rows\. Walker and Likely entered the NFL in 2022; Dart and Skattebo in 2025\. We have withdrawn those entries without substituting new picks\./,
  );
  assert.match(stories, /John Harbaugh \(NYG\)/);
  assert.equal(/Jim Harbaugh \(NYG\)/.test(stories), false);
  assert.equal((stories.match(/Withdrawn — not eligible for 2026 Rookie of the Year\./g) ?? []).length, 5);
  assert.equal((stories.match(/Withdrawn after eligibility check\. Original ballot preserved in revision history\./g) ?? []).length, 5);
  assert.match(stories, /\|\s*\*\*ROY\*\*\s*\|\s*\*\*Stamp refused\*\*\s*\|\s*Debut lines are cool tape\. They are not bronzes\. Ask again after Thanksgiving\./);
  assert.match(staff.body, /^## Poor Form Desk$/m);
  assert.equal(/optional house row/.test(stories), false);
  assert.equal(/What Chip is watching \(one bit, not a buffet\)/.test(stories), false);
  assert.match(stories, /\*\*What Chip is watching:\*\*/);
  assert.equal(/What Chip is not stealing/.test(stories), false);
  assert.equal(/Package rule tonight/.test(stories), false);
  assert.equal(/Losing-fan banter/.test(stories), false);
  assert.equal(/pile-on thread/.test(stories), false);
  assert.equal(/^## Close$/m.test(stories), false);
  assert.match(stories, /New house\. Same Bills\. Chip’s Lions pick paid rent, missed the furniture, and left before dessert\./);
  assert.match(stories, /Engrave nothing before breakfast—not Allen, not Cook, and definitely not one loud night in a new building\./);
  assert.match(stories, /"With Ben\. Without Ben\."/);
  assert.match(stories, /Ceremony is allowed to be loud\. Spoilers are allowed to be louder\. Engrave nothing before breakfast\./);

  assert.match(cast, /Loud picks\. His name stays on them\./);
  assert.match(cast, /He believes indoor voices are for people who haven’t made a pick yet\./);
  assert.match(cast, /A great night can earn a stamp\. A career takes longer\./);
  assert.match(cast, /He can stamp a night worth keeping\. He will not turn it into a career verdict\./);
  assert.match(cast, /When the broadcast becomes the story\./);
  assert.match(cast, /Public segment: Notarized Postcard\./);
  assert.equal(/does not notarize postcards/.test(cast), false);
  assert.equal(/Absolute takes\. Scoreboard theater/.test(cast), false);
  assert.equal(/Silent on Melbourne/.test(cast), false);
  assert.equal(/Carl is silent/.test(castIndex), false);
  assert.equal(/Carl is silent/.test(castProfile), false);
  assert.equal(/Monday night platform beat/.test(castIndex), false);
  assert.equal(/Monday night platform beat/.test(castProfile), false);
});

test("about, stories shelf, and site chrome drop DEMO/SATIRE words", () => {
  const files = [
    "app/about/page.tsx",
    "app/page.tsx",
    "app/stories/page.tsx",
    "app/stories/[slug]/page.tsx",
    "app/layout.tsx",
    "components/site-chrome.tsx",
    "components/site-nav.tsx",
    "components/story-card.tsx",
    "components/demo-banner.tsx",
    "components/scoreboard.tsx",
    "components/scorebug.tsx",
    "lib/live/catalog.ts",
  ];
  for (const file of files) {
    const text = source(file)
      .replaceAll("wes-process", "wes")
      .replace(/DEMO_[A-Z_]+|HOME_DEMO_BANNER|isDemoGamePath|demoBannerForPath|demoChrome/g, "X");
    const strings = [...text.matchAll(/["'`]([^"'`\\]|\\.)*["'`]/g)].map((match) => match[0]);
    for (const snippet of strings) {
      for (const pattern of FORBIDDEN) {
        assert.equal(pattern.test(snippet), false, `${file} still has ${pattern} in ${snippet}`);
      }
    }
  }
});
