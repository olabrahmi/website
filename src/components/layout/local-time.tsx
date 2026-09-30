'use client';

import { useEffect, useState } from 'react';

import { formatLocalTime } from '@/utils/format-local-time';

export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatLocalTime());
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);

    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  return (
    <span className="text-ink-muted text-sm tabular-nums">
      Local Time: <span aria-live="off">{time ?? '--:--:-- --'}</span>
    </span>
  );
}
