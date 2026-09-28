import type { CaseStudy } from '../types';

import { akasec } from './akasec';
import { charmIndustrial } from './charm-industrial';
import { descope } from './descope';
import { maya } from './maya';
import { o1labs } from './o1labs';
import { payback } from './payback';
import { shaza } from './shaza';
import { takeda } from './takeda';


export const buildingNow: CaseStudy[] = [shaza, maya];

export const selectedWork: CaseStudy[] = [payback, takeda, descope, charmIndustrial, o1labs, akasec];

export const allProjects: CaseStudy[] = [shaza, maya, ...selectedWork];

export const getProject = (slug: string) => allProjects.find((project) => project.slug === slug);

export const getNextProject = (slug: string) => {
  const index = allProjects.findIndex((project) => project.slug === slug);

  return allProjects[(index + 1) % allProjects.length];
};
