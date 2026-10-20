/* world-clock-bd logic.js - pure functions, NO DOM. Pure ASCII: BN strings are \uXXXX escapes. */
(function (root) {
  'use strict';

  var CURATED_ZONES = [
  {
    "id": "Asia/Dhaka",
    "city": "Dhaka",
    "bn": "\u09a2\u09be\u0995\u09be"
  },
  {
    "id": "Asia/Dubai",
    "city": "Dubai",
    "bn": "\u09a6\u09c1\u09ac\u09be\u0987"
  },
  {
    "id": "Asia/Riyadh",
    "city": "Riyadh",
    "bn": "\u09b0\u09bf\u09af\u09bc\u09be\u09a6"
  },
  {
    "id": "Asia/Qatar",
    "city": "Doha",
    "bn": "\u09a6\u09cb\u09b9\u09be"
  },
  {
    "id": "Asia/Muscat",
    "city": "Muscat",
    "bn": "\u09ae\u09be\u09b8\u09cd\u0995\u09be\u099f"
  },
  {
    "id": "Asia/Kuala_Lumpur",
    "city": "Kuala Lumpur",
    "bn": "\u0995\u09c1\u09af\u09bc\u09be\u09b2\u09be\u09b2\u09be\u09ae\u09aa\u09c1\u09b0"
  },
  {
    "id": "Asia/Singapore",
    "city": "Singapore",
    "bn": "\u09b8\u09bf\u0999\u09cd\u0997\u09be\u09aa\u09c1\u09b0"
  },
  {
    "id": "Asia/Kolkata",
    "city": "Kolkata",
    "bn": "\u0995\u09b2\u0995\u09be\u09a4\u09be"
  },
  {
    "id": "Asia/Karachi",
    "city": "Karachi",
    "bn": "\u0995\u09b0\u09be\u099a\u09bf"
  },
  {
    "id": "Asia/Kathmandu",
    "city": "Kathmandu",
    "bn": "\u0995\u09be\u09a0\u09ae\u09be\u09a8\u09cd\u09a1\u09c1"
  },
  {
    "id": "Asia/Colombo",
    "city": "Colombo",
    "bn": "\u0995\u09b2\u09ae\u09cd\u09ac\u09cb"
  },
  {
    "id": "Asia/Bangkok",
    "city": "Bangkok",
    "bn": "\u09ac\u09cd\u09af\u09be\u0982\u0995\u0995"
  },
  {
    "id": "Asia/Jakarta",
    "city": "Jakarta",
    "bn": "\u099c\u09be\u0995\u09be\u09b0\u09cd\u09a4\u09be"
  },
  {
    "id": "Asia/Manila",
    "city": "Manila",
    "bn": "\u09ae\u09cd\u09af\u09be\u09a8\u09bf\u09b2\u09be"
  },
  {
    "id": "Asia/Hong_Kong",
    "city": "Hong Kong",
    "bn": "\u09b9\u0982\u0995\u0982"
  },
  {
    "id": "Asia/Shanghai",
    "city": "Shanghai",
    "bn": "\u09b8\u09be\u0982\u09b9\u09be\u0987"
  },
  {
    "id": "Asia/Tokyo",
    "city": "Tokyo",
    "bn": "\u099f\u09cb\u0995\u09bf\u0993"
  },
  {
    "id": "Asia/Seoul",
    "city": "Seoul",
    "bn": "\u09b8\u09bf\u0989\u09b2"
  },
  {
    "id": "Asia/Ulaanbaatar",
    "city": "Ulaanbaatar",
    "bn": "\u0989\u09b2\u09be\u09a8\u09ac\u09be\u099f\u09b0"
  },
  {
    "id": "Asia/Taipei",
    "city": "Taipei",
    "bn": "\u09a4\u09be\u0987\u09aa\u09c7"
  },
  {
    "id": "Asia/Yangon",
    "city": "Yangon",
    "bn": "\u0987\u09af\u09bc\u09be\u0982\u0997\u09c1\u09a8"
  },
  {
    "id": "Asia/Thimphu",
    "city": "Thimphu",
    "bn": "\u09a5\u09bf\u09ae\u09cd\u09aa\u09c1"
  },
  {
    "id": "Indian/Maldives",
    "city": "Male",
    "bn": "\u09ae\u09be\u09b2\u09c7"
  },
  {
    "id": "Asia/Kabul",
    "city": "Kabul",
    "bn": "\u0995\u09be\u09ac\u09c1\u09b2"
  },
  {
    "id": "Asia/Tehran",
    "city": "Tehran",
    "bn": "\u09a4\u09c7\u09b9\u09b0\u09be\u09a8"
  },
  {
    "id": "Asia/Baghdad",
    "city": "Baghdad",
    "bn": "\u09ac\u09be\u0997\u09a6\u09be\u09a6"
  },
  {
    "id": "Asia/Amman",
    "city": "Amman",
    "bn": "\u0986\u09ae\u09cd\u09ae\u09be\u09a8"
  },
  {
    "id": "Asia/Beirut",
    "city": "Beirut",
    "bn": "\u09ac\u09c8\u09b0\u09c1\u09a4"
  },
  {
    "id": "Asia/Jerusalem",
    "city": "Jerusalem",
    "bn": "\u099c\u09c7\u09b0\u09c1\u099c\u09be\u09b2\u09c7\u09ae"
  },
  {
    "id": "Asia/Kuwait",
    "city": "Kuwait City",
    "bn": "\u0995\u09c1\u09af\u09bc\u09c7\u09a4 \u09b8\u09bf\u099f\u09bf"
  },
  {
    "id": "Asia/Bahrain",
    "city": "Manama",
    "bn": "\u09ae\u09be\u09a8\u09be\u09ae\u09be"
  },
  {
    "id": "Asia/Tashkent",
    "city": "Tashkent",
    "bn": "\u09a4\u09be\u09b6\u0996\u09a8\u09cd\u09a6"
  },
  {
    "id": "Asia/Almaty",
    "city": "Almaty",
    "bn": "\u0986\u09b2\u09ae\u09be\u099f\u09bf"
  },
  {
    "id": "Asia/Dili",
    "city": "Dili",
    "bn": "\u09a6\u09bf\u09b2\u09bf"
  },
  {
    "id": "Europe/London",
    "city": "London",
    "bn": "\u09b2\u09a8\u09cd\u09a1\u09a8"
  },
  {
    "id": "Europe/Paris",
    "city": "Paris",
    "bn": "\u09aa\u09cd\u09af\u09be\u09b0\u09bf\u09b8"
  },
  {
    "id": "Europe/Berlin",
    "city": "Berlin",
    "bn": "\u09ac\u09be\u09b0\u09cd\u09b2\u09bf\u09a8"
  },
  {
    "id": "Europe/Rome",
    "city": "Rome",
    "bn": "\u09b0\u09cb\u09ae"
  },
  {
    "id": "Europe/Madrid",
    "city": "Madrid",
    "bn": "\u09ae\u09be\u09a6\u09cd\u09b0\u09bf\u09a6"
  },
  {
    "id": "Europe/Amsterdam",
    "city": "Amsterdam",
    "bn": "\u0986\u09ae\u09b8\u09cd\u099f\u09be\u09b0\u09a1\u09be\u09ae"
  },
  {
    "id": "Europe/Stockholm",
    "city": "Stockholm",
    "bn": "\u09b8\u09cd\u099f\u0995\u09b9\u09cb\u09ae"
  },
  {
    "id": "Europe/Athens",
    "city": "Athens",
    "bn": "\u098f\u09a5\u09c7\u09a8\u09cd\u09b8"
  },
  {
    "id": "Europe/Moscow",
    "city": "Moscow",
    "bn": "\u09ae\u09b8\u09cd\u0995\u09cb"
  },
  {
    "id": "Europe/Istanbul",
    "city": "Istanbul",
    "bn": "\u0987\u09b8\u09cd\u09a4\u09be\u09ae\u09cd\u09ac\u09c1\u09b2"
  },
  {
    "id": "America/New_York",
    "city": "New York",
    "bn": "\u09a8\u09bf\u0989\u0987\u09af\u09bc\u09b0\u09cd\u0995"
  },
  {
    "id": "America/Chicago",
    "city": "Chicago",
    "bn": "\u09b6\u09bf\u0995\u09be\u0997\u09cb"
  },
  {
    "id": "America/Denver",
    "city": "Denver",
    "bn": "\u09a1\u09c7\u09a8\u09ad\u09be\u09b0"
  },
  {
    "id": "America/Los_Angeles",
    "city": "Los Angeles",
    "bn": "\u09b2\u09b8 \u0985\u09cd\u09af\u09be\u099e\u09cd\u099c\u09c7\u09b2\u09c7\u09b8"
  },
  {
    "id": "America/Toronto",
    "city": "Toronto",
    "bn": "\u099f\u09b0\u09a8\u09cd\u099f\u09cb"
  },
  {
    "id": "America/Vancouver",
    "city": "Vancouver",
    "bn": "\u09ad\u09cd\u09af\u09be\u0999\u09cd\u0995\u09c1\u09ad\u09be\u09b0"
  },
  {
    "id": "America/Mexico_City",
    "city": "Mexico City",
    "bn": "\u09ae\u09c7\u0995\u09cd\u09b8\u09bf\u0995\u09cb \u09b8\u09bf\u099f\u09bf"
  },
  {
    "id": "America/Sao_Paulo",
    "city": "Sao Paulo",
    "bn": "\u09b8\u09be\u0993 \u09aa\u09be\u0993\u09b2\u09cb"
  },
  {
    "id": "America/Buenos_Aires",
    "city": "Buenos Aires",
    "bn": "\u09ac\u09c1\u09af\u09bc\u09c7\u09a8\u09cb\u09b8 \u0986\u0987\u09b0\u09c7\u09b8"
  },
  {
    "id": "America/Bogota",
    "city": "Bogota",
    "bn": "\u09ac\u09cb\u0997\u09cb\u099f\u09be"
  },
  {
    "id": "America/Lima",
    "city": "Lima",
    "bn": "\u09b2\u09bf\u09ae\u09be"
  },
  {
    "id": "America/Halifax",
    "city": "Halifax",
    "bn": "\u09b9\u09cd\u09af\u09be\u09b2\u09bf\u09ab\u09cd\u09af\u09be\u0995\u09cd\u09b8"
  },
  {
    "id": "Australia/Sydney",
    "city": "Sydney",
    "bn": "\u09b8\u09bf\u09a1\u09a8\u09bf"
  },
  {
    "id": "Australia/Melbourne",
    "city": "Melbourne",
    "bn": "\u09ae\u09c7\u09b2\u09ac\u09cb\u09b0\u09cd\u09a8"
  },
  {
    "id": "Australia/Perth",
    "city": "Perth",
    "bn": "\u09aa\u09be\u09b0\u09cd\u09a5"
  },
  {
    "id": "Pacific/Auckland",
    "city": "Auckland",
    "bn": "\u0985\u0995\u09b2\u09cd\u09af\u09be\u09a8\u09cd\u09a1"
  },
  {
    "id": "Pacific/Honolulu",
    "city": "Honolulu",
    "bn": "\u09b9\u09a8\u09b2\u09c1\u09b2\u09c1"
  },
  {
    "id": "Africa/Cairo",
    "city": "Cairo",
    "bn": "\u0995\u09be\u09af\u09bc\u09b0\u09cb"
  },
  {
    "id": "Africa/Lagos",
    "city": "Lagos",
    "bn": "\u09b2\u09be\u0997\u09cb\u09b8"
  },
  {
    "id": "Africa/Nairobi",
    "city": "Nairobi",
    "bn": "\u09a8\u09be\u0987\u09b0\u09cb\u09ac\u09bf"
  },
  {
    "id": "Africa/Johannesburg",
    "city": "Johannesburg",
    "bn": "\u099c\u09cb\u09b9\u09be\u09a8\u09c7\u09b8\u09ac\u09be\u09b0\u09cd\u0997"
  }
];

  function isValidZone(id) {
    try { new Intl.DateTimeFormat('en-US', { timeZone: id }); return true; }
    catch (e) { return false; }
  }

  function zoneById(id) {
    for (var i = 0; i < CURATED_ZONES.length; i++) {
      if (CURATED_ZONES[i].id === id) return CURATED_ZONES[i];
    }
    return null;
  }

  function partsInZone(date, tz) {
    var dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, hourCycle: 'h23'
    });
    var out = {};
    dtf.formatToParts(date).forEach(function (p) { out[p.type] = p.value; });
    return out;
  }

  // offset of tz from UTC in whole minutes at the given instant (DST-aware)
  function utcOffsetMinutes(date, tz) {
    var p = partsInZone(date, tz);
    var asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    return Math.round((asUTC - date.getTime()) / 60000);
  }

  function offsetLabel(date, tz) {
    var m = utcOffsetMinutes(date, tz);
    var sign = m < 0 ? '-' : '+';
    var a = Math.abs(m);
    var h = Math.floor(a / 60), mm = a % 60;
    return 'UTC' + sign + h + (mm ? ':' + (mm < 10 ? '0' + mm : '' + mm) : '');
  }

  // format an instant in a zone. opts: {hour12: bool, lang: 'en'|'bn'}
  // returns {time: "HH:MM:SS", date: "Weekday, DD Mon YYYY"}
  function formatInZone(date, tz, opts) {
    opts = opts || {};
    var hour12 = opts.hour12 !== false;
    var locale = opts.lang === 'bn' ? 'bn-BD-u-nu-beng' : 'en-GB';
    var t = new Intl.DateTimeFormat(locale, {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: hour12
    }).format(date);
    // fix "24:xx" midnight artefact some engines produce in hour12:false mode
    if (!hour12) t = t.replace(/^24:/, '00:');
    var d = new Intl.DateTimeFormat(locale, {
      timeZone: tz, weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'
    }).format(date);
    return { time: t, date: d };
  }

  // interpret wall-clock components as belonging to fromTz -> UTC instant
  function zonedComponentsToDate(y, mo, d, h, mi, tz) {
    var guess = Date.UTC(y, mo - 1, d, h, mi, 0);
    for (var i = 0; i < 3; i++) {
      var off = utcOffsetMinutes(new Date(guess), tz);
      guess = Date.UTC(y, mo - 1, d, h, mi, 0) - off * 60000;
    }
    return new Date(guess);
  }

  // parse "YYYY-MM-DDTHH:MM" (or with seconds); returns component obj or null
  function parseLocalInput(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(s || '').trim());
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3], h = +m[4], mi = +m[5], se = m[6] ? +m[6] : 0;
    if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59 || se > 59) return null;
    var dt = new Date(Date.UTC(y, mo - 1, d, h, mi, se));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
    return { y: y, mo: mo, d: d, h: h, mi: mi, se: se };
  }

  // input: "YYYY-MM-DDTHH:MM" string or Date instant; fromTz used only for strings
  // returns [{id, city, bn, time, date, offset, inWorking}]
  function convertTime(input, fromTz, toTzList, opts) {
    opts = opts || {};
    var instant;
    if (input && typeof input.getTime === 'function') {
      if (isNaN(input.getTime())) return null;
      instant = new Date(input.getTime());
    } else {
      var c = parseLocalInput(input);
      if (!c || !zoneById(fromTz)) return null;
      instant = zonedComponentsToDate(c.y, c.mo, c.d, c.h, c.mi, fromTz);
    }
    return toTzList.map(function (id) {
      var z = zoneById(id);
      if (!z) return { id: id, city: id, bn: id, time: '?', date: '?', offset: '?', inWorking: false, unknown: true };
      var f = formatInZone(instant, id, opts);
      return {
        id: id, city: z.city, bn: z.bn,
        time: f.time, date: f.date,
        offset: offsetLabel(instant, id),
        inWorking: isWorkingHour(instant, id)
      };
    });
  }

  // true when local hour in tz is within [9, 18)
  function isWorkingHour(date, tz) {
    var p = partsInZone(date, tz);
    var h = +p.hour;
    return h >= 9 && h < 18;
  }

  function localHour(date, tz) { return +partsInZone(date, tz).hour; }

  // case-insensitive substring match on EN name, BN name, and IANA id
  function findZones(query) {
    var q = String(query || '').trim().toLowerCase();
    if (!q) return [];
    return CURATED_ZONES.filter(function (z) {
      return z.city.toLowerCase().indexOf(q) !== -1 ||
             z.bn.indexOf(q) !== -1 ||
             z.id.toLowerCase().indexOf(q) !== -1;
    });
  }

  // common 9-5 window across zone ids on the calendar date (UTC day) of `date`
  // returns array of {startUTC, endUTC} hour ranges (contiguous), possibly []
  function bestCallWindow(date, zoneIds) {
    var dayStart = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    var good = [];
    for (var h = 0; h < 24; h++) {
      var inst = new Date(dayStart + h * 3600000);
      var ok = zoneIds.every(function (id) { return isWorkingHour(inst, id); });
      if (ok) good.push(h);
    }
    var ranges = [];
    good.forEach(function (h) {
      var last = ranges[ranges.length - 1];
      if (last && last.endUTC === h) last.endUTC = h + 1;
      else ranges.push({ startUTC: h, endUTC: h + 1 });
    });
    return ranges;
  }

  root.WCB = {
    CURATED_ZONES: CURATED_ZONES,
    zoneById: zoneById,
    isValidZone: isValidZone,
    utcOffsetMinutes: utcOffsetMinutes,
    offsetLabel: offsetLabel,
    formatInZone: formatInZone,
    parseLocalInput: parseLocalInput,
    zonedComponentsToDate: zonedComponentsToDate,
    convertTime: convertTime,
    isWorkingHour: isWorkingHour,
    localHour: localHour,
    findZones: findZones,
    bestCallWindow: bestCallWindow
  };
})(typeof window !== 'undefined' ? window : globalThis);

