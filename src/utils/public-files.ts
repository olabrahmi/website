import fs from 'node:fs';
import path from 'node:path';

/** Server only. True when public/<file> exists, e.g. publicFileExists('projects/payback-hero.webp'). */
export const publicFileExists = (file: string) => fs.existsSync(path.join(process.cwd(), 'public', file));
