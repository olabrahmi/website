'use client';

import { useCallback, useSyncExternalStore, type MouseEvent } from 'react';

import { person } from '@/content/site';

// Shared by every Download CV button on the page: when the server says the limit is reached, they all switch to email.
let blocked = false;
const listeners = new Set<() => void>();

const setBlocked = () => {
  blocked = true;
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

/**
 * Download CV without leaving the page. The link still points at /api/cv, so it works without JavaScript (the
 * server counts and refuses either way). With JavaScript we fetch it, save the blob, and when the server says 429
 * we flip to a mailto instead of dropping the visitor on an error page.
 */
export function useCvDownload() {
  const isBlocked = useSyncExternalStore(
    subscribe,
    () => blocked,
    () => false,
  );

  const onClick = useCallback(async (event: MouseEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(person.cvPath);

      if (response.status === 429) return setBlocked();
      if (!response.ok) throw new Error(String(response.status));

      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');

      link.href = url;
      link.download = 'oussama-labrahmi-cv.pdf';
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      window.location.href = person.cvPath;
    }
  }, []);

  return { blocked: isBlocked, onClick };
}
