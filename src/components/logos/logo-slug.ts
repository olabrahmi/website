/** File prefix in public/logos. Charm's files are named charm-*, the rest follow the display name. */
const overrides: Record<string, string> = { 'Charm Industrial': 'charm' };

/** 'Palais Shazam' → 'palais-shazam'. */
export const logoSlug = (name: string) => overrides[name] ?? name.toLowerCase().replaceAll(' ', '-');
