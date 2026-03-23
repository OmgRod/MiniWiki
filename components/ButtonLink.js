import Link from 'next/link';

export default function ButtonLink({ href, variant = 'default', children }) {
  const classes = {
    default:
      'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
    primary:
      'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400',
    ghost:
      'border-transparent bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
  };

  return (
    <Link
      href={href}
      className={`miniwiki-button inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${classes[variant] || classes.default}`}
    >
      {children}
    </Link>
  );
}
