let context: CanvasRenderingContext2D | null = null;

/** Any CSS color (oklch, hex, named) to sRGB 0..1 floats, gamma encoded. THREE.Color cannot parse OKLCH. */
export function cssToRgb(color: string): [number, number, number] {
  context ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!context) return [0, 0, 0];

  context.clearRect(0, 0, 1, 1);
  context.fillStyle = '#000';
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);

  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;

  return [r / 255, g / 255, b / 255];
}

/** Reads a custom property from <html>, e.g. cssVar('--accent'). */
export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Same, as an opaque `rgb()` string for canvas 2D drawing. */
export function cssVarRgb(name: string, alpha = 1) {
  const [r, g, b] = cssToRgb(cssVar(name));

  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)} / ${alpha})`;
}

/** Calls `onChange` whenever the theme class on <html> flips. Returns the disconnect function. */
export function watchTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);

  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  return () => observer.disconnect();
}

export const isDark = () => document.documentElement.classList.contains('dark');
