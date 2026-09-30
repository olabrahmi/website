import { publicFileExists } from '@/utils/public-files';

import { logoSlug } from './logo-slug';

/** URLs of the logo files that exist. Server only, it reads the disk. */
export interface LogoSources {
  /** The dark artwork, <slug>-dark.svg. Shown in light mode. */
  onLight?: string;
  /** The white artwork, <slug>-light.svg. Shown in dark mode. */
  onDark?: string;
}

export function getLogoSources(name: string): LogoSources {
  const slug = logoSlug(name);
  const onLight = `/logos/${slug}-dark.svg`;
  const onDark = `/logos/${slug}-light.svg`;

  return {
    onLight: publicFileExists(onLight.slice(1)) ? onLight : undefined,
    onDark: publicFileExists(onDark.slice(1)) ? onDark : undefined,
  };
}
