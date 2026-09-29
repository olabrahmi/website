import type { Metric as MetricData } from '@/content/types';
import { cn } from '@/utils/cn';

import Metric from './metric';

const columns: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

/** Numbers in a row of cells split by hairlines. Two columns on phones, an odd last cell spans both. */
export default function MetricBand({ metrics, className }: { metrics: MetricData[]; className?: string }) {
  return (
    <ul
      className={cn(
        'border-rule bg-rule grid grid-cols-2 gap-px overflow-hidden rounded-2xl border',
        columns[Math.min(metrics.length, 4)],
        className,
      )}
    >
      {metrics.map((metric) => (
        <li
          key={metric.label}
          className="bg-surface p-4 sm:p-5 [&:last-child:nth-child(odd)]:col-span-2 md:[&:last-child:nth-child(odd)]:col-span-1"
        >
          <Metric metric={metric} />
        </li>
      ))}
    </ul>
  );
}
