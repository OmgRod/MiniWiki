export default function MidnightTemplate({ children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-indigo-900/40 dark:bg-indigo-950/30">
      <article className="mdx-content prose prose-slate max-w-none dark:prose-invert">{children}</article>
    </section>
  );
}