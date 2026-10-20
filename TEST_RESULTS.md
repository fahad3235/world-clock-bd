# TEST_RESULTS.md - world-clock-bd (factory run #98, 2026-10-20)

## Unit tests: `node tests/test-logic.mjs` - 37/37 PASS

Coverage: curated-zone count (>=60, actual 65), zoneById hit/miss, DST
boundaries (Dhaka +6 year-round; London 2026-01-15 +0 vs 2026-07-15 +1;
New York -5 vs -4), offset labels incl. Kathmandu UTC+5:45, 24h/12h/Bangla
formatting, hand-verified conversions, working-hour edges, Bangla + English
search, invalid input, unknown zones, best-call-window overlap logic,
Date-input acceptance, zoned round-trip.

Hand-verified conversions (2026-10-20 13:00 Asia/Dhaka = 07:00 UTC):
- Asia/Dubai (UTC+4)      -> 11:00:00
- Asia/Riyadh (UTC+3)     -> 10:00:00
- Europe/London (BST,+1)  -> 08:00:00
- America/New_York (EDT,-4)-> 03:00:00

NOTE: the task brief said "09:00 Dubai" for this case. That is wrong:
13:00 at UTC+6 minus 2 hours = 11:00 at UTC+4. The test asserts the correct
11:00:00. (Riyadh 10:00, London 08:00, New York 03:00 in the brief are right.)

Working-hour edges (Asia/Dhaka): 08:59 false, 09:00 true, 17:59 true,
18:00 false.

findZones: 'dhaka' and Bangla 'dhaka' both resolve Asia/Dhaka; empty and
no-match queries return [].

bestCallWindow: Dhaka-only on 2026-10-20 -> one range 03:00-12:00 UTC;
Dhaka+Sydney (Sydney on AEDT/UTC+11) -> 03:00-07:00 UTC;
Dhaka+Los Angeles (PDT/UTC-7) -> none (honest empty result).

(The first draft of the test wrongly expected Dhaka+Sydney to have no
window; hand-checking the arithmetic - Sydney 9-18 AEDT = 22:00-07:00 UTC,
Dhaka 9-18 = 03:00-12:00 UTC, overlap 03:00-07:00 - showed the CODE was
right and the test expectation was wrong. Test corrected.)

## Smoke tests: `node tests/smoke.mjs` - 24/24 PASS

Raw CDP over WebSocket against headless Chromium
(/opt/meta-chromium/chrome), file:// URL, fresh profile.

Desktop 1280x800 (16 checks): 10 default cards render; Dhaka card has .home
highlight; no horizontal overflow; seconds digits advance after ~1.3 s;
add Paris -> 11 cards; duplicate add rejected with inline message and no
duplicate card; remove -> 10 cards; list persists after reload; converter
2026-10-20 13:00 Dhaka renders 08:00 in the London card and all 10 grid
cities; empty date -> inline error; planner renders 10 rows with badges and a
visible best-window hint; Bangla toggle sets <html lang="bn">, renders the
Dhaka city name in Bengali and Bengali digits in the clock; language persists
after reload.

Mobile 390x844 (2 checks): no horizontal overflow; 10 cards render stacked.

Hygiene (2 checks): zero remote network requests (only file:// subresource
loads, which CDP logs but are not network traffic); zero console/page errors.

## Repairs made (all real, found by tests)

1. `convertTime` used `input instanceof Date`, which fails across JS realms
   (the unit test loads logic.js in a vm context). Changed to duck-typing
   (`typeof input.getTime === 'function'`) and copies the instant. Robustness
   fix; app behavior unchanged in-browser.
2. REAL APP BUG found by smoke test: three curated zone IDs are not valid
   IANA names and threw `RangeError: Invalid time zone` during init, which
   killed the whole app (no cards, no ticking, dead buttons):
   Asia/Doha -> Asia/Qatar, Asia/Beijing -> Asia/Ulaanbaatar,
   Asia/Male -> Indian/Maldives. Fixed in CURATED_ZONES and DEFAULT_CITIES.
3. Hardened app.js: `isValidZone()` added to logic.js; DEFAULT_CITIES and
   loaded city lists are filtered through it, so a zone unsupported by an old
   browser can never crash the app again.
4. Test-expectation corrections (not app bugs): en-GB 12-hour format renders
   lowercase "pm" (test now matches /pm/i); Dhaka+Sydney window expectation
   corrected to 03:00-07:00 UTC per hand arithmetic above.
5. Smoke-test network assertion refined: CDP logs file:// subresource loads
   as requests; the assertion now filters to http/https/ws schemes, i.e.
   "zero REMOTE network requests".

## Source hygiene

`grep -rP '[^\x00-\x7F]'` over the build dir: CLEAN. All Bengali strings are
\uXXXX escapes in JS; HTML carries no Bengali literals (toggle labels are set
by JS from i18n.js).

## Limitations

- Device clock must be correct (see README).
- Timezone database is the browser's ICU; zones the browser rejects are
  filtered out at startup.
- 65 curated zones, not full IANA.
- Working hours = fixed 09:00-17:59 local heuristic.
