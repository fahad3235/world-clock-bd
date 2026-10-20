/* world-clock-bd i18n.js - UI strings. Pure ASCII: BN via \uXXXX escapes. */
(function (root) {
  'use strict';
  var STRINGS = {
  "en": {
    "appTitle": "World Clock BD",
    "tagline": "Every timezone that matters to Bangladesh \u2014 live.",
    "clockTitle": "Live world clock",
    "searchPh": "Search a city to add\u2026",
    "addBtn": "Add",
    "dupMsg": "is already on your clock.",
    "noMatch": "No matching city found.",
    "removeTitle": "Remove",
    "convTitle": "Time converter",
    "dateLbl": "Date",
    "timeLbl": "Time",
    "fromLbl": "From",
    "convBtn": "Convert",
    "convEmpty": "Pick a date and time, then press Convert.",
    "badInput": "Enter a valid date and time.",
    "planTitle": "Meeting planner",
    "planBtn": "Plan",
    "planEmpty": "Pick a date and time, then press Plan.",
    "inHours": "In working hours",
    "outHours": "Outside hours",
    "bestWin": "Best call window (UTC)",
    "noWin": "No common 9\u20135 window on this date.",
    "emptyTitle": "No cities on your clock",
    "emptyText": "Search above to add the cities you care about.",
    "restoreBtn": "Restore defaults",
    "h12": "12H",
    "h24": "24H",
    "dhakaLbl": "HOME",
    "footer": "100% offline \u00b7 no accounts \u00b7 no tracking"
  },
  "bn": {
    "appTitle": "\u0993\u09af\u09bc\u09be\u09b0\u09cd\u09b2\u09cd\u09a1 \u0995\u09cd\u09b2\u0995 \u09ac\u09bf\u09a1\u09bf",
    "tagline": "\u09ac\u09be\u0982\u09b2\u09be\u09a6\u09c7\u09b6\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u0997\u09c1\u09b0\u09c1\u09a4\u09cd\u09ac\u09aa\u09c2\u09b0\u09cd\u09a3 \u09b8\u09ac \u099f\u09be\u0987\u09ae\u099c\u09cb\u09a8 \u2014 \u09b2\u09be\u0987\u09ad\u0964",
    "clockTitle": "\u09b2\u09be\u0987\u09ad \u09ac\u09bf\u09b6\u09cd\u09ac\u0998\u09a1\u09bc\u09bf",
    "searchPh": "\u09af\u09cb\u0997 \u0995\u09b0\u09a4\u09c7 \u09b6\u09b9\u09b0 \u0996\u09c1\u0981\u099c\u09c1\u09a8\u2026",
    "addBtn": "\u09af\u09cb\u0997 \u0995\u09b0\u09c1\u09a8",
    "dupMsg": "\u0987\u09a4\u09bf\u09ae\u09a7\u09cd\u09af\u09c7 \u0986\u09aa\u09a8\u09be\u09b0 \u0998\u09a1\u09bc\u09bf\u09a4\u09c7 \u0986\u099b\u09c7\u0964",
    "noMatch": "\u0995\u09cb\u09a8\u09cb \u09ae\u09bf\u09b2 \u09aa\u09be\u0993\u09af\u09bc\u09be \u09af\u09be\u09af\u09bc\u09a8\u09bf\u0964",
    "removeTitle": "\u09b8\u09b0\u09be\u09a8",
    "convTitle": "\u09b8\u09ae\u09af\u09bc \u09b0\u09c2\u09aa\u09be\u09a8\u09cd\u09a4\u09b0\u0995\u09be\u09b0\u09c0",
    "dateLbl": "\u09a4\u09be\u09b0\u09bf\u0996",
    "timeLbl": "\u09b8\u09ae\u09af\u09bc",
    "fromLbl": "\u0989\u09ce\u09b8",
    "convBtn": "\u09b0\u09c2\u09aa\u09be\u09a8\u09cd\u09a4\u09b0 \u0995\u09b0\u09c1\u09a8",
    "convEmpty": "\u09a4\u09be\u09b0\u09bf\u0996 \u0993 \u09b8\u09ae\u09af\u09bc \u09ac\u09c7\u099b\u09c7 \u09a8\u09bf\u09af\u09bc\u09c7 \u09b0\u09c2\u09aa\u09be\u09a8\u09cd\u09a4\u09b0 \u099a\u09be\u09aa\u09c1\u09a8\u0964",
    "badInput": "\u09b8\u09a0\u09bf\u0995 \u09a4\u09be\u09b0\u09bf\u0996 \u0993 \u09b8\u09ae\u09af\u09bc \u09a6\u09bf\u09a8\u0964",
    "planTitle": "\u09ae\u09bf\u099f\u09bf\u0982 \u09aa\u09b0\u09bf\u0995\u09b2\u09cd\u09aa\u09a8\u09be\u0995\u09be\u09b0\u09c0",
    "planBtn": "\u09aa\u09b0\u09bf\u0995\u09b2\u09cd\u09aa\u09a8\u09be \u0995\u09b0\u09c1\u09a8",
    "planEmpty": "\u09a4\u09be\u09b0\u09bf\u0996 \u0993 \u09b8\u09ae\u09af\u09bc \u09ac\u09c7\u099b\u09c7 \u09a8\u09bf\u09af\u09bc\u09c7 \u09aa\u09b0\u09bf\u0995\u09b2\u09cd\u09aa\u09a8\u09be \u099a\u09be\u09aa\u09c1\u09a8\u0964",
    "inHours": "\u0995\u09b0\u09cd\u09ae\u0998\u09a3\u09cd\u099f\u09be\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7",
    "outHours": "\u0995\u09b0\u09cd\u09ae\u0998\u09a3\u09cd\u099f\u09be\u09b0 \u09ac\u09be\u0987\u09b0\u09c7",
    "bestWin": "\u09b8\u09c7\u09b0\u09be \u0995\u09b2\u09c7\u09b0 \u09b8\u09ae\u09af\u09bc (UTC)",
    "noWin": "\u098f\u0987 \u09a4\u09be\u09b0\u09bf\u0996\u09c7 \u0995\u09cb\u09a8\u09cb \u09b8\u09be\u09a7\u09be\u09b0\u09a3 \u09ef\u2013\u09eb \u09b8\u09ae\u09af\u09bc \u09a8\u09c7\u0987\u0964",
    "emptyTitle": "\u0986\u09aa\u09a8\u09be\u09b0 \u0998\u09a1\u09bc\u09bf\u09a4\u09c7 \u0995\u09cb\u09a8\u09cb \u09b6\u09b9\u09b0 \u09a8\u09c7\u0987",
    "emptyText": "\u09aa\u099b\u09a8\u09cd\u09a6\u09c7\u09b0 \u09b6\u09b9\u09b0 \u09af\u09cb\u0997 \u0995\u09b0\u09a4\u09c7 \u0989\u09aa\u09b0\u09c7 \u0996\u09c1\u0981\u099c\u09c1\u09a8\u0964",
    "restoreBtn": "\u09a1\u09bf\u09ab\u09b2\u09cd\u099f \u09ab\u09bf\u09b0\u09bf\u09af\u09bc\u09c7 \u0986\u09a8\u09c1\u09a8",
    "h12": "\u09e7\u09e8\u0998\u09a3\u09cd\u099f\u09be",
    "h24": "\u09e8\u09ea\u0998\u09a3\u09cd\u099f\u09be",
    "dhakaLbl": "\u09b9\u09cb\u09ae",
    "footer": "\u09e7\u09e6\u09e6% \u0985\u09ab\u09b2\u09be\u0987\u09a8 \u00b7 \u0995\u09cb\u09a8\u09cb \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u09a8\u09c7\u0987 \u00b7 \u0995\u09cb\u09a8\u09cb \u099f\u09cd\u09b0\u09cd\u09af\u09be\u0995\u09bf\u0982 \u09a8\u09c7\u0987"
  }
};
  function t(lang, key) {
    var L = STRINGS[lang] || STRINGS.en;
    return L[key] !== undefined ? L[key] : (STRINGS.en[key] || key);
  }
  root.WCBI18N = { t: t, langs: ['en', 'bn'] };
})(typeof window !== 'undefined' ? window : globalThis);
