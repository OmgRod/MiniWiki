import { useEffect, useMemo, useState } from 'react';

const FALLBACK_OPTIONS = [
  { label: 'Yes', votes: 18 },
  { label: 'No', votes: 4 },
  { label: 'Depends', votes: 7 },
];

function normalizeOptions(options) {
  if (Array.isArray(options) && options.length > 0) {
    return options;
  }

  return FALLBACK_OPTIONS;
}

export default function Poll({
  question = 'Your vote?',
  options = [],
  className = '',
}) {
  const normalizedOptions = normalizeOptions(options);
  const [votes, setVotes] = useState(() => normalizedOptions.map((option) => Number(option?.votes || 0)));

  useEffect(() => {
    setVotes(normalizedOptions.map((option) => Number(option?.votes || 0)));
  }, [normalizedOptions]);

  const totalVotes = useMemo(() => votes.reduce((sum, value) => sum + value, 0), [votes]);

  function vote(index) {
    setVotes((prev) => prev.map((count, idx) => (idx === index ? count + 1 : count)));
  }

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{question}</h3>

      <div className="mt-3 space-y-2">
        {normalizedOptions.map((option, index) => {
          const count = votes[index] || 0;
          const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;

          return (
            <div key={`${option?.label || 'option'}-${index}`}>
              <button
                type="button"
                onClick={() => vote(index)}
                className="mb-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {option?.label || `Option ${index + 1}`}
              </button>

              <div className="h-2 overflow-hidden rounded bg-slate-100 dark:bg-slate-900">
                <div className="h-full bg-blue-500 dark:bg-blue-300" style={{ width: `${pct}%` }} />
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{count} votes · {pct}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
