'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    const header = document.getElementsByTagName('header')[0];
    header.style.display = 'none';

    const footer = document.getElementsByTagName('footer')[0];
    footer.style.display = 'none';

    return () => {
      header.style.display = 'flex';
      footer.style.display = 'flex';
    };
  }, []);

  return (
    <main className="w-full">
      <section className="prose prose-invert container flex min-h-[100vh] flex-col items-center justify-center">
        <h1>404: Page not found.</h1>
        <Link href="/" className="underline hover:opacity-80">
          &larr; Go back home
        </Link>
      </section>
    </main>
  );
}
