// world-clock-bd smoke test: raw CDP over WebSocket, headless chrome, file:// URL.
// Run: node tests/smoke.mjs   (starts its own chrome on port 9222)
import { spawn } from 'child_process';

const CHROME = '/opt/meta-chromium/chrome';
const PORT = 9222;
const PROFILE = '/tmp/wcb-smoke-profile';
const PAGE_URL = 'file:///home/hatch/workspace/muse-project-factory/builds/world-clock-bd/index.html';

let pass = 0, fail = 0;
const failures = [];
function check(cond, name, extra) {
  if (cond) { pass++; console.log('  ok - ' + name); }
  else { fail++; failures.push(name + (extra ? ' | ' + extra : '')); console.log('  FAIL - ' + name + (extra ? ' | ' + extra : '')); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const chrome = spawn(CHROME, [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + PROFILE,
    'about:blank',
  ], { stdio: 'ignore' });
  await sleep(2500);

  // create target
  let target;
  for (let i = 0; i < 20; i++) {
    try {
      const r = await fetch('http://127.0.0.1:' + PORT + '/json/new?' + encodeURIComponent(PAGE_URL), { method: 'PUT' });
      target = await r.json();
      break;
    } catch (e) { await sleep(500); }
  }
  if (!target || !target.webSocketDebuggerUrl) throw new Error('no CDP target');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let mid = 0;
  const pending = new Map();
  const requests = [];
  const errors = [];
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id); pending.delete(m.id);
      if (m.error) rej(new Error(JSON.stringify(m.error))); else res(m.result);
    } else if (m.method === 'Network.requestWillBeSent') {
      requests.push(m.params.request.url);
    } else if (m.method === 'Runtime.consoleAPICalled') {
      if (m.params.type === 'error') errors.push('console.error: ' + JSON.stringify(m.params.args.map((a) => a.value)));
    } else if (m.method === 'Runtime.exceptionThrown') {
      errors.push('exception: ' + (m.params.exceptionDetails.text || ''));
    } else if (m.method === 'Log.entryAdded') {
      if (m.params.entry.level === 'error') errors.push('log: ' + m.params.entry.text);
    }
  };
  const send = (method, params) => new Promise((res, rej) => {
    const id = ++mid; pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params: params || {} }));
    setTimeout(() => { if (pending.has(id)) { pending.delete(id); rej(new Error('timeout ' + method)); } }, 15000);
  });
  const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;
  const click = (sel) => ev(`document.querySelector(${JSON.stringify(sel)}).click()`);
  const setVal = (sel, v) => ev(`document.querySelector(${JSON.stringify(sel)}).value=${JSON.stringify(v)}`);
  async function navigate() {
    const loaded = new Promise((res) => {
      const h = (e2) => { const m = JSON.parse(e2.data); if (m.method === 'Page.loadEventFired') { ws.removeEventListener('message', h); res(); } };
      ws.addEventListener('message', h);
    });
    await send('Page.navigate', { url: PAGE_URL });
    await loaded; await sleep(600);
  }

  await send('Page.enable'); await send('Runtime.enable');
  await send('Network.enable'); await send('Log.enable');

  console.log('== DESKTOP 1280 ==');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await navigate();

  check(await ev(`document.querySelectorAll('#clockGrid .card').length`) === 10, '10 default clock cards');
  check(await ev(`!!document.querySelector('#clockGrid .card.home[data-zone="Asia/Dhaka"]')`), 'Dhaka card highlighted');
  check(await ev(`document.documentElement.scrollWidth <= window.innerWidth`), 'no horizontal overflow desktop');
  const t1 = await ev(`document.querySelector('#clockGrid .card[data-zone="Asia/Dhaka"] .card-time').textContent`);
  await sleep(1300);
  const t2 = await ev(`document.querySelector('#clockGrid .card[data-zone="Asia/Dhaka"] .card-time').textContent`);
  check(t1 !== t2, 'live tick advances seconds', t1 + ' -> ' + t2);

  // add city
  await setVal('#citySearch', 'Paris'); await click('#addBtn'); await sleep(400);
  check(await ev(`document.querySelectorAll('#clockGrid .card').length`) === 11, 'add Paris -> 11 cards');
  check(await ev(`!!document.querySelector('#clockGrid .card[data-zone="Europe/Paris"]')`), 'Paris card present');
  // duplicate rejected
  await setVal('#citySearch', 'Paris'); await click('#addBtn'); await sleep(300);
  check((await ev(`document.querySelector('#addMsg').textContent`)).length > 0, 'duplicate add shows inline message');
  check(await ev(`document.querySelectorAll('#clockGrid .card').length`) === 11, 'duplicate add does not duplicate card');
  // remove + persistence
  await click('[data-remove="Europe/Paris"]'); await sleep(400);
  check(await ev(`document.querySelectorAll('#clockGrid .card').length`) === 10, 'remove Paris -> 10 cards');
  await navigate();
  check(await ev(`document.querySelectorAll('#clockGrid .card').length`) === 10, 'city list persists after reload');

  // converter
  await setVal('#convDate', '2026-10-20'); await setVal('#convTime', '13:00');
  await ev(`document.querySelector('#convFrom').value='Asia/Dhaka'`);
  await click('#convBtn'); await sleep(400);
  const lonT = await ev(`document.querySelector('#convGrid .card[data-zone="Europe/London"] .card-time').textContent`);
  check(typeof lonT === 'string' && lonT.indexOf('08:00') === 0, 'converter 13:00 Dhaka -> 08:00 London', String(lonT));
  const convCards = await ev(`document.querySelectorAll('#convGrid .card').length`);
  check(convCards === 10, 'converter renders all clock-grid cities', String(convCards));
  await setVal('#convDate', ''); await click('#convBtn'); await sleep(300);
  check((await ev(`document.querySelector('#convMsg').textContent`)).length > 0, 'converter bad input -> inline error');

  // planner
  await setVal('#planDate', '2026-10-20'); await setVal('#planTime', '13:00');
  await click('#planBtn'); await sleep(400);
  const rows = await ev(`document.querySelectorAll('#planRows .prow').length`);
  check(rows === 10, 'planner renders 10 city rows', String(rows));
  const badges = await ev(`document.querySelectorAll('#planRows .prow-badge').length`);
  check(badges === 10, 'planner badges on every row');
  const winVisible = await ev(`!document.querySelector('#planWindow').hidden`);
  const winText = await ev(`document.querySelector('#planWindow').textContent`);
  check(winVisible && /UTC/.test(winText), 'best call window hint shown', String(winText).slice(0, 80));

  // BN toggle
  await click('#langToggle'); await sleep(400);
  check(await ev(`document.documentElement.lang`) === 'bn', 'BN toggle sets html lang');
  check(await ev(`document.querySelector('#clockGrid .card[data-zone="Asia/Dhaka"] .city').textContent`) === '\u09a2\u09be\u0995\u09be', 'BN city name rendered');
  check(await ev(`/[\\u09E6-\\u09EF]/.test(document.querySelector('#clockGrid .card[data-zone="Asia/Dhaka"] .card-time').textContent)`), 'BN digits in clock');
  await navigate();
  check(await ev(`document.documentElement.lang`) === 'bn', 'BN language persists after reload');

  console.log('== MOBILE 390 ==');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await navigate();
  check(await ev(`document.documentElement.scrollWidth <= 390`), 'no horizontal overflow at 390px', 'scrollWidth=' + await ev(`document.documentElement.scrollWidth`));
  check(await ev(`document.querySelectorAll('#clockGrid .card').length`) === 10, 'mobile: 10 cards render');

  console.log('== HYGIENE ==');
  const remote = requests.filter(function (u) { return /^(https?|wss?):/i.test(u); });
  check(remote.length === 0, 'zero remote network requests (file:// only)', JSON.stringify(remote.slice(0, 5)));
  check(errors.length === 0, 'zero console/page errors', JSON.stringify(errors.slice(0, 3)));

  ws.close(); chrome.kill();
  console.log('SMOKE PASS: ' + pass + '  FAIL: ' + fail);
  if (failures.length) { console.log('FAILURES:'); failures.forEach((f) => console.log('  - ' + f)); }
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error('SMOKE CRASH:', e.message); process.exit(2); });
