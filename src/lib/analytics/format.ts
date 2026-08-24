export function formatCompact(value: number): string {
  if (value < 1000) return String(value);
  if (value < 1_000_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}K`;
  return `${(value / 1_000_000).toFixed(1)}M`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

const LABEL_OVERRIDES: Record<string, string> = {
  "": "(directo)",
  desktop: "Desktop",
  mobile: "Mobile",
  tablet: "Tablet",
};

export function formatLabel(raw: string): string {
  if (!raw) return "(directo)";
  return LABEL_OVERRIDES[raw] ?? raw;
}
