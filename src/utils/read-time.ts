import type { CaseStudy } from '@/content/types';

const WORDS_PER_MINUTE = 200;

/** Minutes to read a case study page, counted from the text it renders. At least 1. */
export function readMinutes(project: CaseStudy): number {
  const text = [
    project.shortVersion,
    project.context,
    project.howItsBuilt,
    project.next,
    project.handoff,
    ...project.built.flatMap((item) => [item.title, item.body]),
    ...project.hardParts.flatMap((part) => [part.problem, part.call]),
    ...project.diagram.lanes.flatMap((lane) => lane.nodes.flatMap((node) => [node.label, node.note])),
    ...project.metrics.map((metric) => `${metric.value} ${metric.label}`),
  ]
    .filter(Boolean)
    .join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
