import { hero, person } from '@/content/site';
import { ogSize, renderOg } from '@/utils/og';

export const alt = `${person.name}, ${person.jobTitle.toLowerCase()}`;
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return renderOg(hero.headline, person.jobTitle);
}
