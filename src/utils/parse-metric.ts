export interface ParsedMetric {
  prefix: string;
  target: number;
  decimals: number;
  grouped: boolean;
  suffix: string;
}

/**
 * '1.1M+' → { prefix: '', target: 1.1, decimals: 1, suffix: 'M+' }
 * '$100k+' → { prefix: '$', target: 100, decimals: 0, suffix: 'k+' }
 * '1,500+' → { target: 1500, grouped: true, suffix: '+' }
 * 'Live on publish' → null (nothing to count, rendered as text)
 */
export function parseMetric(value: string): ParsedMetric | null {
  const match = /^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(value);

  if (!match) return null;

  const [, prefix, raw, suffix] = match;
  const decimals = raw.split('.')[1]?.length ?? 0;

  return { prefix, target: Number(raw.replaceAll(',', '')), decimals, grouped: raw.includes(','), suffix };
}

export function formatMetric(parsed: ParsedMetric, amount: number): string {
  const number = amount.toLocaleString('en-US', {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
    useGrouping: parsed.grouped,
  });

  return `${parsed.prefix}${number}${parsed.suffix}`;
}
