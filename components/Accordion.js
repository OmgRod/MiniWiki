import { useState } from 'react';

export default function Accordion({ items = [] }) {
  const [openId, setOpenId] = useState(items[0]?.id);

  if (!items.length) {
    return null;
  }

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <span>{item.title}</span>
              <span className="text-base">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen ? (
              <div className="bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
