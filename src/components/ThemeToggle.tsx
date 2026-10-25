'use client';

import React from 'react';
import { useLocale } from '@/utils/locale';
import type { ThemePref } from '@/utils/theme';
import { MonitorIcon, MoonIcon, SunIcon } from './icons';

interface ThemeToggleProps {
  value: ThemePref;
  onChange: (pref: ThemePref) => void;
}

// Three-way segmented switch: Light / Auto (follows the device) / Dark. Built on native radio inputs,
// so arrow keys, focus and screen-reader semantics come for free. Icon-only on phones.
const ThemeToggle: React.FC<ThemeToggleProps> = ({ value, onChange }) => {
  const { strings } = useLocale();

  const options: { pref: ThemePref; label: string; Icon: typeof SunIcon }[] = [
    { pref: 'light', label: strings.themeLight, Icon: SunIcon },
    { pref: 'system', label: strings.themeSystem, Icon: MonitorIcon },
    { pref: 'dark', label: strings.themeDark, Icon: MoonIcon },
  ];

  return (
    <div role="radiogroup" aria-label={strings.themeLabel} className="flex gap-0.5 rounded-[2px] border border-control p-0.5">
      {options.map(({ pref, label, Icon }) => (
        <label key={pref} title={label} className="cursor-pointer">
          <input
            type="radio"
            name="theme"
            value={pref}
            checked={value === pref}
            onChange={() => onChange(pref)}
            className="peer sr-only"
          />
          <span className="flex h-8 w-7 items-center justify-center gap-1.5 rounded-[1px] text-[13px] text-muted transition-colors hover:text-ink peer-checked:bg-ink peer-checked:text-on-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-accent-2 sm:w-auto sm:px-2.5">
            <Icon width={15} height={15} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sr-only sm:hidden">{label}</span>
          </span>
        </label>
      ))}
    </div>
  );
};

export default ThemeToggle;
