import { useMemo, useState } from 'react';

const LENGTH_UNITS = {
  m: { label: 'Meters', factor: 1 },
  km: { label: 'Kilometers', factor: 1000 },
  cm: { label: 'Centimeters', factor: 0.01 },
  mm: { label: 'Millimeters', factor: 0.001 },
  mi: { label: 'Miles', factor: 1609.344 },
  ft: { label: 'Feet', factor: 0.3048 },
};

export default function UnitConverter({ className = '' }) {
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('km');

  const converted = useMemo(() => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return '—';
    }

    const meters = numericValue * LENGTH_UNITS[from].factor;
    const target = meters / LENGTH_UNITS[to].factor;
    return target.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [value, from, to]);

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm text-slate-700 dark:text-slate-200">
          <span className="mb-1 block text-xs text-slate-500 dark:text-slate-400">Value</span>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </label>

        <label className="text-sm text-slate-700 dark:text-slate-200">
          <span className="mb-1 block text-xs text-slate-500 dark:text-slate-400">From</span>
          <select
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            {Object.entries(LENGTH_UNITS).map(([key, unit]) => (
              <option key={key} value={key}>
                {unit.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-slate-700 dark:text-slate-200">
          <span className="mb-1 block text-xs text-slate-500 dark:text-slate-400">To</span>
          <select
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            {Object.entries(LENGTH_UNITS).map(([key, unit]) => (
              <option key={key} value={key}>
                {unit.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
        Result: <span className="font-semibold">{converted}</span>
      </p>
    </div>
  );
}
