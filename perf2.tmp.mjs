import { spawn } from 'node:child_process';
const port = 9361;
const proc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, '--hide-scrollbars', '--user-data-dir=/tmp/cdp-perf2', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch(`http://localhost:${port}/json`)).json(); if (t.length) break; } catch {} await sleep(250); }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); pend.get(d.id)?.(d); };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result.value;
await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const A = '.bg-paper > div.absolute.inset-0.overflow-hidden > div';
const HB = 'div.fixed.top-0.z-49';
const variants = {
  'base': '',
  '-- aurora internals (header blur OFF) --': HB + '{display:none!important}',
  'aurora as is': HB + '{display:none!important}',
  'aurora: ::after animation off': HB + '{display:none!important} ' + A + '::after{animation:none!important}',
  'aurora: blend layer (::after) removed': HB + '{display:none!important} ' + A + '::after{display:none!important}',
  'aurora: blur+invert filter removed': HB + '{display:none!important} ' + A + '{filter:none!important}',
  'aurora: bg-attachment fixed removed': HB + '{display:none!important} ' + A + '::after{background-attachment:scroll!important}',
  'aurora: all four removed': HB + '{display:none!important} ' + A + '{filter:none!important} ' + A + '::after{display:none!important}',
  '-- header blur layers (aurora OFF) --': '.bg-paper > div.absolute.inset-0.overflow-hidden{display:none!important}',
  'header: all 6 layers': '.bg-paper > div.absolute.inset-0.overflow-hidden{display:none!important}',
  'header: drop the 0px+1px layers (4)': '.bg-paper > div.absolute.inset-0.overflow-hidden{display:none!important} ' + HB + ' > div:nth-child(-n+2){display:none!important}',
  'header: only 2px,8px,16px (3)': '.bg-paper > div.absolute.inset-0.overflow-hidden{display:none!important} ' + HB + ' > div:nth-child(1), ' + HB + ' > div:nth-child(2), ' + HB + ' > div:nth-child(4){display:none!important}',
  'header: only 16px (1)': '.bg-paper > div.absolute.inset-0.overflow-hidden{display:none!important} ' + HB + ' > div:not(:nth-child(6)){display:none!important}',
};
const sampler = `(async () => { const d = []; let last = performance.now(); const end = last + 3000; let y = 0;
  await new Promise((res) => { const tick = (now) => { d.push(now - last); last = now; y += 38; window.scrollTo({ top: y, behavior: 'instant' }); if (now < end) requestAnimationFrame(tick); else res(); }; requestAnimationFrame(tick); });
  d.shift(); d.sort((a, b) => a - b); const avg = d.reduce((a, b) => a + b, 0) / d.length; return { fps: +(1000 / avg).toFixed(1), p95: +d[Math.floor(d.length * 0.95)].toFixed(1), slow: d.filter((x) => x > 25).length }; })()`;
console.log('SCROLL test'.padEnd(42), 'fps   p95ms  slow');
for (const [name, css] of Object.entries(variants)) {
  if (name.startsWith('--')) { console.log(name); continue; }
  const runs = [];
  for (let r = 0; r < 2; r++) {
    await send('Page.navigate', { url: 'http://localhost:3700/' }); await sleep(1200); await ev(`localStorage.setItem('theme','dark')`);
    await send('Page.navigate', { url: 'http://localhost:3700/' }); await sleep(3200);
    if (css) await ev(`(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.appendChild(s); })()`);
    await sleep(500); await ev(`scrollTo({top:0,behavior:'instant'})`); await sleep(300);
    runs.push(await ev(sampler));
  }
  const fps = (runs.reduce((a, b) => a + b.fps, 0) / runs.length).toFixed(1); const p95 = Math.max(...runs.map((x) => x.p95)); const slow = runs.reduce((a, b) => a + b.slow, 0);
  console.log(name.padEnd(42), fps.padStart(5), String(p95).padStart(7), String(slow).padStart(5));
}
ws.close(); proc.kill();
