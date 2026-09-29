export const logoStripLabel = 'Proudly trusted by';

export const logoNames = ['PAYBACK', 'Takeda', 'Descope', 'Charm Industrial', 'o1Labs', 'Palais Shazam'] as const;

/** Every name with a wordmark: the logo strip plus Akasec, which only appears on its work card. */
export type LogoName = (typeof logoNames)[number] | 'Akasec';
