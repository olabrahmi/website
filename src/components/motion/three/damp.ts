export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/** Frame-rate independent smoothing. lambda 6 reaches 95% in 500ms, 8 in 375ms, 12 in 250ms, 14 in 215ms. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

/** 0..1 progress of value inside [start, end]. */
export const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start));

export const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOutBack = (t: number, s = 1.2) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2;
