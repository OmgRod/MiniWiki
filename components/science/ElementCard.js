export default function ElementCard({
  symbol = 'H',
  name = 'Hydrogen',
  number = 1,
  group = 'Nonmetal',
  atomicMass = '1.008',
  summary = '',
  className = '',
}) {
  return (
    <article className={`my-4 max-w-sm rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <div className="mb-3 grid grid-cols-[auto_1fr] items-start gap-3">
        <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-center dark:border-blue-800 dark:bg-blue-950/40">
          <div className="text-xs text-slate-500 dark:text-slate-400">{number}</div>
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{symbol}</div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{group}</p>
        </div>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-200">
        Atomic mass: <span className="font-medium">{atomicMass}</span>
      </p>

      {summary ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{summary}</p> : null}
    </article>
  );
}
