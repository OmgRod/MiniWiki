export default function Steps({ items = [] }) {
  return (
    <ol className="my-6 space-y-3">
      {items.map((item, index) => (
        <li key={`step-${index}`} className="flex gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {index + 1}
          </span>
          {typeof item === 'string' ? (
            <span className="text-sm text-slate-700 dark:text-slate-200">{item}</span>
          ) : (
            <div className="min-w-0 flex-1">{item}</div>
          )}
        </li>
      ))}
    </ol>
  );
}
