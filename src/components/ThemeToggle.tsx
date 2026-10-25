'use client';

import React, { useId } from 'react';
import { useLocale } from '@/utils/locale';
import type { ThemePref } from '@/utils/theme';
import { MonitorIcon, MoonIcon, SunIcon } from './icons';
import SegmentedControl from './SegmentedControl';

interface ThemeToggleProps {
  value: ThemePref;
  onChange: (pref: ThemePref) => void;
  size?: 'sm' | 'md';
}

// Three-way switch: Light / Auto (follows the device) / Dark.
const ThemeToggle: React.FC<ThemeToggleProps> = ({ value, onChange, size = 'sm' }) => {
  const { strings } = useLocale();
  const name = useId(); // unique per instance: the header and footer each render one

  return (
    <SegmentedControl<ThemePref>
      name={name}
      ariaLabel={strings.themeLabel}
      value={value}
      onChange={onChange}
      size={size}
      options={[
        { value: 'light', label: strings.themeLight, icon: <SunIcon width={15} height={15} /> },
        { value: 'system', label: strings.themeSystem, icon: <MonitorIcon width={15} height={15} /> },
        { value: 'dark', label: strings.themeDark, icon: <MoonIcon width={15} height={15} /> },
      ]}
    />
  );
};

export default ThemeToggle;
