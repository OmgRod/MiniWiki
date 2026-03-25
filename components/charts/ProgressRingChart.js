function clampPercent(value) {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.max(0, Math.min(100, numeric));
}

export default function ProgressRingChart({
  value = 72,
  size = 180,
  strokeWidth = 14,
  label = 'Progress',
  className = '',
}) {
  const percent = clampPercent(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;

  return (
    <div className={`my-4 inline-flex flex-col items-center rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${percent}%`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-200 dark:text-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-blue-500 dark:text-blue-300"
          strokeDasharray={`${filled} ${circumference - filled}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-slate-800 text-[20px] font-bold dark:fill-slate-100"
        >
          {percent}%
        </text>
      </svg>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}
