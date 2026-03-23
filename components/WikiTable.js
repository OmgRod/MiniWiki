export function Table({ children, className = '' }) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <table className={`min-w-full border-collapse text-left text-sm ${className}`.trim()}>{children}</table>
    </div>
  );
}

export function THead({ children, className = '' }) {
  return <thead className={`bg-slate-100 dark:bg-slate-900/80 ${className}`.trim()}>{children}</thead>;
}

export function TBody({ children, className = '', striped = true }) {
  const stripedClass = striped
    ? '[&>tr:nth-child(even)]:bg-slate-50/80 dark:[&>tr:nth-child(even)]:bg-slate-900/40'
    : '';

  return <tbody className={`${stripedClass} ${className}`.trim()}>{children}</tbody>;
}

export function TR({ children, className = '' }) {
  return <tr className={`border-b border-slate-200 last:border-0 dark:border-slate-800 ${className}`.trim()}>{children}</tr>;
}

export function TH({ children, className = '' }) {
  return (
    <th className={`px-4 py-2 align-top font-semibold text-slate-900 dark:text-slate-100 ${className}`.trim()}>
      {children}
    </th>
  );
}

export function TD({ children, className = '' }) {
  return <td className={`px-4 py-2 align-top text-slate-700 dark:text-slate-200 ${className}`.trim()}>{children}</td>;
}

export function Caption({ children, className = '' }) {
  return <caption className={`px-4 py-3 text-left text-xs text-slate-600 dark:text-slate-400 ${className}`.trim()}>{children}</caption>;
}

export default Table;
