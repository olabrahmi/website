interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

type NavigatorWithHints = Navigator & { connection?: NetworkInformation; deviceMemory?: number };

/**
 * Whether the 3D effects should run at all. Safe to import from anywhere: it never touches three.
 * The plain layout (grid, static wordmark) is the right answer on: Save-Data, 2G and 3G connections (the three chunk is
 * about 600KB), machines with 2 cores or 2GB of memory or less, and software renderers (SwiftShader, llvmpipe), where
 * WebGL would run on the CPU.
 */
export function canRunWebGLEffects() {
  try {
    const nav = navigator as NavigatorWithHints;

    if (nav.connection?.saveData) return false;
    if (['slow-2g', '2g', '3g'].includes(nav.connection?.effectiveType ?? '')) return false;
    if ((nav.deviceMemory ?? 8) <= 2) return false;
    if ((nav.hardwareConcurrency ?? 8) <= 2) return false;

    const gl = document.createElement('canvas').getContext('webgl2');

    if (!gl) return false;

    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';

    gl.getExtension('WEBGL_lose_context')?.loseContext();

    return !/swiftshader|llvmpipe|software|microsoft basic/i.test(renderer);
  } catch {
    return false;
  }
}

/** Resolves when the main thread is idle (or after `timeout`ms), so heavy setup does not land in the middle of a scroll. */
export const whenIdle = (timeout = 1500) =>
  new Promise<void>((resolve) => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(), { timeout });
    else setTimeout(resolve, 100);
  });

/** Lets the browser handle input and paint before the next chunk of setup work. */
export const yieldToMain = () =>
  new Promise<void>((resolve) => {
    const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;

    if (scheduler?.yield) void scheduler.yield().then(resolve);
    else setTimeout(resolve, 0);
  });

/** Lower pixel-ratio cap for weak machines: 4 cores or fewer, or 4GB of memory or less. */
export function isLowEnd() {
  const nav = navigator as NavigatorWithHints;

  return (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
}
