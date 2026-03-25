const FALLBACK_PARTS = [
  { symbol: 'C', name: 'Carbon', count: 6, ram: 12.011 },
  { symbol: 'H', name: 'Hydrogen', count: 12, ram: 1.008 },
  { symbol: 'O', name: 'Oxygen', count: 6, ram: 15.999 },
];

const REFERENCE_RAM_BY_SYMBOL = {
  H: 1.008,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  Na: 22.99,
  Mg: 24.305,
  P: 30.974,
  S: 32.06,
  Cl: 35.45,
  K: 39.098,
  Ca: 40.078,
  Fe: 55.845,
  Cu: 63.546,
  Zn: 65.38,
};

function parseParts(parts) {
  if (Array.isArray(parts)) {
    return parts;
  }

  if (parts && typeof parts === 'object') {
    if (Array.isArray(parts.parts)) {
      return parts.parts;
    }

    return Object.values(parts).filter(Boolean);
  }

  if (typeof parts === 'string' && parts.trim()) {
    try {
      const parsed = JSON.parse(parts);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeItems(items = []) {
  const normalizeRam = (symbol, value) => {
    const parsed = Number(value);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }

    return REFERENCE_RAM_BY_SYMBOL[String(symbol || '').trim()] ?? null;
  };

  return items.map((item) => ({
    symbol: item?.symbol || 'X',
    name: item?.name || 'Unknown',
    count: Math.max(1, Number(item?.count || 1)),
    ram: normalizeRam(item?.symbol, item?.ram),
  }));
}

export default function CompoundBreakdown({
  formula = 'H2O',
  parts = [],
  className = '',
}) {
  const parsedParts = parseParts(parts).filter((item) => item && typeof item === 'object');
  const normalized = normalizeItems(parsedParts.length ? parsedParts : FALLBACK_PARTS);
  const hasCompleteRam = normalized.every((part) => Number.isFinite(part.ram));
  const rfm = hasCompleteRam
    ? normalized.reduce((total, part) => total + part.count * part.ram, 0)
    : null;

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Compound: {formula}</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Relative formula mass (RFM): {rfm == null ? 'N/A' : rfm.toFixed(3)}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {normalized.map((part, index) => (
          <div key={`${part.symbol}-${index}`} className="rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {part.name} ({part.symbol})
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Atoms: {part.count}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              RAM: {part.ram == null ? 'N/A' : part.ram.toFixed(3)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Contribution: {part.ram == null ? 'N/A' : (part.ram * part.count).toFixed(3)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
