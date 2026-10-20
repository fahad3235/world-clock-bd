// world-clock-bd unit tests (node). Pure ASCII. Run: node tests/test-logic.mjs
import { readFileSync } from 'fs';
import vm from 'vm';

const src = readFileSync(new URL('../js/logic.js', import.meta.url), 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const W = sandbox.WCB || sandbox.globalThis.WCB;

let pass = 0, fail = 0;
const failures = [];
function eq(actual, expected, name) {
  if (actual === expected) { pass++; }
  else { fail++; failures.push(name + ' | expected: ' + JSON.stringify(expected) + ' got: ' + JSON.stringify(actual)); }
}
function ok(cond, name) {
  if (cond) { pass++; }
  else { fail++; failures.push(name + ' | condition false'); }
}

// hand-verified instants
const JAN = new Date(Date.UTC(2026, 0, 15, 12, 0, 0)); // 2026-01-15
const JUL = new Date(Date.UTC(2026, 6, 15, 12, 0, 0)); // 2026-07-15
const OCT20 = new Date(Date.UTC(2026, 9, 20, 7, 0, 0)); // 2026-10-20 13:00 Dhaka = 07:00 UTC

// 1-3 curated zones
ok(Array.isArray(W.CURATED_ZONES) && W.CURATED_ZONES.length >= 60, 'zones >= 60 (got ' + W.CURATED_ZONES.length + ')');
ok(!!W.zoneById('Asia/Dhaka'), 'zoneById Dhaka');
eq(W.zoneById('Asia/Nope'), null, 'zoneById unknown -> null');

// 4-7 DST boundaries
eq(W.utcOffsetMinutes(JAN, 'Asia/Dhaka'), 360, 'Dhaka offset Jan = +6');
eq(W.utcOffsetMinutes(JUL, 'Asia/Dhaka'), 360, 'Dhaka offset Jul = +6 (no DST)');
eq(W.utcOffsetMinutes(JAN, 'Europe/London'), 0, 'London offset Jan = +0 (GMT)');
eq(W.utcOffsetMinutes(JUL, 'Europe/London'), 60, 'London offset Jul = +1 (BST)');
eq(W.utcOffsetMinutes(JAN, 'America/New_York'), -300, 'NewYork offset Jan = -5 (EST)');
eq(W.utcOffsetMinutes(JUL, 'America/New_York'), -240, 'NewYork offset Jul = -4 (EDT)');

// 8-10 offset labels
eq(W.offsetLabel(JUL, 'Asia/Dhaka'), 'UTC+6', 'offsetLabel Dhaka');
eq(W.offsetLabel(JUL, 'America/New_York'), 'UTC-4', 'offsetLabel NewYork Jul');
eq(W.offsetLabel(JUL, 'Asia/Kathmandu'), 'UTC+5:45', 'offsetLabel Kathmandu half-quarter');

// 11-13 formatting
eq(W.formatInZone(OCT20, 'Asia/Dhaka', { hour12: false, lang: 'en' }).time, '13:00:00', 'format 24h Dhaka');
ok(/pm/i.test(W.formatInZone(OCT20, 'Asia/Dhaka', { hour12: true, lang: 'en' }).time), 'format 12h has am/pm marker');
const bnFmt = W.formatInZone(OCT20, 'Asia/Dhaka', { hour12: false, lang: 'bn' });
ok(/^[\u09E6-\u09EF: ]+$/.test(bnFmt.time), 'bn time uses Bengali digits (got ' + bnFmt.time + ')');
ok(bnFmt.date.indexOf('2026') === -1 && /[\u0980-\u09FF]/.test(bnFmt.date), 'bn date is Bengali (got ' + bnFmt.date + ')');

// 14-17 hand-verified conversions (2026-10-20 13:00 Dhaka)
// NOTE: task brief said "09:00 Dubai" - that is wrong: Dhaka UTC+6, Dubai UTC+4 => 11:00. Verified by hand.
const conv = W.convertTime('2026-10-20T13:00', 'Asia/Dhaka',
  ['Asia/Dubai', 'Asia/Riyadh', 'Europe/London', 'America/New_York'], { hour12: false, lang: 'en' });
const byId = {}; conv.forEach(function (r) { byId[r.id] = r.time; });
eq(byId['Asia/Dubai'], '11:00:00', 'convert Dhaka->Dubai = 11:00');
eq(byId['Asia/Riyadh'], '10:00:00', 'convert Dhaka->Riyadh = 10:00');
eq(byId['Europe/London'], '08:00:00', 'convert Dhaka->London = 08:00 (BST)');
eq(byId['America/New_York'], '03:00:00', 'convert Dhaka->NewYork = 03:00 (EDT)');

// 18-21 working-hour edges (Dhaka local)
function dhakaAt(h, mi) {
  const base = Date.UTC(2026, 9, 20, 0, 0, 0);
  return new Date(base + (h - 6) * 3600000 + mi * 60000); // Dhaka = UTC+6
}
eq(W.isWorkingHour(dhakaAt(8, 59), 'Asia/Dhaka'), false, 'working 08:59 -> false');
eq(W.isWorkingHour(dhakaAt(9, 0), 'Asia/Dhaka'), true, 'working 09:00 -> true');
eq(W.isWorkingHour(dhakaAt(17, 59), 'Asia/Dhaka'), true, 'working 17:59 -> true');
eq(W.isWorkingHour(dhakaAt(18, 0), 'Asia/Dhaka'), false, 'working 18:00 -> false');

// 22-24 findZones
ok(W.findZones('dhaka').some(function (z) { return z.id === 'Asia/Dhaka'; }), "findZones('dhaka')");
ok(W.findZones('\u09a2\u09be\u0995\u09be').some(function (z) { return z.id === 'Asia/Dhaka'; }), "findZones(BN dhaka)");
eq(W.findZones('zzz-no-such-city').length, 0, 'findZones no match -> []');
eq(W.findZones('').length, 0, 'findZones empty -> []');

// 25-28 invalid / edge inputs
eq(W.convertTime('not-a-date', 'Asia/Dhaka', ['Asia/Dubai']), null, 'convertTime bad input -> null');
eq(W.convertTime('2026-13-40T99:99', 'Asia/Dhaka', ['Asia/Dubai']), null, 'convertTime impossible date -> null');
const unk = W.convertTime('2026-10-20T13:00', 'Asia/Dhaka', ['Asia/Nowhere'], { hour12: false });
eq(unk[0].unknown, true, 'convertTime unknown zone -> unknown row');
eq(W.parseLocalInput('2026-02-30T10:00'), null, 'parseLocalInput Feb 30 -> null');

// 29-30 bestCallWindow
const w1 = W.bestCallWindow(new Date(Date.UTC(2026, 9, 20, 12, 0)), ['Asia/Dhaka']);
eq(JSON.stringify(w1), JSON.stringify([{ startUTC: 3, endUTC: 12 }]), 'bestCallWindow Dhaka-only = 03-12 UTC');
const w2 = W.bestCallWindow(new Date(Date.UTC(2026, 9, 20, 12, 0)), ['Asia/Dhaka', 'Australia/Sydney']);
eq(JSON.stringify(w2), JSON.stringify([{ startUTC: 3, endUTC: 7 }]), 'bestCallWindow Dhaka+Sydney = 03-07 UTC (Sydney AEDT)');
const w3 = W.bestCallWindow(new Date(Date.UTC(2026, 9, 20, 12, 0)), ['Asia/Dhaka', 'America/Los_Angeles']);
eq(w3.length, 0, 'bestCallWindow Dhaka+LosAngeles = none (honest)');

// 31-32 Date input + round trip
const viaDate = W.convertTime(OCT20, 'Asia/Dhaka', ['Asia/Dubai'], { hour12: false, lang: 'en' });
eq(viaDate[0].time, '11:00:00', 'convertTime accepts Date instant');
const rt = W.zonedComponentsToDate(2026, 10, 20, 13, 0, 'Asia/Dhaka');
eq(W.formatInZone(rt, 'Asia/Dhaka', { hour12: false, lang: 'en' }).time, '13:00:00', 'zoned round-trip Dhaka 13:00');

console.log('PASS: ' + pass + '  FAIL: ' + fail);
if (failures.length) { console.log('FAILURES:'); failures.forEach(function (f) { console.log('  - ' + f); }); }
process.exit(fail ? 1 : 0);
