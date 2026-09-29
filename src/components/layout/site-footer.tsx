import { Container } from '@/components/ui';
import { person, socials } from '@/content/site';

import LocalTime from './local-time';
import SiteMark from './site-mark';

const links = [...socials, { label: 'Email', href: `mailto:${person.email}` }];

export default function SiteFooter() {
  return (
    <footer className="border-rule mt-10 border-t py-10">
      <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-5">
          <SiteMark className="text-ink h-6 w-auto self-start" />
          <ul className="flex flex-wrap items-center gap-x-5 text-sm">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="text-ink decoration-accent/40 hover:decoration-accent inline-block py-1.5 underline underline-offset-4"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <LocalTime />
          <p className="text-ink-muted text-sm">
            Made with <span className="text-accent">&hearts;</span> from Morocco
          </p>
        </div>
      </Container>
    </footer>
  );
}
