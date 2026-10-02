'use client';

import { useSyncExternalStore } from 'react';

import { applyTheme, readStoredTheme, themeForHour } from '@/utils/theme';

const rootIsDark = () => document.documentElement.classList.contains('dark');

/**
 * Store = the `dark` class on <html>. Kept in sync with:
 *   - the class itself (MutationObserver)
 *   - other tabs (storage event)
 *   - the clock, while the visitor has not chosen a theme (tab regains focus)
 */
const subscribe = (notify: () => void) => {
  const observer = new MutationObserver(notify);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== 'theme') return;

    applyTheme(readStoredTheme() ?? themeForHour(new Date().getHours()));
  };
  const onVisible = () => {
    if (document.visibilityState !== 'visible' || readStoredTheme()) return;

    applyTheme(themeForHour(new Date().getHours()));
  };

  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('storage', onStorage);
  document.addEventListener('visibilitychange', onVisible);

  return () => {
    observer.disconnect();
    window.removeEventListener('storage', onStorage);
    document.removeEventListener('visibilitychange', onVisible);
  };
};

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, rootIsDark, () => false);

  return (
    <button
      type="button"
      className="border-ink/10 bg-ink/5 text-ink hover:border-accent/40 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border backdrop-blur-md transition-colors duration-150 active:scale-95"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => applyTheme(isDark ? 'light' : 'dark', { persist: true })}
    >
      {/*
        Both icons are in the server HTML and CSS picks the visible one from the `dark` class, which the head script
        sets before first paint. Nothing waits for hydration, so the right icon is there on a cold first load.
        The swap is a CSS transition: opacity, scale and blur.
      */}
      <span className="relative block size-[1.125rem]">
        <span
          data-theme-icon=""
          className="absolute inset-0 scale-100 opacity-100 blur-[0px] transition-[opacity,scale,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none dark:scale-25 dark:opacity-0 dark:blur-[4px]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-full"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        </span>
        <span
          data-theme-icon=""
          className="absolute inset-0 scale-25 opacity-0 blur-[4px] transition-[opacity,scale,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none dark:scale-100 dark:opacity-100 dark:blur-[0px]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-full"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
