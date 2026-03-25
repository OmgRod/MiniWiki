const DEFAULT_COLORS = [
  'bg-blue-500/85 dark:bg-blue-400/80',
  'bg-emerald-500/85 dark:bg-emerald-400/80',
  'bg-amber-500/85 dark:bg-amber-400/80',
  'bg-purple-500/85 dark:bg-purple-400/80',
  'bg-rose-500/85 dark:bg-rose-400/80',
  'bg-cyan-500/85 dark:bg-cyan-400/80',
];

const FALLBACK_SERIES = [
  { key: 'new', label: 'New' },
  { key: 'updated', label: 'Updated' },
  { key: 'archived', label: 'Archived' },
];

const FALLBACK_DATA = [
  { label: 'Docs', values: { new: 14, updated: 6, archived: 2 } },
  { label: 'Blog', values: { new: 9, updated: 11, archived: 4 } },
  { label: 'API', values: { new: 5, updated: 13, archived: 3 } },
];

function parseArrayLike(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeSeries(series = []) {
  const source = parseArrayLike(series);
  const input = source.length ? source : FALLBACK_SERIES;

  return input.map((entry, index) => ({
    key: entry?.key || `Series ${index + 1}`,
    label: entry?.label || entry?.key || `Series ${index + 1}`,
    colorClass:
      typeof entry?.colorClass === 'string' && entry.colorClass.trim()
        ? entry.colorClass.trim()
        : DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));
}

function normalizeData(data = []) {
  const source = parseArrayLike(data);
  const input = source.length ? source : FALLBACK_DATA;

  return input.map((item, index) => ({
    label: item?.label || `Group ${index + 1}`,
    values: item?.values && typeof item.values === 'object' ? item.values : {},
  }));
}

export default function StackedBarChart({
  data = [],
  series = [],
  showLegend = true,
  className = '',
}) {
  const normalizedSeries = normalizeSeries(series);
  const normalizedData = normalizeData(data);

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <div className="space-y-3">
        {normalizedData.map((group) => {
          const total = normalizedSeries.reduce(
            (sum, entry) => sum + Math.max(0, Number(group.values[entry.key] || 0)),
            0
          );
          const safeTotal = total || 1;

          return (
            <div key={group.label}>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span className="font-medium">{group.label}</span>
                <span>{total}</span>
              </div>
              <div className="flex h-5 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-900">
                {normalizedSeries.map((entry) => {
                  const value = Math.max(0, Number(group.values[entry.key] || 0));
                  const widthPercent = (value / safeTotal) * 100;

                  return (
                    <div
                      key={`${group.label}-${entry.key}`}
                      className={`${entry.colorClass} transition-all duration-500`}
                      style={{ width: `${widthPercent}%` }}
                      title={`${entry.label}: ${value}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showLegend ? (
        <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
          {normalizedSeries.map((entry) => (
            <div key={`legend-${entry.key}`} className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className={`h-2.5 w-2.5 rounded-full ${entry.colorClass}`} />
              <span>{entry.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
