import { spawn } from 'node:child_process';
const port = 9364;
const proc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${port}`, '--hide-scrollbars', '--user-data-dir=/tmp/cdp-perf5', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 40; i++) { try { t = await (await fetch(`http://localhost:${port}/json`)).json(); if (t.length) break; } catch {} await sleep(250); }
const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); const events = []; let traceDone;
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.method === 'Tracing.dataCollected') events.push(...d.params.value); else if (d.method === 'Tracing.tracingComplete') traceDone?.(); else pend.get(d.id)?.(d); };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result.value;
await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1512, height: 860, deviceScaleFactor: 2, mobile: false });
const AUR = '.bg-paper > div.absolute.inset-0.overflow-hidden', A = AUR + ' > div', HB = 'div.fixed.top-0.z-49';
const variants = {
  'warm-up (ignore)': '',
  'base: everything on': '',
  'header blur OFF': HB + '{display:none!important}',
  'aurora OFF': AUR + '{display:none!important}',
  'both OFF': AUR + '{display:none!important} ' + HB + '{display:none!important}',
};
const run = async (css, mode) => {
  await send('Page.navigate', { url: 'http://localhost:3700/' }); await sleep(1200); await ev(`localStorage.setItem('theme','dark')`);
  await send('Page.navigate', { url: 'http://localhost:3700/' }); await sleep(3500);
  if (css) await ev(`(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.appendChild(s); })()`);
  await sleep(600); await ev(`scrollTo({top:0,behavior:'instant'})`); await sleep(400);
  events.length = 0;
  await send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline,gpu,cc,viz,benchmark', transferMode: 'ReportEvents' });
  const done = new Promise((r) => (traceDone = r));
  if (mode === 'scroll') await ev(`(async () => { let y = 0; await new Promise((res) => { const end = performance.now() + 3000; const tick = (now) => { y += 30; window.scrollTo({ top: y, behavior: 'instant' }); if (now < end) requestAnimationFrame(tick); else res(); }; requestAnimationFrame(tick); }); })()`);
  else await sleep(3000);
  await send('Tracing.end'); await done;
  const meta = events.filter((e) => e.ph === 'M' && e.name === 'thread_name');
  const mainTids = new Set(meta.filter((e) => e.args.name === 'CrRendererMain').map((e) => e.pid + ':' + e.tid));
  const compTids = new Set(meta.filter((e) => e.args.name === 'Compositor').map((e) => e.pid + ':' + e.tid));
  const on = (set, name) => events.filter((e) => e.name === name && e.ph === 'X' && set.has(e.pid + ':' + e.tid)).reduce((a, e) => a + e.dur, 0) / 1000;
  return { main: on(mainTids, 'RunTask'), comp: on(compTids, 'RunTask'), gpu: events.filter((e) => e.name === 'GPUTask' && e.ph === 'X').reduce((a, e) => a + e.dur, 0) / 1000, paint: on(mainTids, 'Paint'), layout: on(mainTids, 'Layout') + on(mainTids, 'UpdateLayoutTree') };
};
for (const mode of ['idle', 'scroll']) {
  console.log(`\n${mode.toUpperCase()} (3s, 2x DPR)`.padEnd(28), 'MAIN-thread ms  compositor ms  GPU ms  main Paint ms  main Layout ms');
  for (const [name, css] of Object.entries(variants)) {
    const rs = []; for (let i = 0; i < 2; i++) rs.push(await run(css, mode));
    const avg = (k) => (rs.reduce((a, b) => a + b[k], 0) / rs.length).toFixed(0);
    console.log(name.padEnd(28), avg('main').padStart(14), avg('comp').padStart(13), avg('gpu').padStart(7), avg('paint').padStart(13), avg('layout').padStart(14));
  }
}
ws.close(); proc.kill();
