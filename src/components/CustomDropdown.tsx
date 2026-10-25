'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface CustomDropdownProps<T> {
  options: Record<string, T>;
  value: string;
  onChange: (value: string) => void;
  renderDisplay: (value: string) => React.ReactNode;
  renderOption: (key: string, option: T) => React.ReactNode;
  disabled?: boolean;
  /** id of the element that labels this dropdown (for screen readers) */
  labelledBy?: string;
}

// Select-only combobox following the WAI-ARIA pattern: the button owns focus and points at the
// highlighted option with aria-activedescendant. Keys: Up/Down/Home/End move, Enter/Space select,
// Escape closes, Tab closes and moves on.
const CustomDropdown = <T,>({
  options,
  value,
  onChange,
  renderDisplay,
  renderOption,
  disabled = false,
  labelledBy,
}: CustomDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const keys = Object.keys(options);
  const optionId = (index: number) => `${listId}-option-${index}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // A dropdown that becomes disabled while open (e.g. "random bank" switched on) must close.
  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  const open = () => {
    const selected = keys.indexOf(value);
    setActiveIndex(selected >= 0 ? selected : 0);
    setIsOpen(true);
  };

  const handleSelect = (key: string) => {
    onChange(key);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        open();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(keys.length - 1, i + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(0, i - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(keys.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleSelect(keys[activeIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        ref={buttonRef}
        type='button'
        role='combobox'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-activedescendant={isOpen ? optionId(activeIndex) : undefined}
        aria-labelledby={labelledBy}
        disabled={disabled}
        className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed'
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
      >
        {renderDisplay(value)}
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden='true'
        />
      </button>
      {isOpen && (
        <ul
          id={listId}
          role='listbox'
          aria-labelledby={labelledBy}
          className='absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto'
        >
          {keys.map((key, index) => (
            <li
              key={key}
              id={optionId(index)}
              role='option'
              aria-selected={key === value}
              className={`p-2 cursor-pointer ${
                index === activeIndex ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              // mousedown (not click) so the button keeps focus and the outside-click handler isn't involved
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(key);
              }}
            >
              {renderOption(key, options[key])}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
