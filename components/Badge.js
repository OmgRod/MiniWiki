export default function Badge({ variant = 'default', children }) {
  const styles = {
    default: 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
    primary: 'border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200',
    success:
      'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
    warning:
      'border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200',
    danger: 'border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[variant] || styles.default}`}>
      {children}
    </span>
  );
}
