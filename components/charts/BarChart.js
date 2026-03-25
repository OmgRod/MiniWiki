function getMaxValue(data = []) {
  const values = data
    .map((entry) => Number(entry?.value || 0))
    .filter((value) => Number.isFinite(value) && value >= 0);

  if (!values.length) {
    return 1;
  }

  return Math.max(...values, 1);
}

const FALLBACK_DATA = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 18 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 22 },
  { label: 'Fri', value: 17 },
];

function normalizeData(data) {
  if (Array.isArray(data) && data.length > 0) {
    return data.map((entry, index) => ({
      label: entry?.label || `Item ${index + 1}`,
      value: Number(entry?.value || 0),
    }));
  }

  return FALLBACK_DATA;
}

export default function BarChart({
  data = [],
  height = 180,
  showValues = true,
  className = '',
}) {
  const normalizedData = normalizeData(data);
  const maxValue = getMaxValue(normalizedData);
  const chartHeight = Math.max(140, Number(height) || 180);

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <div className="grid grid-flow-col auto-cols-fr items-end gap-3" style={{ minHeight: `${chartHeight}px` }}>
        {normalizedData.map((entry, index) => {
          const numericValue = Number(entry?.value || 0);
          const safeValue = Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0;
          const ratio = Math.max(0, Math.min(1, safeValue / maxValue));
          const fillHeight = Math.max(8, Math.round(ratio * (chartHeight - 68)));

          return (
            <div key={`${entry?.label || 'item'}-${index}`} className="flex min-w-0 flex-col items-center gap-2">
              <div className="flex w-full items-end justify-center" style={{ height: `${Math.max(84, chartHeight - 44)}px` }}>
                <div
                  className="w-full max-w-14 rounded-t-md bg-blue-500/85 transition-all duration-500 ease-out dark:bg-blue-400/80"
                  style={{ height: `${fillHeight}px` }}
                  title={`${entry?.label || 'Item'}: ${safeValue}`}
                />
              </div>

              <div className="w-full text-center">
                <p className="truncate text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  {entry?.label || `Item ${index + 1}`}
                </p>
                {showValues ? (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{safeValue}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
