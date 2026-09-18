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
  const stories = loadStories().map((story) => [story.title, story.dek, story.bylineDetail, story.relatedGameLabel, story.body].filter(Boolean).join("\n")).join("\n").replaceAll("wes-process", "wes");
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
