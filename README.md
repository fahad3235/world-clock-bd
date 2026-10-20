# World Clock BD

Offline bilingual (English / Bangla) world clock, timezone converter and meeting
planner built for Bangladesh: diaspora families timing calls home, and
freelancers coordinating with foreign clients.

## Problem

Calling family in Dubai, Riyadh, London or Sydney from Dhaka means doing
timezone math in your head, and DST changes twice a year break the mental
model. World Clock BD shows the times that matter to Bangladesh live, converts
any moment between zones, and tells you honestly when a meeting fits everyone's
working hours.

## Features

1. **Live world-clock grid** - Asia/Dhaka plus 9 diaspora presets (Dubai,
   Riyadh, Doha, Muscat, Kuala Lumpur, London, New York, Toronto, Sydney),
   ticking every second. Each card shows city, HH:MM:SS, date and UTC offset.
   Dhaka is highlighted as home.
2. **Add / remove cities** - search across 65 curated zones (English + Bangla
   names); duplicates are rejected with an inline message; per-card remove;
   the list persists in localStorage.
3. **Time converter** - date + time + source zone, converted into every city
   on your grid. Inline validation for bad input.
4. **Meeting planner** - date + time (defaults to now, source Asia/Dhaka);
   per-city row with converted local time and an "In working hours" /
   "Outside hours" badge (09:00-17:59 local). A "best call window" hint shows
   the UTC hours when all selected cities overlap in working hours - or says
   honestly when there is none.
5. **12/24-hour toggle + EN/Bangla toggle** - persisted; Bangla mode renders
   Bengali digits and Bengali city/date names. Responsive down to 390 px.
   Zero network requests: no CDN, no fonts, no tracking.
6. **Empty / error states** - no-cities placeholder with a Restore-defaults
   button; converter and planner empty states; inline validation messages.

## Stack

Pure static: HTML + CSS + vanilla JS. All timezone math via
`Intl.DateTimeFormat` with the `timeZone` option, so DST is handled by the
platform. No build step, no dependencies, no backend.

## Prerequisites

Any modern browser (for the app) and Node.js 18+ (for the tests).

## Install / run

No install. Open `index.html` in a browser, or serve the folder:

    npx serve .
    # or
    python3 -m http.server 8000

## Dev commands

    node tests/test-logic.mjs   # 37 unit tests on js/logic.js
    node tests/smoke.mjs        # 24 headless-Chrome CDP checks (desktop + mobile)

## Env

None. There are no secrets, no API keys, no backend. Preferences (cities,
language, 12/24h) live in the browser's localStorage only.

## Testing

See `TEST_RESULTS.md` for exact counts, hand-verified values and repairs.
Unit tests cover DST boundaries (London +0/+1, New York -5/-4, Dhaka always
+6), hand-verified conversions, working-hour edges, Bangla search, invalid
input, and the meeting-window overlap logic. The smoke test drives the real
page in headless Chrome: live ticking, add/remove/persistence, converter,
planner badges, Bangla toggle + persistence, 390 px layout, zero remote
network requests, zero console errors.

## Deployment

Static hosting (e.g. GitHub Pages): publish the folder as-is. No build.

## Limitations

- Times come from the device clock: if the system clock is wrong, every clock
  shown is wrong.
- Timezone data comes from the browser's ICU: very old browsers may lack some
  zones (the app filters out any zone the browser rejects).
- City list is a curated set of 65 zones, not the full IANA database.
- "Working hours" is a fixed 09:00-17:59 local heuristic, not per-country
  labor law.

## Status

Built and verified 2026-10-20 (factory run #98): 37/37 unit tests pass,
24/24 headless-Chrome smoke checks pass, zero console errors, pure-ASCII
sources verified.
