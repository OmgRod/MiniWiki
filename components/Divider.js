export default function Divider({ label }) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      {label ? <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span> : null}
      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
