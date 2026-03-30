import { useEffect, useState } from 'react';
import Icon from './Icon';

const STORAGE_KEY = 'miniwiki-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, customThemes) {
  const root = document.documentElement;
  const themeConfig = customThemes[theme] || {};

  Object.entries(themeConfig).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  root.classList.toggle('dark', theme === 'dark');
}

export default function DarkModeToggle({ customThemes = {} }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial, customThemes);
  }, [customThemes]);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme, customThemes);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors duration-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:text-slate-300 dark:hover:text-blue-300"
      aria-label="Toggle color mode"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="relative h-5 w-5">
        <Icon
          name="sun"
          size={18}
          className={`absolute inset-0 transition-all duration-300 ease-out ${
            theme === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
          }`}
        />
        <Icon
          name="moon"
          size={18}
          className={`absolute inset-0 transition-all duration-300 ease-out ${
            theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
          }`}
        />
      </span>
    </button>
  );
}
