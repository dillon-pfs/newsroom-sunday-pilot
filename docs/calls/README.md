# File a call

`/calls` is Chip Absolute's scoreboard: one take, the post, the result, and whether it held up. Add one JSON file per take. Do not edit an index. The page sorts newest `date` first, then later posts on that date.

## Add a call

1. Create `content/calls/YYYY-MM-DD-short-slug.json`. The date prefix must match `date`. Use lowercase words and single hyphens: `2026-10-05-bijan-carries.json`.
2. Paste the template below and replace every placeholder. One call per file.
3. Run `npm run check:calls`.
4. Open a pull request. The Preview build reads this folder. Check `/calls` on that Preview.

`window` and `note` are optional. Delete those lines when they are unused. Do not leave them as empty strings.

## Template

```json
{
  "date": "2026-10-05",
  "game": "ATL at NO",
  "window": "MNF",
  "take": "One line. The take, as posted.",
  "postUrl": "https://x.com/ChipAbsolute/status/0000000000000000000",
  "result": "What the game did, in one line.",
  "status": "still-arguing",
  "note": "Optional extra line. Delete this field when unused."
}
```

## Fields

| Field | Required | How to file |
| --- | --- | --- |
| `date` | Yes | Real calendar date, `"YYYY-MM-DD"`. This is the sort key and the filename prefix. |
| `game` | Yes | Matchup, away team first, e.g. `DET at CAR`. |
| `window` | No | Short label such as `MNF`. Omit the field when there is nothing to add. |
| `take` | Yes | One line. The take Chip posted. |
| `postUrl` | Yes | Exactly `https://x.com/ChipAbsolute/status/<id>`, digits only after `status/`. No other host, account, query string, or trailing slash. One post, one file. |
| `result` | Yes | Verified result, one line. |
| `status` | Yes | The grade. `held-up` is a hit, `missed` is a miss, `still-arguing` is pending. There is no separate grade field. |
| `note` | No | Extra line under the result. Omit the field when unused. |

`status` is the only grade. New calls start as `still-arguing` (pending) until the result is in, then move to `held-up` or `missed`. Anything that is not one of those two graded values counts as pending. The page labels them **Held up**, **Missed**, and **Pending**.

## Chip’s record

The block at the top of `/calls` reads the same `status` field:

- **Tally:** hits (`held-up`), misses (`missed`), and pending (everything else, including `still-arguing`).
- **Streak:** graded calls only, newest first. Pending calls are skipped. Two or more hits in a row is hot (“Hot: N straight held up”). Two or more misses in a row is cold (“Cold: N straight missed”). One graded call, a split, or no graded calls is “No streak yet.”
- **Latest:** the newest `date`, pending or not. A later post wins a same-day tie.

## If the check is red

Run `npm run check:calls`. Errors name the file, the field, and the fix:

```text
content/calls/example.json — date: Use a real calendar date in YYYY-MM-DD format.
content/calls/example.json — status: Use status "held-up", "missed", or "still-arguing".
content/calls/example.json — postUrl: Use an https://x.com/ChipAbsolute/status/<id> URL. Other hosts, accounts, and query strings are rejected.
content/calls/example.json — take: Add Chip's one-line take.
content/calls/example.json — result: Add the verified result.
content/calls/example.json — postUrl: "https://x.com/ChipAbsolute/status/123" is already used by content/calls/other.json. Each post can be filed once.
```

Fix every listed line and run the check again. A bad date, an unknown status, a non-Chip or non-X post, an empty take or result, a repeated `postUrl`, unknown fields, and broken JSON all fail. `npm run build` runs the same check, so a bad file cannot ship a Preview.
