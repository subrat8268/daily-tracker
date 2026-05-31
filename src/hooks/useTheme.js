import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('sj-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.add('theme-transition');
    localStorage.setItem('sj-theme', theme);
    const t = setTimeout(() => document.documentElement.classList.remove('theme-transition'), 300);
    return () => clearTimeout(t);
  }, [theme]);

  const toggle = () => setTheme((t) => t === 'light' ? 'dark' : 'light');

  return { theme, toggle, isDark: theme === 'dark' };
}
