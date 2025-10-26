import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = typeof window !== 'undefined'
      ? window.localStorage.getItem('theme')
      : null;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    return savedTheme || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const body = document.body;
    const root = document.documentElement;

    body.classList.remove('light', 'dark');
    body.classList.add(theme);
    root.dataset.theme = theme;

    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
};
