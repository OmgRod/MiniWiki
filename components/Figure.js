export default function Figure({ src, alt = '', caption, width = '100%' }) {
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        style={{ width }}
        className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      />
      {caption ? <figcaption className="mt-2 text-sm text-slate-600 dark:text-slate-400">{caption}</figcaption> : null}
    </figure>
  );
}
