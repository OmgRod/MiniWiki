import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Icon from './Icon';

function normalizeRoutePath(routePath = '/') {
  if (!routePath) {
    return '/';
  }

  const normalized = `/${String(routePath).replace(/^\/+|\/+$/g, '')}`;
  return normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
}

function getNestedItems(item) {
  if (Array.isArray(item?.items)) {
    return item.items;
  }

  if (Array.isArray(item?.children)) {
    return item.children;
  }

  return [];
}

function itemContainsCurrentPath(item, currentPath) {
  if (item?.path && normalizeRoutePath(item.path) === normalizeRoutePath(currentPath)) {
    return true;
  }

  const nested = getNestedItems(item);
  return nested.some((child) => itemContainsCurrentPath(child, currentPath));
}

function SidebarItems({ items, currentPath, depth = 0 }) {
  return (
    <ul className={`${depth === 0 ? 'space-y-1' : 'mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700/70'}`}>
      {items.map((item) => {
        const nestedItems = getNestedItems(item);

        if (nestedItems.length > 0) {
          return (
            <SidebarGroup
              key={`${item.title}-${depth}`}
              item={item}
              currentPath={currentPath}
              depth={depth}
            />
          );
        }

        const active = normalizeRoutePath(item.path) === normalizeRoutePath(currentPath);

        return (
          <li key={`${item.title}-${item.path}`}>
            <Link
              href={item.path}
              className={`block rounded-md px-2 py-1.5 ${
                depth === 0 ? 'text-sm' : 'text-[13px]'
              } ${
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
  );
}

function SidebarGroup({ item, currentPath, depth }) {
  const nestedItems = getNestedItems(item);
  const initialOpen = useMemo(() => {
    if (!nestedItems.length) {
      return true;
    }

    if (item.defaultOpen === true) {
      return true;
    }

    return nestedItems.some((child) => itemContainsCurrentPath(child, currentPath));
  }, [nestedItems, item.defaultOpen, currentPath]);

  const [isOpen, setIsOpen] = useState(initialOpen);

  useEffect(() => {
    if (initialOpen) {
      setIsOpen(true);
    }
  }, [initialOpen]);

  const collapsible = item.collapsible !== false;

  return (
    <li>
      <button
        type="button"
        onClick={() => collapsible && setIsOpen((value) => !value)}
        className={`group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left ${
          depth === 0
            ? 'text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
            : 'text-[13px] font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        }`}
      >
        <span>{item.title}</span>
        {collapsible ? (
          <Icon
            name="chevrondown"
            size={14}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
          />
        ) : null}
      </button>

      {isOpen ? <SidebarItems items={nestedItems} currentPath={currentPath} depth={depth + 1} /> : null}
    </li>
  );
}

function SidebarSection({ section, currentPath }) {
  const initialOpen = useMemo(() => {
    if (!section?.items?.length) {
      return true;
    }

    return section.items.some((item) => itemContainsCurrentPath(item, currentPath));
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
        {collapsible ? (
          <Icon
            name="chevrondown"
            size={14}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
          />
        ) : null}
      </button>

      {isOpen ? <SidebarItems items={section.items || []} currentPath={currentPath} depth={0} /> : null}
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
