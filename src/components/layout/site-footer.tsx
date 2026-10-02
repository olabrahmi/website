import type { ComponentType, SVGProps } from 'react';

import { AuroraLayers } from '@/components/motion';
import { Container } from '@/components/ui';
import { EmailIcon, GitHubIcon, LinkedInIcon } from '@/components/ui/social-icons';
import { person, socials } from '@/content/site';
import { cn } from '@/utils/cn';

import LocalTime from './local-time';
import SiteMark from './site-mark';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const icons: Record<string, Icon> = { Email: EmailIcon, LinkedIn: LinkedInIcon, GitHub: GitHubIcon };

// Email first, then the socials in the order they are listed in content/site.ts.
const links = [{ label: 'Email', href: `mailto:${person.email}` }, ...socials];

/**
 * A top border separates it from the page; no card, no grid. The hero's aurora runs behind it, mirrored so the glow sits at the bottom center, at half strength and faded out toward the sides.
 * The footer is full width and clips the effect; the content stays at the 1040px content width.
 */
export default function SiteFooter() {
  return (
    <footer className="border-rule relative isolate mt-10 w-full overflow-hidden border-t py-6 md:py-5">
      <AuroraLayers
        flip
        showRadialGradient={false}
        className="-z-10 [mask-image:radial-gradient(ellipse_55%_100%_at_50%_0%,black_0%,transparent_75%)] opacity-50"
      />

      <Container>
        <div className="flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-5">
            <SiteMark className="text-ink h-7 w-auto" />
            <LocalTime />
          </div>

          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-5">
            <ul className="flex items-center justify-center gap-2">
              {links.map((link) => {
                const Icon = icons[link.label];
                const external = link.href.startsWith('http');

                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={cn(
                        'border-rule bg-surface text-ink grid size-7 cursor-pointer place-items-center rounded-full border',
                        'transition-[background-color,transform] duration-150 active:scale-[0.96]',
                        '[@media(hover:hover)]:hover:bg-surface-2',
                      )}
                    >
                      <span className="sr-only">{link.label === 'Email' ? 'Email me' : `Visit my ${link.label}`}</span>
                      {Icon && <Icon className="size-3.5" />}
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="text-ink-muted text-sm font-medium">&copy; Made with 🩷 from Morocco</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
