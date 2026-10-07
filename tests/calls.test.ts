import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import test from "node:test";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CallsList } from "../components/calls-list.tsx";
import { getCallRecord, type Call } from "../lib/calls.ts";
import { CallFilingError, loadCalls, parseCall, tallyCalls } from "../lib/calls/content.ts";

const valid = {
  date: "2026-10-05",
  game: "ATL at NO",
  window: "MNF",
  take: "Atlanta should give Bijan Robinson 25 carries.",
  postUrl: "https://x.com/ChipAbsolute/status/2107229099995353571",
  result: "Falcons won 45–24. Bijan had 19 carries for 145 yards and 2 TDs (7.6 a carry).",
  status: "still-arguing",
  note: "Atlanta won without giving him 25.",
};

function callFile(overrides: Record<string, unknown> = {}) {
  return `${JSON.stringify({ ...valid, ...overrides }, null, 2)}\n`;
}

function withFiles(files: Record<string, string>, check: (directory: string) => void) {
  const directory = mkdtempSync(join(tmpdir(), "pfs-call-test-"));
  try {
    for (const [name, body] of Object.entries(files)) writeFileSync(join(directory, name), body);
    check(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("newest dates sort first and a later post wins a same-day tie", () => {
  // Filenames run opposite the expected shelf so directory order cannot satisfy the assertion.
  withFiles(
    {
      "2026-09-01-older.json": callFile({
        date: "2026-09-01",
        take: "Older take.",
        postUrl: "https://x.com/ChipAbsolute/status/100",
        status: "missed",
      }),
      "2026-10-01-alpha.json": callFile({
        date: "2026-10-01",
        take: "Earlier same-day take.",
        postUrl: "https://x.com/ChipAbsolute/status/200",
        window: undefined,
      }),
      "2026-10-01-zeta.json": callFile({
        date: "2026-10-01",
        take: "Later same-day take.",
        postUrl: "https://x.com/ChipAbsolute/status/300",
        status: "held-up",
      }),
    },
    (directory) => {
      const calls = loadCalls(directory);
      assert.deepEqual(
        calls.map((call) => call.take),
        ["Later same-day take.", "Earlier same-day take.", "Older take."],
      );
      assert.deepEqual(tallyCalls(calls), { "held-up": 1, missed: 1, "still-arguing": 1 });
      const html = renderToStaticMarkup(createElement(CallsList, { calls }));
      assert.match(html, /bg-live-green[\s\S]*Held up/);
      assert.match(html, /bg-warn[\s\S]*Missed/);
      assert.match(html, /bg-satire[\s\S]*Pending/);
    },
  );
});

test("both seed entries render with their posts, results and status", () => {
  const calls = loadCalls();
  const bijan = calls.find((call) => call.postUrl.endsWith("/2107229099995353571"));
  const goff = calls.find((call) => call.postUrl.endsWith("/2106965618805412204"));
  assert.ok(bijan);
  assert.ok(goff);
  assert.ok(calls.indexOf(bijan) < calls.indexOf(goff));
  assert.equal(bijan.date, "2026-10-05");
  assert.equal(bijan.game, "ATL at NO");
  assert.equal(bijan.window, "MNF");
  assert.equal(bijan.take, "Atlanta should give Bijan Robinson 25 carries.");
  assert.equal(bijan.result, "Falcons won 45–24. Bijan had 19 carries for 145 yards and 2 TDs (7.6 a carry).");
  assert.equal(bijan.status, "still-arguing");
  assert.equal(bijan.note, "Atlanta won without giving him 25.");
  assert.equal(bijan.dateLabel, "Oct 5, 2026");
  assert.equal(goff.date, "2026-10-04");
  assert.equal(goff.game, "DET at CAR");
  assert.equal(goff.window, undefined);
  assert.equal(goff.take, "Bryce Young over Jared Goff.");
  assert.equal(goff.result, "Carolina won 32–26. Goff threw for 412 yards in the loss.");
  assert.equal(goff.status, "held-up");
  assert.equal(goff.note, undefined);
  assert.equal(goff.dateLabel, "Oct 4, 2026");

  const html = renderToStaticMarkup(createElement(CallsList, { calls }));
  assert.match(html, /Chip’s calls/);
  assert.match(html, /His takes, and how each one held up\./);
  assert.match(html, /href="\/cast\/chip-absolute"/);
  assert.match(html, /Atlanta should give Bijan Robinson 25 carries\./);
  assert.match(html, /Bryce Young over Jared Goff\./);
  assert.match(html, /ATL at NO/);
  assert.match(html, /DET at CAR/);
  assert.match(html, /Oct 5, 2026<\/time> · MNF/);
  assert.match(html, /Falcons won 45–24\. Bijan had 19 carries for 145 yards and 2 TDs \(7\.6 a carry\)\./);
  assert.match(html, /Carolina won 32–26\. Goff threw for 412 yards in the loss\./);
  assert.match(html, /Atlanta won without giving him 25\./);
  assert.match(html, /href="https:\/\/x\.com\/ChipAbsolute\/status\/2107229099995353571"/);
  assert.match(html, /href="https:\/\/x\.com\/ChipAbsolute\/status\/2106965618805412204"/);
  assert.match(html, /Held up/);
  assert.match(html, /Missed/);
  assert.match(html, /Pending/);
  assert.match(html, /Chip’s record/);
  assert.match(html, /No streak yet/);
  assert.match(html, /Latest call/);
  assert.match(html, /bg-live-green/);
  assert.match(html, /bg-satire/);
  const tally = tallyCalls(calls);
  assert.match(html, new RegExp(`>${tally["held-up"]}<`));
  assert.match(html, new RegExp(`>${tally.missed}<`));
  assert.match(html, new RegExp(`>${tally["still-arguing"]}<`));
});

for (const [name, source, field, correction] of [
  ["bad-date", callFile({ date: "2026-02-30" }).replaceAll("2026-10-05", "2026-02-30"), "date", "real calendar date"],
  ["bad-status", callFile({ status: "won" }), "status", "held-up"],
  ["other-account", callFile({ postUrl: "https://x.com/PoorFormSports/status/2107229099995353571" }), "postUrl", "ChipAbsolute"],
  ["other-host", callFile({ postUrl: "https://twitter.com/ChipAbsolute/status/2107229099995353571" }), "postUrl", "x.com/ChipAbsolute"],
  ["empty-take", callFile({ take: "   " }), "take", "one-line take"],
  ["empty-result", callFile({ result: "" }), "result", "verified result"],
] as const) {
  test(`filing error names ${name}`, () => {
    const filename = name === "bad-date" ? "2026-02-30-bad-date.json" : "2026-10-05-bad.json";
    assert.throws(
      () => parseCall(filename, source),
      (error: unknown) =>
        error instanceof CallFilingError &&
        error.message.includes(`${filename} — ${field}:`) &&
        error.message.includes(correction),
    );
  });
}

test("filename date must match the date field", () => {
  assert.throws(
    () => parseCall("2026-10-04-mismatch.json", callFile()),
    /2026-10-04-mismatch\.json — filename:.*starts with 2026-10-05/,
  );
});

test("unknown field names the file and the field", () => {
  assert.throws(
    () => parseCall("2026-10-05-extra.json", callFile({ extra: "nope" })),
    /2026-10-05-extra\.json — extra:/,
  );
});

test("duplicate postUrl names both files and the required correction", () => {
  const body = callFile();
  withFiles(
    {
      "2026-10-05-alpha.json": body,
      "2026-10-05-beta.json": body,
    },
    (directory) => {
      assert.throws(
        () => loadCalls(directory),
        /2026-10-05-beta\.json — postUrl:.*2026-10-05-alpha\.json.*Each post can be filed once/,
      );
    },
  );
});

function filed(overrides: Partial<Call> & Pick<Call, "date" | "status" | "postUrl">): Call {
  return {
    game: "ATL at NO",
    take: "A take.",
    result: "A result.",
    dateLabel: overrides.date,
    ...overrides,
  };
}

test("call record is empty when nothing is filed", () => {
  const record = getCallRecord([]);
  assert.deepEqual(record.tally, { hits: 0, misses: 0, pending: 0 });
  assert.deepEqual(record.streak, { kind: "none", label: "No streak yet" });
  assert.equal(record.latest, null);
});

test("call record counts every ungraded call as pending and does not invent a streak", () => {
  const pending = filed({
    date: "2026-10-03",
    status: "still-arguing",
    postUrl: "https://x.com/ChipAbsolute/status/3",
  });
  const ungraded = filed({
    date: "2026-10-02",
    status: "open" as Call["status"],
    postUrl: "https://x.com/ChipAbsolute/status/2",
  });
  const record = getCallRecord([ungraded, pending]);
  assert.deepEqual(record.tally, { hits: 0, misses: 0, pending: 2 });
  assert.deepEqual(record.streak, { kind: "none", label: "No streak yet" });
  assert.equal(record.latest, pending);
});

test("one graded call is not a streak, and a hot run needs two held-up results", () => {
  const hit = (date: string, id: string) =>
    filed({ date, status: "held-up", postUrl: `https://x.com/ChipAbsolute/status/${id}`, take: id });
  const alone = getCallRecord([hit("2026-10-01", "1")]);
  assert.equal(alone.tally.hits, 1);
  assert.deepEqual(alone.streak, { kind: "none", label: "No streak yet" });

  const hot = getCallRecord([
    hit("2026-09-01", "1"),
    filed({ date: "2026-09-15", status: "missed", postUrl: "https://x.com/ChipAbsolute/status/9", take: "old miss" }),
    hit("2026-10-02", "3"),
    hit("2026-10-01", "2"),
  ]);
  assert.deepEqual(hot.tally, { hits: 3, misses: 1, pending: 0 });
  assert.deepEqual(hot.streak, { kind: "hot", count: 2, label: "Hot: 2 straight held up" });
  assert.equal(hot.latest?.take, "3");
});

test("cold streak counts consecutive misses and stops when the run breaks", () => {
  const cold = getCallRecord([
    filed({ date: "2026-10-03", status: "missed", postUrl: "https://x.com/ChipAbsolute/status/3" }),
    filed({ date: "2026-10-02", status: "missed", postUrl: "https://x.com/ChipAbsolute/status/2" }),
    filed({ date: "2026-10-01", status: "held-up", postUrl: "https://x.com/ChipAbsolute/status/1" }),
  ]);
  assert.deepEqual(cold.streak, { kind: "cold", count: 2, label: "Cold: 2 straight missed" });

  const broken = getCallRecord([
    filed({ date: "2026-10-03", status: "held-up", postUrl: "https://x.com/ChipAbsolute/status/3" }),
    filed({ date: "2026-10-02", status: "missed", postUrl: "https://x.com/ChipAbsolute/status/2" }),
    filed({ date: "2026-10-01", status: "held-up", postUrl: "https://x.com/ChipAbsolute/status/1" }),
  ]);
  assert.deepEqual(broken.streak, { kind: "none", label: "No streak yet" });
  assert.equal(broken.tally.hits, 2);
  assert.equal(broken.tally.misses, 1);
});

test("pending calls are skipped in the streak and latest still follows the newest date", () => {
  const pendingNewest = filed({
    date: "2026-10-05",
    status: "still-arguing",
    postUrl: "https://x.com/ChipAbsolute/status/5",
    take: "Still open.",
    game: "ATL at NO",
    window: "MNF",
  });
  const olderPending = filed({
    date: "2026-10-03",
    status: "still-arguing",
    postUrl: "https://x.com/ChipAbsolute/status/3",
    take: "Also open.",
  });
  const hits = [
    filed({ date: "2026-10-04", status: "held-up", postUrl: "https://x.com/ChipAbsolute/status/4", take: "Newer hit." }),
    filed({ date: "2026-10-01", status: "held-up", postUrl: "https://x.com/ChipAbsolute/status/1", take: "Older hit." }),
  ];
  const record = getCallRecord([hits[1], olderPending, pendingNewest, hits[0]]);
  assert.deepEqual(record.tally, { hits: 2, misses: 0, pending: 2 });
  assert.deepEqual(record.streak, { kind: "hot", count: 2, label: "Hot: 2 straight held up" });
  assert.equal(record.latest, pendingNewest);

  const html = renderToStaticMarkup(createElement(CallsList, { calls: [hits[1], olderPending, pendingNewest, hits[0]] }));
  assert.match(html, /Hot: 2 straight held up/);
  assert.match(html, /Latest call[\s\S]*Still open\./);
  assert.match(html, /bg-live-green/);
  const latestAt = html.indexOf("Latest call");
  const olderHit = html.indexOf("Older hit.");
  assert.ok(latestAt !== -1 && latestAt < html.indexOf("Still open."));
  assert.ok(olderHit > html.indexOf("Still open."));
});

test("same-day later post is the latest call even when it is pending", () => {
  const earlier = filed({
    date: "2026-10-01",
    status: "held-up",
    postUrl: "https://x.com/ChipAbsolute/status/100",
    take: "Earlier same-day take.",
  });
  const later = filed({
    date: "2026-10-01",
    status: "still-arguing",
    postUrl: "https://x.com/ChipAbsolute/status/300",
    take: "Later same-day take.",
  });
  const record = getCallRecord([earlier, later]);
  assert.equal(record.latest?.take, "Later same-day take.");
  assert.deepEqual(record.streak, { kind: "none", label: "No streak yet" });
});

test("current shelf shape stays neutral: one hit and one pending call", () => {
  const record = getCallRecord([
    filed({
      date: "2026-10-05",
      status: "still-arguing",
      postUrl: "https://x.com/ChipAbsolute/status/2107229099995353571",
      take: "Atlanta should give Bijan Robinson 25 carries.",
    }),
    filed({
      date: "2026-10-04",
      status: "held-up",
      postUrl: "https://x.com/ChipAbsolute/status/2106965618805412204",
      take: "Bryce Young over Jared Goff.",
    }),
  ]);
  assert.deepEqual(record.tally, { hits: 1, misses: 0, pending: 1 });
  assert.deepEqual(record.streak, { kind: "none", label: "No streak yet" });
  assert.equal(record.latest?.take, "Atlanta should give Bijan Robinson 25 carries.");
});

test("CI command fails clearly on a bad post URL", () => {
  withFiles(
    { "2026-10-05-bad.json": callFile({ postUrl: "https://example.com/not-a-post" }) },
    (directory) => {
      const result = spawnSync(process.execPath, ["--import", "tsx", "scripts/check-calls.ts", directory], {
        cwd: resolve("."),
        encoding: "utf8",
      });
      assert.equal(result.status, 1, result.stderr);
      assert.match(result.stderr, /2026-10-05-bad\.json — postUrl:/);
      assert.match(result.stderr, /ChipAbsolute/);
    },
  );
});
