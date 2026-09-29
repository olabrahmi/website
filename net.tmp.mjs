import { spawn } from 'node:child_process';
const port = 9365;
const proc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, '--hide-scrollbars', '--user-data-dir=/tmp/cdp-net', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch(`http://localhost:${port}/json`)).json(); if (t.length) break; } catch {} await sleep(250); }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); const reqs = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data);
  if (d.method === 'Network.requestWillBeSent') reqs.set(d.params.requestId, { url: d.params.request.url, type: d.params.type, size: 0, t: Date.now() });
  else if (d.method === 'Network.loadingFinished') { const r = reqs.get(d.params.requestId); if (r) r.size = d.params.encodedDataLength; }
  else pend.get(d.id)?.(d); };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result.value;
await send('Page.enable'); await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
const show = (label, since) => { const rows = [...reqs.values()].filter((r) => r.t >= since && ['Image', 'Media'].includes(r.type)); const kb = Math.round(rows.reduce((a, r) => a + r.size, 0) / 1024); console.log(`${label}: ${rows.length} image/media requests, ${kb} KB`); for (const r of rows) console.log('   ', r.type.padEnd(6), Math.round(r.size / 1024) + 'KB', decodeURIComponent(r.url.replace('http://localhost:3700', '')).slice(0, 90)); };
for (const path of ['/', '/work/descope']) {
  console.log(`\n=== ${path}`); reqs.clear();
  await send('Runtime.evaluate', { expression: `localStorage.setItem('theme','dark')` });
  const t0 = Date.now(); await send('Page.navigate', { url: 'http://localhost:3700' + path }); await sleep(4500);
  show('on load (nothing scrolled)', t0);
  const t1 = Date.now(); const total = await ev('document.documentElement.scrollHeight');
  for (let y = 0; y < total; y += 300) { await ev(`window.scrollTo({top:${y},behavior:'instant'})`); await sleep(120); }
  await sleep(2000); show('after scrolling the whole page', t1);
}
ws.close(); proc.kill();
