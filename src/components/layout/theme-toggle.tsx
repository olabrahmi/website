'use client';

import { motion } from 'motion/react';
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

const noopSubscribe = () => () => {};

const iconState = {
  visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  hidden: { opacity: 0, scale: 0.25, filter: 'blur(4px)' },
};

const spring = { type: 'spring', duration: 0.3, bounce: 0 } as const;

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, rootIsDark, () => false);
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  return (
    <button
      type="button"
      className="border-rule bg-surface text-ink hover:border-accent/60 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border transition-colors duration-150 active:scale-95"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => applyTheme(isDark ? 'light' : 'dark', { persist: true })}
    >
      <span className="relative block size-[1.125rem]">
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute inset-0 size-[1.125rem]"
          initial={false}
          animate={mounted && !isDark ? 'visible' : 'hidden'}
          variants={iconState}
          transition={spring}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </motion.svg>
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute inset-0 size-[1.125rem]"
          initial={false}
          animate={mounted && isDark ? 'visible' : 'hidden'}
          variants={iconState}
          transition={spring}
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </motion.svg>
      </span>
    </button>
  );
}
