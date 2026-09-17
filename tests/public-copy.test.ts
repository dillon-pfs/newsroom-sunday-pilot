import assert from "node:assert/strict";
import test from "node:test";
import { CAST } from "../lib/cast.ts";
import { HOME_DEMO_BANNER } from "../lib/demo/banners.ts";
import { DEMO_BANNER as melbourneBanner, melbourneDemoEntries } from "../lib/demo/melbourne.ts";
import { DEMO_BANNER as dalNygBanner, dalNygSnfDemoEntries } from "../lib/demo/dal-nyg-snf.ts";
import { DEMO_BANNER as denKcBanner, denKcMnfDemoEntries } from "../lib/demo/den-kc-mnf.ts";
import { games } from "../lib/live/catalog.ts";
import { stories } from "../lib/stories.ts";

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

const SKIP_KEYS = new Set([
  "slug",
  "id",
  "voiceId",
  "gameId",
  "avatar",
  "relatedGameHref",
  "href",
  "url",
  "x",
]);

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

function assertClean(label: string, strings: Array<[string, string]>) {
  for (const [path, text] of strings) {
    for (const pattern of FORBIDDEN) {
      assert.equal(
        pattern.test(text),
        false,
        `${label} ${path} still has public chrome "${pattern}": ${text}`,
      );
    }
  }
}

test("public story copy has no Dillon, DEMO, SATIRE, or tooling leaks", () => {
  const strings: Array<[string, string]> = [];
  collect(stories, "stories", strings);
  assertClean("stories", strings);
  for (const [, text] of strings) {
    assert.equal(/\bprocess\b/i.test(text), false, `story copy still lectures process: ${text}`);
  }
});

test("public cast display names stay house voice", () => {
  const wes = CAST.find((voice) => voice.slug === "wes-process");
  assert.ok(wes);
  assert.equal(wes.name, "Wes");
  assert.notEqual(wes.title.toLowerCase(), "process");
  const strings: Array<[string, string]> = [];
  collect(CAST, "cast", strings);
  assertClean("cast", strings);
  for (const [, text] of strings) {
    assert.equal(/\bprocess\b/i.test(text), false, `cast copy still says process: ${text}`);
  }
});

test("shared banners and archive labels stay unlabeled", () => {
  const strings: Array<[string, string]> = [];
  collect(
    {
      HOME_DEMO_BANNER,
      melbourneBanner,
      dalNygBanner,
      denKcBanner,
      games: games.map((game) => ({
        name: game.name,
        windowLabel: game.windowLabel,
        feedNote: game.feedNote,
      })),
    },
    "chrome",
    strings,
  );
  assertClean("chrome", strings);
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
  assertClean("timeline", strings);
  for (const [, text] of strings) {
    assert.equal(/\bprocess\b/i.test(text), false, `timeline line still says process: ${text}`);
  }
});

test("staff picks how-to uses house voice", () => {
  const staff = stories.find((story) => story.slug === "staff-picks-rest-of-2026");
  assert.ok(staff);
  const headingIndex = staff.body.findIndex(
    (block) => block.kind === "heading" && block.text === "How to read this",
  );
  assert.ok(headingIndex >= 0);
  const list = staff.body[headingIndex + 1];
  assert.equal(list?.kind, "list");
  if (list.kind !== "list") return;
  assert.deepEqual(list.items, [
    "**Chip** picks fights fans can forward.",
    "**Wes** picks the call that still stands after a bad bounce.",
    "**Pete** refuses the plaque until the sample earns it — and still names Lions / Campbell where a real pick is required.",
    "**Carl** admits what television wants.",
    "**Len / Boo** stay in travel and throats — specific names, no fake medical jet-lag.",
    "**Desk** mostly refuses to play — on purpose.",
  ]);
  const note = staff.body[headingIndex + 2];
  assert.equal(note?.kind, "p");
  if (note.kind !== "p") return;
  assert.equal(note.text, "Desk may refresh these picks. Do not treat as betting advice. Do not engrave.");
  const signoff = staff.body[headingIndex + 3];
  assert.equal(signoff?.kind, "signoff");
  if (signoff.kind !== "signoff") return;
  assert.equal(signoff.text, "— Poor Form Desk · staff ballot · Sep 17, 2026");
});
