import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import '@/base/styles/globals.css';
import { bodyFont, displayFont, monoFont } from '@/base/config/fonts.config';
import { Providers, SiteFooter, SiteHeader } from '@/components/layout';
import { cn } from '@/utils/cn';
import { THEME_COLORS, themeInitScript } from '@/utils/theme';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content={THEME_COLORS.light} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={cn(displayFont.variable, bodyFont.variable, monoFont.variable)}>
        <Providers>
          <a
            href="#main"
            className="focus:bg-paper sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:px-3 focus:py-2"
          >
            Skip to content
          </a>
          <SiteHeader />
          <div id="main">{children}</div>
          <SiteFooter />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export { metadata, viewport } from '@/base/config/metadata.config';
