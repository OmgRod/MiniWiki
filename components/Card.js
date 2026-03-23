export default function Card({ title, description, children }) {
  return (
    <div className="miniwiki-card rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {title ? <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3> : null}
      {description ? <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">{description}</p> : null}
      {children ? <div className="text-sm text-slate-700 dark:text-slate-200">{children}</div> : null}
    </div>
  );
}
