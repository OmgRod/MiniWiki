export default function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
      {children}
    </kbd>
  );
}
