'use client';

import React, { useSyncExternalStore } from 'react';
import ThemeToggle from './ThemeToggle';

const DARK_QUERY = '(prefers-color-scheme: dark)';

const readSavedTheme = (): string | null => {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
};

// The <html class="dark"> flag is the single source of truth. The initial value is set by an inline
// script in layout.tsx before first paint; this store just mirrors it so the toggle can't drift.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Follow the OS theme unless the user picked one explicitly.
  const media = window.matchMedia(DARK_QUERY);
  const onSystemChange = (e: MediaQueryListEvent) => {
    if (!readSavedTheme()) document.documentElement.classList.toggle('dark', e.matches);
  };
  media.addEventListener('change', onSystemChange);

  return () => {
    observer.disconnect();
    media.removeEventListener('change', onSystemChange);
  };
};

const getSnapshot = () => document.documentElement.classList.contains('dark');
const getServerSnapshot = () => false;

const ThemeToggleWrapper = () => {
  const isDarkMode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleDarkMode = () => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // Storage unavailable (private mode etc.): the choice just won't persist.
    }
  };

  return <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
};

export default ThemeToggleWrapper;
