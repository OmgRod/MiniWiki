import { useState } from 'react';

export function TabPanels({ tabs = [] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const activeTab = tabs.find((tab) => tab.id === active) || tabs[0];

  if (!tabs.length) {
    return null;
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 p-2 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`rounded-md px-3 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              tab.id === active
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 text-sm leading-6 text-slate-700 dark:text-slate-200">{activeTab?.content}</div>
    </div>
  );
}

export default TabPanels;
