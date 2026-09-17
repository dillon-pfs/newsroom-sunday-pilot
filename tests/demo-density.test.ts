import assert from "node:assert/strict";
import test from "node:test";
import { denKcMnfDemoEntries } from "../lib/demo/den-kc-mnf.ts";
import { dalNygSnfDemoEntries } from "../lib/demo/dal-nyg-snf.ts";
import { melbourneDemoEntries } from "../lib/demo/melbourne.ts";

const cases = [
  {
    name: "MNF",
    entries: denKcMnfDemoEntries,
    gameId: "demo-den-kc-mnf",
    voices: { "chip-absolute": 3, "wes-process": 2, "postcard-pete": 2, "chyron-carl": 2, "poor-form-desk": 1 },
  },
  {
    name: "SNF",
    entries: dalNygSnfDemoEntries,
    gameId: "demo-dal-nyg-snf",
    voices: { "chip-absolute": 4, "wes-process": 5, "postcard-pete": 1, "poor-form-desk": 1 },
  },
  {
    name: "Melbourne",
    entries: melbourneDemoEntries,
    gameId: "sunday-pilot",
    voices: { "chip-absolute": 6, "wes-process": 2, "postcard-pete": 2, "layover-len": 1, "boo-atlas": 1, "poor-form-desk": 1 },
  },
] as const;

for (const { name, entries, gameId, voices } of cases) {
  test(`${name} density stays in its own DEMO lane`, () => {
    assert.equal(entries.length, name === "MNF" ? 11 : 10);
    assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length);
    assert.ok(entries.every((entry) => entry.demo === true && entry.path === "public-live" && entry.gameId === gameId));

    const counts: Record<string, number> = {};
    for (const entry of entries) {
      for (const line of entry.satire ?? []) {
        assert.ok(line.line.trim() && line.voiceName.trim());
        counts[line.voiceId] = (counts[line.voiceId] ?? 0) + 1;
      }
    }
    assert.deepEqual(counts, voices);
  });
}
