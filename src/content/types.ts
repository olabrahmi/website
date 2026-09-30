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
  title: string;
  body: string;
  href?: string;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface Metric {
  /** Rendered as written: '1.1M+', '99.9%', '$100k+'. Values with no digits are shown as text. */
  value: string;
  label: string;
  /** A real gain: green number with an up arrow. Team size, site counts and the like stay in ink. */
  up?: boolean;
  /** Proposed, not sourced. Shows a badge in development and is listed in the build log. */
  confirm?: boolean;
}

export interface HardPart {
  problem: string;
  /** The decision. Left out when it isn't written down yet. */
  call?: string;
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
  /** Home cards show metrics[0] and metrics[1]. */
  card: CaseStudyCard;
  title: string;
  facts: CaseStudyFacts;
  shortVersion: string;
  context?: string;
  /** Heading of the build list. Defaults to 'What I built'. */
  builtTitle?: string;
  built: BuiltItem[];
  howItsBuilt: string;
  diagram: Diagram;
  hardParts: HardPart[];
  /** Can be empty: the band and the card numbers are then left out. */
  metrics: Metric[];
  handoff?: string;
  /** Agent projects only. */
  next?: string;
  links?: LinkItem[];
  media: CaseStudyMedia;
  /** Content gaps only the owner can fill. Shown in development. */
  pending: string[];
}

export interface SocialLink {
  label: string;
  href: string;
}
