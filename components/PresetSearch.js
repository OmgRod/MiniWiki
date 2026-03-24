import { useMemo, useState } from 'react';
import Link from 'next/link';
import Badge from './Badge';
import CardGrid from './CardGrid';
import Card from './Card';

function toSearchableText(value) {
  if (value == null) {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map((item) => toSearchableText(item)).join(' ');
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, itemValue]) => `${key} ${toSearchableText(itemValue)}`)
      .join(' ');
  }

  return String(value);
}

function isExternal(url = '') {
  return /^https?:\/\//i.test(url);
}

function ResultLink({ href, children }) {
  if (!href) {
    return children;
  }

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="inline-flex">
        {children}
      </a>
    );
  }

  return <Link href={href}>{children}</Link>;
}

export default function PresetSearch({
  items = [],
  placeholder = 'Search items...',
  emptyMessage = 'No matching results.',
  limit = 24,
}) {
  const [query, setQuery] = useState('');

  const normalizedItems = useMemo(() => {
    return items.map((item) => {
      const metadataText = toSearchableText(item.metadata || item.meta || '');
      const tagsText = toSearchableText(item.tags || '');
      const searchable = `${item.title || ''} ${item.description || ''} ${metadataText} ${tagsText}`.toLowerCase();

      return {
        ...item,
        searchable,
      };
    });
  }, [items]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return normalizedItems.slice(0, limit);
    }

    return normalizedItems.filter((item) => item.searchable.includes(q)).slice(0, limit);
  }, [limit, normalizedItems, query]);

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-blue-300 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:max-w-md"
        />
        <p className="text-xs text-slate-600 dark:text-slate-400">{results.length} result(s)</p>
      </div>

      {results.length ? (
        <div className="mt-4">
          <CardGrid columns={2}>
            {results.map((item) => {
              const metadataEntries = item.metadata && typeof item.metadata === 'object'
                ? Object.entries(item.metadata)
                : [];

              const card = (
                <Card title={item.title} description={item.description}>
                  {item.tags?.length ? (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <Badge key={`${item.title}-${tag}`} variant="primary">{tag}</Badge>
                      ))}
                    </div>
                  ) : null}

                  {metadataEntries.length ? (
                    <dl className="space-y-1 text-xs">
                      {metadataEntries.map(([key, value]) => (
                        <div key={`${item.title}-${key}`} className="grid grid-cols-[7rem_1fr] gap-2">
                          <dt className="font-medium text-slate-600 dark:text-slate-300">{key}</dt>
                          <dd className="text-slate-800 dark:text-slate-100">{toSearchableText(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </Card>
              );

              return (
                <ResultLink key={`${item.title}-${item.href || 'no-link'}`} href={item.href}>
                  {card}
                </ResultLink>
              );
            })}
          </CardGrid>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{emptyMessage}</p>
      )}
    </div>
  );
}
