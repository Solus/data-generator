'use client';

import React from 'react';
import { useLocale } from '@/utils/locale';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Text button (icon only on phones). The label names the mode you would switch to.
const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { strings } = useLocale();
  const action = isDarkMode ? strings.toggleLightMode : strings.toggleDarkMode;
  const target = isDarkMode ? strings.themeLight : strings.themeDark;

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label={action}
      title={action}
      className="flex h-11 min-w-11 items-center justify-center gap-2 text-sm text-ink sm:min-w-0"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="8" r="6.2" />
        {/* The filled half shows the side you would switch to. */}
        <path d="M8 1.8a6.2 6.2 0 0 1 0 12.4z" fill="currentColor" transform={isDarkMode ? 'translate(16 0) scale(-1 1)' : undefined} />
      </svg>
      <span className="hidden sm:inline">{target}</span>
    </button>
  );
};

export default ThemeToggle;
