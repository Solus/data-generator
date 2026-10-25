'use client';

import React from 'react';
import { useLocale } from '@/utils/locale';
import LanguageSelector from './LanguageSelector';
import ThemeToggleWrapper from './ThemeToggleWrapper';

// The theme switch lives here from sm up; on phones it moves to the footer to keep this bar uncluttered.
const AppHeader: React.FC = () => {
  const { strings } = useLocale();

  return (
    <div className="flex h-14 items-center justify-between pl-5 pr-1 sm:h-[60px] sm:px-10">
      <p className="flex min-w-0 items-center gap-2.5 text-[15px] font-semibold leading-tight sm:gap-3">
        <span aria-hidden="true" className="relative inline-block h-4 w-4 shrink-0 border-[1.5px] border-ink sm:h-[18px] sm:w-[18px]">
          <span className="absolute left-[2.5px] top-[2.5px] h-[7px] w-[7px] bg-accent sm:left-[3px] sm:top-[3px] sm:h-2 sm:w-2" />
        </span>
        {strings.appTitle}
      </p>
      <div className="flex shrink-0 items-center gap-1 sm:gap-6">
        <LanguageSelector />
        <div className="hidden sm:block">
          <ThemeToggleWrapper />
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
