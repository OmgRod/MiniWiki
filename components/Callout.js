import Icon from './Icon';

export default function Callout({ icon = 'idea', children }) {
  return (
    <div className="miniwiki-callout my-4 flex items-start gap-3 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-blue-600 dark:text-blue-400">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0 text-sm leading-6">{children}</div>
    </div>
  );
}
