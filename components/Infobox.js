export default function Infobox({ title, image, imageAlt = '', imageCaption, items = [] }) {
  return (
    <aside className="my-6 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {title ? <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3> : null}

      {image ? (
        <figure className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
          <img src={image} alt={imageAlt} className="h-auto w-full" />
          {imageCaption ? <figcaption className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400">{imageCaption}</figcaption> : null}
        </figure>
      ) : null}

      <dl className="divide-y divide-slate-200 dark:divide-slate-800">
        {items.map((item) => (
          <div key={item.label} className="grid grid-cols-[8rem_1fr] gap-3 py-2">
            <dt className="font-medium text-slate-700 dark:text-slate-300">{item.label}</dt>
            <dd className="text-slate-900 dark:text-slate-100">{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
