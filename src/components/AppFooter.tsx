'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/utils/locale';
import { PAGES, pad } from './PageIntro';
import pkg from '../../package.json';

// Test-data note, plus a small drawing-sheet style title block (hidden on phones).
const AppFooter: React.FC = () => {
  const pathname = usePathname();
  const { strings } = useLocale();
  const index = PAGES.findIndex(p => p.href === pathname);
  const current = index >= 0 ? PAGES[index] : null;

  const cells: [string, string][] = [
    [strings.sheetLabel, current ? `${pad(index + 1)} / ${pad(PAGES.length)}` : '—'],
    [strings.typeLabel, current ? strings[current.tabKey] : '—'],
    [strings.versionLabel, pkg.version],
  ];

  return (
    <footer className="flex items-center justify-between gap-6 border-t border-line px-5 py-3.5 sm:h-14 sm:px-10 sm:py-0">
      <p className="text-xs leading-relaxed text-muted sm:text-[13px]">{strings.testDataNote}</p>
      <dl aria-hidden="true" className="hidden shrink-0 border border-frame font-mono text-[11px] uppercase tracking-[0.06em] text-muted sm:flex">
        {cells.map(([label, value], i) => (
          <div key={label} className={`px-3.5 py-1.5 ${i < cells.length - 1 ? 'border-r border-frame' : ''}`}>
            <dt className="inline">{label} </dt>
            <dd className="inline text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </footer>
  );
};

export default AppFooter;
