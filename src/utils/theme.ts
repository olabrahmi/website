export type Theme = 'light' | 'dark';

export const THEME_KEY = 'theme';
export const THEME_COLORS: Record<Theme, string> = { light: '#fbfbfe', dark: '#0a0911' };

/**
 * Dark from 19:00 to 06:59, light from 07:00 to 18:59.
 * Pure and import-free: it is inlined into the head script through toString().
 */
export function themeForHour(hour: number): Theme {
  return hour >= 19 || hour < 7 ? 'dark' : 'light';
}

export function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);

    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/**
 * Head script, runs before first paint:
 *
 *   stored choice ─┐
 *                  ├─▶ theme ─▶ html.dark + colorScheme + <meta theme-color>
 *   clock (hour) ──┘
 *
 * It also adds `html.js`, which gates the scroll reveals in globals.css.
 * Storage access is wrapped in try/catch: Safari private mode and blocked storage throw.
 */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add('js');var t=null;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}if(t!=='light'&&t!=='dark'){t=(${themeForHour.toString()})(new Date().getHours())}var c=${JSON.stringify(THEME_COLORS)};d.classList.toggle('dark',t==='dark');d.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',c[t])})()`;

/** Applies a theme to the document. Persists only when the visitor chose it. */
export function applyTheme(theme: Theme, { persist = false }: { persist?: boolean } = {}) {
  const root = document.documentElement;
  const freeze = document.createElement('style');

  // One frame without transitions, so colors switch together instead of fading at different speeds.
  // The toggle's own icons keep their transition, so the swap still animates.
  freeze.textContent = '*:not([data-theme-icon]),*::before,*::after{transition:none!important}';
  document.head.appendChild(freeze);

  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);

  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage blocked: the choice lasts for this page view only */
    }
  }

  requestAnimationFrame(() => requestAnimationFrame(() => freeze.remove()));
}
