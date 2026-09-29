'use client';

import { useEffect, useState } from 'react';

import { person } from '@/content/site';
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
      <span aria-live="off">{time ?? '--:--:-- ---'}</span> &middot; {person.location}
    </span>
  );
}
