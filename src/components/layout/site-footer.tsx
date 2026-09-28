import { person, socials } from '@/content/site';
import { Container } from '@/components/ui';

import LocalTime from './local-time';
import SiteMark from './site-mark';

export default function SiteFooter() {
  return (
    <footer className="border-rule mt-24 border-t py-10">
      <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <SiteMark className="text-ink h-6 w-auto" />
          <p className="text-ink-muted text-sm">
            &copy; {new Date().getFullYear()} {person.name} &middot; {person.location}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <ul className="flex items-center gap-5 text-sm">
            {socials.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink decoration-rule hover:decoration-accent py-2 underline underline-offset-4"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <LocalTime />
        </div>
      </Container>
    </footer>
  );
}
