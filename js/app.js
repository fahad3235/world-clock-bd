/* world-clock-bd app.js - DOM glue. Pure ASCII (Bengali via \uXXXX escapes). */
(function () {
  'use strict';
  var W = window.WCB;
  var T = function (k) { return window.WCBI18N.t(state.lang, k); };

  var DEFAULT_CITIES = [
    'Asia/Dhaka', 'Asia/Dubai', 'Asia/Riyadh', 'Asia/Qatar', 'Asia/Muscat',
    'Asia/Kuala_Lumpur', 'Europe/London', 'America/New_York',
    'America/Toronto', 'Australia/Sydney'
  ];
  var LS_CITIES = 'wcb_cities', LS_LANG = 'wcb_lang', LS_HOUR = 'wcb_hour12';

  function loadCities() {
    try {
      var raw = localStorage.getItem(LS_CITIES);
      if (!raw) return DEFAULT_CITIES.slice();
      var arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return DEFAULT_CITIES.slice();
      return arr.filter(function (id) { return !!W.zoneById(id) && W.isValidZone(id); });
    } catch (e) { return DEFAULT_CITIES.slice(); }
  }

  DEFAULT_CITIES = DEFAULT_CITIES.filter(function (id) { return W.isValidZone(id); });
  var state = {
    cities: loadCities(),
    lang: (function () { var l = null; try { l = localStorage.getItem(LS_LANG); } catch (e) {} return l === 'bn' ? 'bn' : 'en'; })(),
    hour12: (function () { var h = null; try { h = localStorage.getItem(LS_HOUR); } catch (e) {} return h === '0' ? false : true; })()
  };

  function persist() {
    try {
      localStorage.setItem(LS_CITIES, JSON.stringify(state.cities));
      localStorage.setItem(LS_LANG, state.lang);
      localStorage.setItem(LS_HOUR, state.hour12 ? '1' : '0');
    } catch (e) {}
  }

  function $(id) { return document.getElementById(id); }
  function cityName(z) { return state.lang === 'bn' ? z.bn : z.city; }
  function fmtOpts() { return { hour12: state.hour12, lang: state.lang }; }

  function applyI18n() {
    document.documentElement.lang = state.lang === 'bn' ? 'bn' : 'en';
    $('appTitle').textContent = T('appTitle');
    $('tagline').textContent = T('tagline');
    $('clockTitle').textContent = T('clockTitle');
    $('citySearch').placeholder = T('searchPh');
    $('addBtn').textContent = T('addBtn');
    $('convTitle').textContent = T('convTitle');
    $('dateLbl1').textContent = T('dateLbl');
    $('timeLbl1').textContent = T('timeLbl');
    $('fromLbl').textContent = T('fromLbl');
    $('convBtn').textContent = T('convBtn');
    $('planTitle').textContent = T('planTitle');
    $('dateLbl2').textContent = T('dateLbl');
    $('timeLbl2').textContent = T('timeLbl');
    $('planBtn').textContent = T('planBtn');
    $('footer').textContent = T('footer');
    $('hourToggle').textContent = state.hour12 ? T('h12') : T('h24');
    $('langToggle').textContent = T('langName');
    $('emptyTitle').textContent = T('emptyTitle');
    $('emptyText').textContent = T('emptyText');
    $('restoreBtn').textContent = T('restoreBtn');
    var dl = $('cityList'); dl.innerHTML = '';
    W.CURATED_ZONES.forEach(function (z) {
      var o = document.createElement('option');
      o.value = cityName(z);
      o.setAttribute('data-zone', z.id);
      dl.appendChild(o);
    });
    var from = $('convFrom'); var prev = from.value || 'Asia/Dhaka';
    from.innerHTML = '';
    W.CURATED_ZONES.forEach(function (z) {
      var o = document.createElement('option');
      o.value = z.id; o.textContent = cityName(z) + ' (' + z.id + ')';
      from.appendChild(o);
    });
    if (W.zoneById(prev)) from.value = prev; else from.value = 'Asia/Dhaka';
  }

  function renderGrid() {
    var grid = $('clockGrid'); grid.innerHTML = '';
    var now = new Date();
    state.cities.forEach(function (id) {
      var z = W.zoneById(id); if (!z) return;
      var f = W.formatInZone(now, id, fmtOpts());
      var card = document.createElement('div');
      card.className = 'card' + (id === 'Asia/Dhaka' ? ' home' : '');
      card.setAttribute('data-zone', id);
      var h = document.createElement('div'); h.className = 'city'; h.textContent = cityName(z);
      card.appendChild(h);
      if (id === 'Asia/Dhaka') {
        var b = document.createElement('span'); b.className = 'homebadge'; b.textContent = T('dhakaLbl');
        card.appendChild(b);
      }
      var tm = document.createElement('div'); tm.className = 'time card-time'; tm.textContent = f.time;
      var dt = document.createElement('div'); dt.className = 'date card-date'; dt.textContent = f.date;
      var off = document.createElement('span'); off.className = 'offset card-offset';
      off.textContent = W.offsetLabel(now, id);
      var rm = document.createElement('button'); rm.className = 'rm'; rm.type = 'button';
      rm.textContent = '\u00d7'; rm.title = T('removeTitle'); rm.setAttribute('aria-label', T('removeTitle') + ' ' + cityName(z));
      rm.setAttribute('data-remove', id);
      rm.addEventListener('click', function () { removeCity(id); });
      card.appendChild(tm); card.appendChild(dt); card.appendChild(off); card.appendChild(rm);
      grid.appendChild(card);
    });
    $('emptyState').hidden = state.cities.length !== 0;
    grid.style.display = state.cities.length === 0 ? 'none' : '';
  }

  function tick() {
    var now = new Date();
    var cards = document.querySelectorAll('#clockGrid .card');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var id = card.getAttribute('data-zone');
      var f = W.formatInZone(now, id, fmtOpts());
      card.querySelector('.card-time').textContent = f.time;
      card.querySelector('.card-date').textContent = f.date;
      card.querySelector('.card-offset').textContent = W.offsetLabel(now, id);
    }
  }

  function addCity() {
    var input = $('citySearch');
    var q = input.value.trim();
    var msg = $('addMsg');
    if (!q) { msg.textContent = ''; msg.className = 'msg'; return; }
    var matches = W.findZones(q);
    var exact = null;
    for (var i = 0; i < matches.length; i++) {
      var z = matches[i];
      if (z.city.toLowerCase() === q.toLowerCase() || z.bn === q || z.id.toLowerCase() === q.toLowerCase()) { exact = z; break; }
    }
    exact = exact || matches[0];
    if (!exact) { msg.textContent = T('noMatch'); msg.className = 'msg err'; return; }
    if (state.cities.indexOf(exact.id) !== -1) {
      msg.textContent = cityName(exact) + ' ' + T('dupMsg');
      msg.className = 'msg err';
      return;
    }
    state.cities.push(exact.id);
    persist();
    input.value = '';
    msg.textContent = '';
    msg.className = 'msg';
    renderGrid();
  }

  function removeCity(id) {
    state.cities = state.cities.filter(function (x) { return x !== id; });
    persist();
    renderGrid();
  }

  function resultCard(r) {
    var card = document.createElement('div');
    card.className = 'card'; card.setAttribute('data-zone', r.id);
    var h = document.createElement('div'); h.className = 'city'; h.textContent = state.lang === 'bn' ? r.bn : r.city;
    var tm = document.createElement('div'); tm.className = 'time card-time'; tm.textContent = r.time;
    var dt = document.createElement('div'); dt.className = 'date card-date'; dt.textContent = r.date;
    var off = document.createElement('span'); off.className = 'offset card-offset'; off.textContent = r.offset;
    card.appendChild(h); card.appendChild(tm); card.appendChild(dt); card.appendChild(off);
    return card;
  }

  function doConvert() {
    var d = $('convDate').value, t = $('convTime').value, from = $('convFrom').value;
    var msg = $('convMsg'), grid = $('convGrid');
    msg.textContent = '';
    if (!d || !t) { msg.textContent = T('badInput'); grid.innerHTML = ''; $('convEmpty').hidden = false; return; }
    var res = W.convertTime(d + 'T' + t, from, state.cities, fmtOpts());
    if (!res) { msg.textContent = T('badInput'); grid.innerHTML = ''; $('convEmpty').hidden = false; return; }
    $('convEmpty').hidden = true;
    grid.innerHTML = '';
    res.forEach(function (r) { grid.appendChild(resultCard(r)); });
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function setPlannerDefault() {
    var now = new Date();
    var d = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    var t = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now);
    $('planDate').value = d;
    $('planTime').value = t;
  }

  function fmtRange(r) {
    return pad(r.startUTC) + ':00-' + pad(r.endUTC) + ':00 UTC';
  }

  function doPlan() {
    var d = $('planDate').value, t = $('planTime').value;
    var msg = $('planMsg'), rows = $('planRows'), win = $('planWindow');
    msg.textContent = ''; rows.innerHTML = ''; win.hidden = true; win.innerHTML = '';
    if (!d || !t) { msg.textContent = T('badInput'); $('planEmpty').hidden = false; return; }
    var comp = W.parseLocalInput(d + 'T' + t);
    if (!comp) { msg.textContent = T('badInput'); $('planEmpty').hidden = false; return; }
    if (state.cities.length === 0) { msg.textContent = T('emptyText'); return; }
    var instant = W.zonedComponentsToDate(comp.y, comp.mo, comp.d, comp.h, comp.mi, 'Asia/Dhaka');
    $('planEmpty').hidden = true;
    state.cities.forEach(function (id) {
      var z = W.zoneById(id); if (!z) return;
      var f = W.formatInZone(instant, id, fmtOpts());
      var inW = W.isWorkingHour(instant, id);
      var row = document.createElement('div');
      row.className = 'prow'; row.setAttribute('data-zone', id);
      var left = document.createElement('div');
      var c = document.createElement('div'); c.className = 'pcity'; c.textContent = cityName(z);
      var tm = document.createElement('div'); tm.className = 'ptime prow-time'; tm.textContent = f.time;
      var dt = document.createElement('div'); dt.className = 'pdate'; dt.textContent = f.date + ' - ' + W.offsetLabel(instant, id);
      left.appendChild(c); left.appendChild(tm); left.appendChild(dt);
      var badge = document.createElement('span');
      badge.className = 'badge prow-badge ' + (inW ? 'in' : 'out');
      badge.textContent = inW ? T('inHours') : T('outHours');
      row.appendChild(left); row.appendChild(badge);
      rows.appendChild(row);
    });
    var ranges = W.bestCallWindow(instant, state.cities);
    win.hidden = false;
    var strong = document.createElement('strong');
    strong.textContent = T('bestWin') + ': ';
    win.appendChild(strong);
    win.appendChild(document.createTextNode(
      ranges.length ? ranges.map(fmtRange).join(', ') : T('noWin')
    ));
  }

  function init() {
    applyI18n();
    $('convEmpty').textContent = T('convEmpty');
    $('planEmpty').textContent = T('planEmpty');
    setPlannerDefault();
    renderGrid();
    $('addBtn').addEventListener('click', addCity);
    $('citySearch').addEventListener('keydown', function (e) { if (e.key === 'Enter') addCity(); });
    $('convBtn').addEventListener('click', doConvert);
    $('planBtn').addEventListener('click', doPlan);
    $('restoreBtn').addEventListener('click', function () {
      state.cities = DEFAULT_CITIES.slice(); persist(); renderGrid();
      $('planRows').innerHTML = ''; $('planWindow').hidden = true; $('planWindow').innerHTML = '';
    });
    $('hourToggle').addEventListener('click', function () {
      state.hour12 = !state.hour12; persist(); applyI18n(); renderGrid();
    });
    $('langToggle').addEventListener('click', function () {
      state.lang = state.lang === 'en' ? 'bn' : 'en'; persist();
      applyI18n();
      $('convEmpty').textContent = T('convEmpty');
      $('planEmpty').textContent = T('planEmpty');
      $('addMsg').textContent = ''; $('addMsg').className = 'msg';
      renderGrid();
    });
    setInterval(tick, 1000);
  }

  // 'langName' = native name of the OTHER language (toggle label)
  var origT = window.WCBI18N.t;
  window.WCBI18N.t = function (lang, key) {
    if (key === 'langName') return lang === 'en' ? '\u09ac\u09be\u0982\u09b2\u09be' : 'English';
    return origT(lang, key);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
