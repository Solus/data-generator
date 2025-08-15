'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface CustomDropdownProps<T> {
  options: Record<string, T>;
  value: string;
  onChange: (value: string) => void;
  renderDisplay: (value: string) => React.ReactNode;
  renderOption: (key: string, option: T) => React.ReactNode;
}

const CustomDropdown = <T,>({ options, value, onChange, renderDisplay, renderOption }: CustomDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (key: string) => {
    onChange(key);
    setIsOpen(false);
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        type='button'
        className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        onClick={() => setIsOpen(!isOpen)}
      >
        {renderDisplay(value)}
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden='true'
        />
      </button>
      {isOpen && (
        <ul className='absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
          {Object.entries(options).map(([key, option]) => (
            <li
              key={key}
              className='p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
              onClick={() => handleSelect(key)}
            >
              {renderOption(key, option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
