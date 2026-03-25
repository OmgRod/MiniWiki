function buildPoints(data = [], width, height, padding) {
  const values = data
    .map((entry) => Number(entry?.value ?? entry))
    .filter((value) => Number.isFinite(value));

  if (!values.length) {
    return { points: '', values: [] };
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = values
    .map((value, index) => {
      const x = padding + (index / Math.max(values.length - 1, 1)) * usableWidth;
      const y = padding + (1 - (value - minValue) / range) * usableHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return { points, values };
}

const FALLBACK_DATA = [8, 11, 10, 15, 18, 16, 20, 23, 21];

function normalizeData(data) {
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }

  return FALLBACK_DATA;
}

export default function SparklineChart({
  data = [],
  width = 560,
  height = 120,
  strokeWidth = 3,
  className = '',
}) {
  const padding = 10;
  const normalizedData = normalizeData(data);
  const { points, values } = buildPoints(normalizedData, width, height, padding);
  const hasData = values.length > 0;

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full" role="img" aria-label="Sparkline chart">
        <rect x="0" y="0" width={width} height={height} fill="transparent" />

        {hasData ? (
          <polyline
            fill="none"
            points={points}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-blue-500 dark:text-blue-300"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}

        {hasData
          ? points.split(' ').map((point, index) => {
              const [x, y] = point.split(',');
              return (
                <circle
                  key={`point-${index}`}
                  cx={x}
                  cy={y}
                  r="2.25"
                  className="fill-blue-500 dark:fill-blue-300"
                />
              );
            })
          : null}
      </svg>

      {!hasData ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">No data points provided.</p>
      ) : null}
    </div>
  );
}
