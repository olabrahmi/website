import type { WebGLRenderer } from 'three';

interface QualityWatchOptions {
  renderer: WebGLRenderer;
  /** Called after the pixel ratio changes, so the scene can resize its canvas. */
  onResize: () => void;
  /** Called once if the frame rate cannot be held even at pixel ratio 1: the scene should tear itself down. */
  onGiveUp: () => void;
}

const WARMUP_FRAMES = 20; // shader compiles and first uploads are not representative
const WINDOW = 90;
const SLOW_MS = 22; // above this on average, 60fps is out of reach

/**
 * Safety net for weak machines, fed one frame time per rendered frame:
 *   slow at the current ratio ─▶ drop to pixel ratio 1 (once, never raised again)
 *   still slow at ratio 1      ─▶ give up: the plain layout is better than a janky effect
 * rAF timing cannot see GPU cost on its own, but a GPU that cannot keep up does show as long frames.
 */
export function createQualityWatch({ renderer, onResize, onGiveUp }: QualityWatchOptions) {
  const times: number[] = [];
  let seen = 0;
  let gaveUp = false;

  return function sample(dt: number) {
    if (gaveUp || dt <= 0 || ++seen <= WARMUP_FRAMES) return;

    times.push(dt * 1000);
    if (times.length < WINDOW) return;

    const mean = times.reduce((sum, value) => sum + value, 0) / times.length;

    times.length = 0;
    if (mean <= SLOW_MS) return;

    if (renderer.getPixelRatio() > 1) {
      renderer.setPixelRatio(1);
      onResize();
    } else {
      gaveUp = true;
      onGiveUp();
    }
  };
}
