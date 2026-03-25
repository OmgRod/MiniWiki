import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

function SidebarSection({ section, currentPath }) {
  const initialOpen = useMemo(() => {
    if (!section?.items?.length) {
      return true;
    }

    return section.items.some((item) => item.path === currentPath);
  }, [section, currentPath]);

  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    if (initialOpen) {
      setIsOpen(true);
    }
  }, [initialOpen]);

  const collapsible = section.collapsible !== false;

  return (
    <section className="mb-4">
      <button
        type="button"
        onClick={() => collapsible && setIsOpen((value) => !value)}
        className="mb-2 flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <span>{section.title}</span>
        {collapsible ? <span className="text-xs">{isOpen ? '−' : '+'}</span> : null}
      </button>

      {isOpen ? (
        <ul className="space-y-1">
          {(section.items || []).map((item) => {
            const active = item.path === currentPath;

            return (
              <li key={`${item.title}-${item.path}`}>
                <Link
                  href={item.path}
                  className={`block rounded-md px-2 py-1.5 text-sm ${
                    active
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

export default function Sidebar({ sidebarConfig, currentPath, sidebarWidthClass = 'md:w-72' }) {
  const sections = sidebarConfig?.sections || [];

  return (
    <aside className={`miniwiki-sidebar w-full border-r border-slate-200 p-4 dark:border-slate-800 ${sidebarWidthClass} md:shrink-0`}>
      {sections.map((section) => (
        <SidebarSection key={section.title} section={section} currentPath={currentPath} />
      ))}
    </aside>
  );
}
