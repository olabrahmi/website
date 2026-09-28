export interface DiagramNode {
  label: string;
  note?: string;
  /** Marks the step that waits on a person. Renders with the accent ring. */
  human?: boolean;
}

export interface DiagramLane {
  label: string;
  nodes: DiagramNode[];
}

export interface Diagram {
  lanes: DiagramLane[];
}

export interface BuiltItem {
  title?: string;
  body: string;
  href?: string;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface Measuring {
  intro: string;
  items: string[];
}

export interface CaseStudyFacts {
  client: string;
  role: string;
  when?: string;
  team?: string;
  stack: string[];
  live?: LinkItem[];
}

export interface CaseStudyCard {
  summary: string;
  stats: [string, string];
  tags: string[];
  cta: string;
}

export interface CaseStudyMedia {
  hero: boolean;
  details: number;
  beforeAfter?: boolean;
}

export interface CaseStudy {
  slug: string;
  kind: 'agent' | 'client';
  name: string;
  card: CaseStudyCard;
  title: string;
  facts: CaseStudyFacts;
  shortVersion: string;
  context?: string;
  built: BuiltItem[];
  howItsBuilt: string;
  diagram: Diagram;
  hardParts: string[];
  results?: string[];
  measuring?: Measuring;
  handoff?: string;
  today?: string;
  next?: string;
  links?: LinkItem[];
  media: CaseStudyMedia;
  /** Content gaps only the owner can fill. Shown in development. */
  pending: string[];
}

export interface HowIWorkItem {
  lead: string;
  body: string;
}

export interface SocialLink {
  label: string;
  href: string;
}
