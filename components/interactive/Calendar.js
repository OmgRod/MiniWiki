import { useEffect, useMemo, useState } from 'react';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function normalizeEvents(events) {
  let source = events;

  if (typeof source === 'string' && source.trim()) {
    try {
      const jsonLike = source
        .trim()
        .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
        .replace(/'/g, '"');

      source = JSON.parse(jsonLike);
    } catch {
      source = [];
    }
  }

  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((event) => {
      const date = new Date(event?.date);
      if (Number.isNaN(date.getTime())) {
        return null;
      }

      return {
        date,
        dateKey: date.toISOString().slice(0, 10),
        title: String(event?.title || '').trim() || 'Untitled event',
        details: String(event?.details || event?.info || '').trim(),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);
}

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingEmpty = firstDay.getDay();

  const cells = Array.from({ length: leadingEmpty }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function formatShortDate(date) {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function toBoolean(value, fallback = true) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
  }

  return fallback;
}

function getInitialViewMonth({ startMonthSource, customYear, customMonth, events }) {
  const now = new Date();
  const normalizedSource = String(startMonthSource || 'today').trim().toLowerCase();

  if (normalizedSource === 'first-event' && events.length > 0) {
    const firstEventDate = events[0].date;
    return {
      year: firstEventDate.getFullYear(),
      month: firstEventDate.getMonth() + 1,
    };
  }

  if (normalizedSource === 'custom') {
    return {
      year: customYear,
      month: customMonth,
    };
  }

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}

function shiftMonth(year, month, delta) {
  const date = new Date(year, month - 1 + delta, 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

export default function Calendar({
  mode = 'month',
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
  monthNavigation = true,
  startMonthSource = 'today',
  events = [],
  title = 'Calendar',
  className = '',
}) {
  const safeYear = Number.isFinite(Number(year)) ? Number(year) : new Date().getFullYear();
  const safeMonth = Math.min(Math.max(Number(month) || 1, 1), 12);
  const allowMonthNavigation = toBoolean(monthNavigation, true);

  const normalizedEvents = useMemo(() => normalizeEvents(events), [events]);

  const initialView = useMemo(
    () => getInitialViewMonth({
      startMonthSource,
      customYear: safeYear,
      customMonth: safeMonth,
      events: normalizedEvents,
    }),
    [normalizedEvents, safeMonth, safeYear, startMonthSource]
  );

  const [view, setView] = useState(initialView);

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  const viewYear = view.year;
  const viewMonth = view.month;

  const eventMap = useMemo(() => {
    const map = new Map();

    normalizedEvents.forEach((event) => {
      if (event.date.getFullYear() !== viewYear || event.date.getMonth() + 1 !== viewMonth) {
        return;
      }

      if (!map.has(event.dateKey)) {
        map.set(event.dateKey, []);
      }
      map.get(event.dateKey).push(event);
    });

    return map;
  }, [normalizedEvents, viewMonth, viewYear]);

  if (mode === 'agenda') {
    return (
      <div className={`my-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {normalizedEvents.length === 0 ? (
            <p className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">No appointments scheduled.</p>
          ) : (
            normalizedEvents.map((event, index) => (
              <div key={`${event.dateKey}-${event.title}-${index}`} className="grid grid-cols-[130px_1fr] gap-4 px-4 py-3">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatShortDate(event.date)}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{event.title}</p>
                  {event.details ? <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{event.details}</p> : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  const monthGrid = getMonthGrid(viewYear, viewMonth);

  return (
    <div className={`my-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{MONTH_NAMES[viewMonth - 1]} {viewYear}</p>
          </div>

          {allowMonthNavigation ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView((prev) => shiftMonth(prev.year, prev.month, -1))}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setView((prev) => shiftMonth(prev.year, prev.month, 1))}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-200 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="px-1 py-2">{weekday}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {monthGrid.map((day, index) => {
          const dateKey = day ? `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
          const dayEvents = dateKey ? eventMap.get(dateKey) || [] : [];

          return (
            <div
              key={`${dateKey || 'empty'}-${index}`}
              className="min-h-24 border-b border-r border-slate-200 px-2 py-1.5 last:border-r-0 dark:border-slate-800"
            >
              {day ? (
                <>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{day}</p>
                  {dayEvents.length > 0 ? (
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event, eventIndex) => (
                        <p
                          key={`${event.title}-${eventIndex}`}
                          className="truncate rounded bg-blue-100 px-1.5 py-0.5 text-[11px] text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                          title={event.details || event.title}
                        >
                          {event.title}
                        </p>
                      ))}
                      {dayEvents.length > 2 ? (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">+{dayEvents.length - 2} more</p>
                      ) : null}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
