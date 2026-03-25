import React, { useState } from 'react';

export function Tab({ children }) {
  return children;
}

export function TabPanels({ children }) {
  const tabs = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.props.title != null,
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (!tabs.length) {
    return null;
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 p-2 dark:border-slate-800">
        {tabs.map((tab, index) => (
          <button
            key={tab.props.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`rounded-md px-3 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              index === activeIndex
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {tab.props.title}
          </button>
        ))}
      </div>
      <div className="p-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
        {tabs[activeIndex]?.props.children}
      </div>
    </div>
  );
}

export default TabPanels;
