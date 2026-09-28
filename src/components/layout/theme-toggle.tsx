'use client';

import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

const iconState = {
  visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  hidden: { opacity: 0, scale: 0.25, filter: 'blur(4px)' },
};

const spring = { type: 'spring', duration: 0.3, bounce: 0 } as const;

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      className="btn"
      data-variant="secondary"
      data-size="icon"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <span className="relative block size-5">
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute inset-0 size-5"
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
          className="absolute inset-0 size-5"
          initial={false}
          animate={isDark ? 'visible' : 'hidden'}
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
