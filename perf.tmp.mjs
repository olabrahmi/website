import { spawn } from 'node:child_process';
const port = 9360;
const proc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, '--hide-scrollbars', '--user-data-dir=/tmp/cdp-perf', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch(`http://localhost:${port}/json`)).json(); if (t.length) break; } catch {} await sleep(250); }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); pend.get(d.id)?.(d); };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result.value;
await send('Page.enable'); await send('Performance.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const METRICS = async () => Object.fromEntries((await send('Performance.getMetrics')).result.metrics.map((m) => [m.name, m.value]));
const variants = {
  base: '',
  'no aurora': '.bg-paper > div.absolute.inset-0.overflow-hidden{display:none!important}',
  'no header blur': 'div.fixed.top-0.z-49{display:none!important}',
  'no aurora + no header blur': '.bg-paper > div.absolute.inset-0.overflow-hidden{display:none!important} div.fixed.top-0.z-49{display:none!important}',
};
const sampler = `(async (mode) => { const d = []; let last = performance.now(); const end = last + (mode === 'idle' ? 3000 : 3000); let y = 0;
  await new Promise((res) => { const tick = (now) => { d.push(now - last); last = now; if (mode === 'scroll') { y += 38; window.scrollTo({ top: y, behavior: 'instant' }); } if (now < end) requestAnimationFrame(tick); else res(); }; requestAnimationFrame(tick); });
  d.shift(); d.sort((a, b) => a - b); const avg = d.reduce((a, b) => a + b, 0) / d.length; return { fps: +(1000 / avg).toFixed(1), p95: +d[Math.floor(d.length * 0.95)].toFixed(1), worst: +d[d.length - 1].toFixed(1), slow: d.filter((x) => x > 25).length, frames: d.length }; })`;
console.log('variant'.padEnd(30), 'IDLE fps  p95ms  slow>25ms | SCROLL fps  p95ms  slow>25ms | main-thread busy (idle 3s)');
for (const [name, css] of Object.entries(variants)) {
  await send('Page.navigate', { url: 'http://localhost:3700/' }); await sleep(1500);
  await ev(`localStorage.setItem('theme','dark')`); await send('Page.navigate', { url: 'http://localhost:3700/' }); await sleep(3500);
  if (css) await ev(`(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.appendChild(s); })()`);
  await sleep(500);
  const m0 = await METRICS(); const idle = await ev(`${sampler}('idle')`); const m1 = await METRICS();
  const busy = ((m1.TaskDuration - m0.TaskDuration) / 3 * 100).toFixed(0) + '%';
  await ev(`scrollTo({top:0,behavior:'instant'})`); await sleep(400);
  const scroll = await ev(`${sampler}('scroll')`);
  console.log(name.padEnd(30), String(idle.fps).padStart(8), String(idle.p95).padStart(6), String(idle.slow).padStart(9), '|', String(scroll.fps).padStart(9), String(scroll.p95).padStart(6), String(scroll.slow).padStart(9), '|', busy);
}
ws.close(); proc.kill();
