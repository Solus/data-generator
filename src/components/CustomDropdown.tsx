'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronIcon } from './icons';

interface CustomDropdownProps<T> {
  options: Record<string, T>;
  value: string;
  onChange: (value: string) => void;
  renderDisplay: (value: string) => React.ReactNode;
  renderOption: (key: string, option: T) => React.ReactNode;
  disabled?: boolean;
  /** id of the element that labels this dropdown (for screen readers) */
  labelledBy?: string;
  className?: string;
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
  className = '',
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
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-activedescendant={isOpen ? optionId(activeIndex) : undefined}
        aria-labelledby={labelledBy}
        disabled={disabled}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-[2px] py-2 border border-control bg-sheet px-4 text-left text-[15px] text-ink hover:border-ink disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-control"
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
      >
        {renderDisplay(value)}
        <ChevronIcon width={14} height={14} className={`shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelledBy}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-[2px] border border-control bg-sheet shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
        >
          {keys.map((key, index) => (
            <li
              key={key}
              id={optionId(index)}
              role="option"
              aria-selected={key === value}
              className={`cursor-pointer px-4 py-3 text-[15px] ${index === activeIndex ? 'bg-paper' : ''} ${key === value ? 'font-semibold' : ''}`}
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
