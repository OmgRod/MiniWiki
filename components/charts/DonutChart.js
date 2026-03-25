function toSegments(data = []) {
  const normalized = data
    .map((entry, index) => ({
      label: entry?.label || `Segment ${index + 1}`,
      value: Math.max(0, Number(entry?.value || 0)),
      colorClass:
        typeof entry?.colorClass === 'string' && entry.colorClass.trim()
          ? entry.colorClass.trim()
          : null,
    }))
    .filter((entry) => Number.isFinite(entry.value));

  const total = normalized.reduce((sum, entry) => sum + entry.value, 0);

  return {
    segments: normalized,
    total: total > 0 ? total : 1,
    hasValues: total > 0,
  };
}

const FALLBACK_DATA = [
  { label: 'Docs', value: 58 },
  { label: 'API', value: 24 },
  { label: 'Ops', value: 18 },
];

function normalizeInputData(data) {
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }

  return FALLBACK_DATA;
}

const DEFAULT_COLORS = [
  'text-blue-500 dark:text-blue-300',
  'text-emerald-500 dark:text-emerald-300',
  'text-amber-500 dark:text-amber-300',
  'text-purple-500 dark:text-purple-300',
  'text-rose-500 dark:text-rose-300',
  'text-cyan-500 dark:text-cyan-300',
];

export default function DonutChart({
  data = [],
  size = 180,
  strokeWidth = 22,
  showLegend = true,
  className = '',
}) {
  const normalizedData = normalizeInputData(data);
  const { segments, total, hasValues } = toSegments(normalizedData);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donut chart">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth={strokeWidth}
          />

          {hasValues
            ? segments.map((segment, index) => {
                const segmentLength = (segment.value / total) * circumference;
                const strokeDasharray = `${segmentLength} ${circumference - segmentLength}`;
                const strokeDashoffset = -offset;
                offset += segmentLength;

                return (
                  <circle
                    key={`${segment.label}-${index}`}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    className={segment.colorClass || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    strokeLinecap="butt"
                  />
                );
              })
            : null}
        </svg>

        {showLegend ? (
          <div className="min-w-44 space-y-2 text-sm">
            {segments.map((segment, index) => {
              const colorClass = segment.colorClass || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
              const pct = hasValues ? Math.round((segment.value / total) * 100) : 0;

              return (
                <div key={`${segment.label}-legend-${index}`} className="flex items-center justify-between gap-3">
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full bg-current ${colorClass}`} />
                    <span className="truncate text-slate-700 dark:text-slate-200">{segment.label}</span>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">{pct}%</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
