'use client';

import React from 'react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDarkMode}
      onClick={toggleDarkMode}
      className={`${
        isDarkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
      title={isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode'}
    >
      <span
        aria-hidden="true"
        className={`${
          isDarkMode ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      >
        {/* Icon for Light mode (when toggle is off) */}
        <span
          className={`${
            isDarkMode ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
          } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
          aria-hidden="true"
        >
          <i className="fas fa-sun text-xs text-yellow-500"></i>
        </span>
        {/* Icon for Dark mode (when toggle is on) */}
        <span
          className={`${
            isDarkMode ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
          } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
          aria-hidden="true"
        >
          <i className="fas fa-moon text-xs text-gray-700"></i>
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
