import Link from 'next/link';

function isExternal(url = '') {
  return /^https?:\/\//i.test(url);
}

function FooterLink({ item }) {
  if (isExternal(item.url)) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-slate-700 transition hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-300"
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.url}
      className="text-sm text-slate-700 transition hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-300"
    >
      {item.label}
    </Link>
  );
}

function getColumnPlacementClass(index, total) {
  if (total === 1) {
    return 'md:col-span-6 md:col-start-4';
  }

  if (total === 2) {
    return index === 0
      ? 'md:col-span-4 md:col-start-2'
      : 'md:col-span-4 md:col-start-8';
  }

  if (total === 3) {
    return 'md:col-span-4';
  }

  return 'md:col-span-3';
}

export default function Footer({ siteConfig, footerConfig }) {
  const columns = footerConfig?.columns || [];
  const bottomLinks = footerConfig?.bottomLinks || [];
  const copyright =
    footerConfig?.copyright ||
    siteConfig?.footer?.text ||
    'MiniWiki Documentation · Built with MiniWiki';
  const tagLine = footerConfig?.tagLine || '';

  return (
    <footer className="miniwiki-footer mt-10 border-t border-slate-300 bg-gradient-to-b from-slate-100 to-slate-200 text-slate-700 dark:border-slate-700 dark:from-slate-900 dark:to-black dark:text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {columns.length ? (
          <div className="grid gap-8 md:grid-cols-12">
            {columns.map((column, index) => (
              <section key={column.title} className={getColumnPlacementClass(index, columns.length)}>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{column.title}</h3>
                <ul className="space-y-1.5">
                  {(column.links || []).map((item) => (
                    <li key={`${column.title}-${item.label}`}>
                      <FooterLink item={item} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}

        {tagLine ? <p className="mt-10 text-center text-sm text-slate-600 dark:text-slate-400">{tagLine}</p> : null}

        <div className="mt-6 border-t border-slate-300 pt-4 text-center text-xs text-slate-600 dark:border-slate-800 dark:text-slate-500">
          {bottomLinks.length ? (
            <p className="mb-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              {bottomLinks.map((item, index) => (
                <span key={item.label} className="inline-flex items-center gap-2">
                  <FooterLink item={item} />
                  {index < bottomLinks.length - 1 ? (
                    <span className="text-slate-400 dark:text-slate-700">|</span>
                  ) : null}
                </span>
              ))}
            </p>
          ) : null}
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
