function normalizeGrid(data = []) {
  return data.map((row) =>
    Array.isArray(row)
      ? row.map((value) => {
          const numeric = Number(value || 0);
          return Number.isFinite(numeric) ? numeric : 0;
        })
      : []
  );
}

const FALLBACK_GRID = [
  [2, 4, 6, 5, 3],
  [1, 3, 5, 7, 4],
  [0, 2, 3, 5, 8],
];

const FALLBACK_X = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const FALLBACK_Y = ['API', 'Docs', 'Blog'];

function getMax(grid = []) {
  let max = 0;

  for (const row of grid) {
    for (const value of row) {
      if (value > max) {
        max = value;
      }
    }
  }

  return max || 1;
}

export default function HeatmapChart({
  data = [],
  xLabels = [],
  yLabels = [],
  className = '',
}) {
  const normalizedData = Array.isArray(data) && data.length > 0 ? data : FALLBACK_GRID;
  const grid = normalizeGrid(normalizedData);
  const normalizedX = xLabels.length ? xLabels : FALLBACK_X;
  const normalizedY = yLabels.length ? yLabels : FALLBACK_Y;
  const max = getMax(grid);

  if (!grid.length || !grid[0]?.length) {
    return (
      <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400 ${className}`}>
        No heatmap data provided.
      </div>
    );
  }

  return (
    <div className={`my-4 overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <div className="inline-block min-w-full">
        {normalizedX.length ? (
          <div className="mb-2 grid" style={{ gridTemplateColumns: `80px repeat(${normalizedX.length}, minmax(30px, 1fr))` }}>
            <div />
            {normalizedX.map((label, index) => (
              <div key={`x-${index}`} className="px-1 text-center text-[11px] text-slate-500 dark:text-slate-400">
                {label}
              </div>
            ))}
          </div>
        ) : null}

        <div className="space-y-1.5">
          {grid.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid items-center gap-1.5" style={{ gridTemplateColumns: `80px repeat(${row.length}, minmax(30px, 1fr))` }}>
              <div className="truncate pr-2 text-xs text-slate-600 dark:text-slate-300">
                {normalizedY[rowIndex] || `Row ${rowIndex + 1}`}
              </div>

              {row.map((value, colIndex) => {
                const intensity = Math.max(0.08, value / max);

                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="h-8 rounded-md bg-blue-500 dark:bg-blue-400"
                    style={{ opacity: intensity }}
                    title={`${normalizedY[rowIndex] || `Row ${rowIndex + 1}`}, ${normalizedX[colIndex] || `Col ${colIndex + 1}`}: ${value}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
