import Icon from './Icon';

export default function Callout({ icon = 'idea', variant = 'default', children }) {
  const styles = {
    default:
      'border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/35 dark:text-blue-100',
    caution:
      'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/35 dark:text-amber-100',
    error:
      'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/35 dark:text-rose-100',
    note:
      'border-purple-300 bg-purple-50 text-purple-900 dark:border-purple-800 dark:bg-purple-950/35 dark:text-purple-100',
    success:
      'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-100',
  };

  const iconStyles = {
    default: 'text-blue-600 dark:text-blue-400',
    caution: 'text-amber-600 dark:text-amber-400',
    error: 'text-rose-600 dark:text-rose-400',
    note: 'text-purple-600 dark:text-purple-400',
    success: 'text-emerald-600 dark:text-emerald-400',
  };

  const colorClass = styles[variant] || styles.default;
  const iconColorClass = iconStyles[variant] || iconStyles.default;

  return (
    <div className={`miniwiki-callout my-4 flex items-start gap-3 rounded-lg border px-4 py-3 shadow-sm ${colorClass}`}>
      <span className={`mt-3 inline-flex h-5 w-5 shrink-0 items-center justify-center leading-none ${iconColorClass}`}>
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0 text-sm leading-6 [&_p]:m-0">{children}</div>
    </div>
  );
}
