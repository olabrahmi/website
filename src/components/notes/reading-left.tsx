'use client';

import { useEffect, useState } from 'react';

/** "3 min left". Reads the position of the article on scroll, and only re-renders when the minute changes. */
export default function ReadingLeft({ minutes, target }: { minutes: number; target: string }) {
  const [left, setLeft] = useState(minutes);

  useEffect(() => {
    const article = document.getElementById(target);

    if (!article) return;

    let frame = 0;
    const measure = () => {
      frame = 0;

      const { top, height } = article.getBoundingClientRect();
      const read = Math.min(1, Math.max(0, -top / Math.max(1, height - window.innerHeight)));

      setLeft(Math.ceil(minutes * (1 - read)));
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [minutes, target]);

  return (
    <p className="text-ink-muted px-3 text-sm">
      {left > 0 ? (
        <>
          <span className="font-mono">{left}</span> min left
        </>
      ) : (
        'Thanks for reading'
      )}
    </p>
  );
}
