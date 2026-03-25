import { useState } from 'react';

const FALLBACK_CARDS = [
  { front: 'SSG', back: 'Static Site Generation' },
  { front: 'CSR', back: 'Client-Side Rendering' },
  { front: 'ISR', back: 'Incremental Static Regeneration' },
];

function normalizeCards(cards) {
  if (Array.isArray(cards) && cards.length > 0) {
    return cards;
  }

  return FALLBACK_CARDS;
}

export default function Flashcards({ cards = [], className = '' }) {
  const normalizedCards = normalizeCards(cards);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const current = normalizedCards[activeIndex] || normalizedCards[0];

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <button
        type="button"
        onClick={() => setShowBack((value) => !value)}
        className="min-h-28 w-full rounded-lg border border-slate-300 px-4 py-5 text-left hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
      >
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {showBack ? 'Answer' : 'Prompt'}
        </p>
        <p className="text-sm text-slate-800 dark:text-slate-100">{showBack ? current?.back : current?.front}</p>
      </button>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveIndex((value) => Math.max(0, value - 1));
            setShowBack(false);
          }}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Previous
        </button>

        <span className="text-xs text-slate-500 dark:text-slate-400">
          {activeIndex + 1}/{normalizedCards.length}
        </span>

        <button
          type="button"
          onClick={() => {
            setActiveIndex((value) => Math.min(normalizedCards.length - 1, value + 1));
            setShowBack(false);
          }}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}
