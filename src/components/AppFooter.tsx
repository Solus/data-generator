'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/utils/locale';
import { COPY_SHORTCUT_KEY, GENERATE_SHORTCUT_KEY } from '@/utils/useGenerateShortcut';
import ThemeToggleWrapper from './ThemeToggleWrapper';

const Key: React.FC<{ children: string }> = ({ children }) => (
  <kbd className="rounded-[2px] border border-dim px-1.5 font-mono text-xs uppercase leading-5 text-ink">{children}</kbd>
);

// Test-data note; on sm and up a legend of the keyboard shortcuts, on phones the theme switch.
const AppFooter: React.FC = () => {
  const pathname = usePathname();
  const { strings } = useLocale();
  const copyLabel = pathname === '/names' ? strings.copyAll : strings.copy;

  return (
    <footer className="border-t border-line px-5 py-3.5 sm:flex sm:h-14 sm:items-center sm:justify-between sm:gap-6 sm:px-10 sm:py-0">
      <p className="text-xs leading-relaxed text-muted sm:text-[13px]">{strings.testDataNote}</p>

      <ul className="hidden shrink-0 gap-5 text-[13px] text-muted [@media(hover:hover)]:flex">
        <li className="flex items-center gap-2"><Key>{GENERATE_SHORTCUT_KEY}</Key>{strings.shortcutGenerate}</li>
        <li className="flex items-center gap-2"><Key>{COPY_SHORTCUT_KEY}</Key>{copyLabel}</li>
      </ul>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:hidden">
        <span className="text-[13px] text-ink-soft">{strings.themeLabel}</span>
        <ThemeToggleWrapper size="md" />
      </div>
    </footer>
  );
};

export default AppFooter;
