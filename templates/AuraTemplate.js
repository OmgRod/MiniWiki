export default function AuraTemplate({ children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-fuchsia-900/40 dark:bg-fuchsia-950/20">
      <article className="mdx-content prose prose-slate max-w-none dark:prose-invert">{children}</article>
    </section>
  );
}