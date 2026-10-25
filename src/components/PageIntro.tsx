'use client';

import React from 'react';
import { useLocale } from '@/utils/locale';

export type PageKey = 'iban' | 'oib' | 'names';

// Numbered position of each page, shared by the intro, the tabs and the footer title block.
export const PAGES: { key: PageKey; href: string; tabKey: 'tabIban' | 'tabOib' | 'tabNames'; titleKey: 'ibanGenerator' | 'oibGenerator' | 'namesGenerator'; }[] = [
  { key: 'iban', href: '/iban', tabKey: 'tabIban', titleKey: 'ibanGenerator' },
  { key: 'oib', href: '/oib', tabKey: 'tabOib', titleKey: 'oibGenerator' },
  { key: 'names', href: '/names', tabKey: 'tabNames', titleKey: 'namesGenerator' },
];

export const pad = (n: number) => String(n).padStart(2, '0');

const PageIntro: React.FC<{ page: PageKey }> = ({ page }) => {
  const { strings } = useLocale();
  const index = PAGES.findIndex(p => p.key === page);
  const def = PAGES[index];

  return (
    <header>
      <p className="eyebrow">
        {pad(index + 1)} — {strings[def.tabKey]}
      </p>
      <h1 className="mt-2 text-[1.9rem] font-medium leading-[1.1] tracking-[-0.025em] sm:text-[2.5rem]">{strings[def.titleKey]}</h1>    </header>
  );
};

export default PageIntro;
