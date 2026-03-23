export default function DefinitionList({ items = [] }) {
  return (
    <dl className="my-6 space-y-3">
      {items.map((item) => (
        <div
          key={item.term}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <dt className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.term}</dt>
          <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{item.definition}</dd>
        </div>
      ))}
    </dl>
  );
}
