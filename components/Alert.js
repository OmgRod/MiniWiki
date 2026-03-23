export default function Alert({ type = 'info', title, children }) {
  const styles = {
    info: 'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100',
    warning:
      'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100',
    success:
      'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100',
    danger: 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100',
  };

  const colorClass = styles[type] || styles.info;

  return (
    <div className={`miniwiki-alert my-4 rounded-lg border px-4 py-3 shadow-sm ${colorClass}`}>
      {title ? <p className="mb-1 text-sm font-semibold">{title}</p> : null}
      <div className="text-sm leading-6">{children}</div>
    </div>
  );
}
