'use client';

import React, { useSyncExternalStore } from 'react';
import ThemeToggle from './ThemeToggle';
import { readPref, setPref, subscribePref, type ThemePref } from '@/utils/theme';

const getServerSnapshot = (): ThemePref => 'system';

const ThemeToggleWrapper = () => {
  const pref = useSyncExternalStore(subscribePref, readPref, getServerSnapshot);
  return <ThemeToggle value={pref} onChange={setPref} />;
};

export default ThemeToggleWrapper;
