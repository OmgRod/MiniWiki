export default function FeatureList({ items = [] }) {
  return (
    <ul className="my-4 space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
