function normalizeData(data = []) {
  const input = Array.isArray(data) && data.length > 0
    ? data
    : [
        { label: 'Jan', value: 12 },
        { label: 'Feb', value: 16 },
        { label: 'Mar', value: 14 },
        { label: 'Apr', value: 22 },
        { label: 'May', value: 19 },
      ];

  return input
    .map((entry, index) => ({
      label: entry?.label || `Item ${index + 1}`,
      value: Number(entry?.value || 0),
    }))
    .filter((entry) => Number.isFinite(entry.value));
}

export default function AreaChart({
  data = [],
  width = 640,
  height = 220,
  className = '',
  showDots = true,
}) {
  const points = normalizeData(data);

  if (!points.length) {
    return (
      <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400 ${className}`}>
        No chart data provided.
      </div>
    );
  }

  const paddingX = 26;
  const paddingY = 16;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;
  const values = points.map((entry) => entry.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  const coordinates = points.map((entry, index) => {
    const x = paddingX + (index / Math.max(points.length - 1, 1)) * usableWidth;
    const y = paddingY + (1 - (entry.value - minValue) / range) * usableHeight;
    return { ...entry, x, y };
  });

  const linePath = coordinates
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${paddingX + usableWidth} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" role="img" aria-label="Area chart">
        <defs>
          <linearGradient id="miniwiki-area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#miniwiki-area-gradient)" className="text-blue-500 dark:text-blue-300" />
        <path d={linePath} fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-600 dark:text-blue-300" />

        {showDots
          ? coordinates.map((point) => (
              <circle
                key={`${point.label}-${point.value}`}
                cx={point.x}
                cy={point.y}
                r="3.5"
                className="fill-blue-600 dark:fill-blue-300"
              />
            ))
          : null}
      </svg>

      <div className="mt-2 grid grid-flow-col auto-cols-fr gap-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
        {points.map((point) => (
          <span key={`label-${point.label}`}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}
