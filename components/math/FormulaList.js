import MathEquation from './MathEquation';

const FALLBACK_ITEMS = [
  { name: 'Pythagorean', expression: 'a^2 + b^2 = c^2' },
  { name: 'Newton 2nd Law', expression: 'F = ma' },
  { name: 'Binomial', expression: '(a+b)^2 = a^2 + 2ab + b^2' },
];

function parseItems(items) {
  if (Array.isArray(items)) {
    return items;
  }

  if (items && typeof items === 'object') {
    if (Array.isArray(items.items)) {
      return items.items;
    }

    return Object.values(items).filter(Boolean);
  }

  if (typeof items === 'string' && items.trim()) {
    try {
      const parsed = JSON.parse(items);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return [];
    }
  }

  return [];
}

export default function FormulaList({ items = [], className = '' }) {
  const normalizedItems = parseItems(items).filter((item) => item && typeof item === 'object');
  const rows = normalizedItems.length ? normalizedItems : FALLBACK_ITEMS;

  return (
    <div className={`my-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 ${className}`}>
      <div className="grid grid-cols-[minmax(120px,180px)_1fr] border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <div className="px-3 py-2">Name</div>
        <div className="px-3 py-2">Formula</div>
      </div>

      {rows.map((item, index) => (
        <div
          key={`${item?.name || 'formula'}-${index}`}
          className="grid grid-cols-[minmax(120px,180px)_1fr] border-b border-slate-100 bg-white text-sm last:border-b-0 dark:border-slate-800 dark:bg-slate-950/40"
        >
          <div className="px-3 py-3 font-medium text-slate-700 dark:text-slate-200">{item?.name || `Formula ${index + 1}`}</div>
          <div className="px-3 py-2">
            <MathEquation expression={item?.expression || ''} block={false} className="text-slate-700 dark:text-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
