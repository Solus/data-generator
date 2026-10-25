'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/utils/locale';
import { PAGES, pad } from './PageIntro';

// Numbered top tabs. Short labels on phones so three tabs share the width; full labels from sm up.
export default function Navigation() {
  const pathname = usePathname();
  const { strings } = useLocale();

  return (
    <nav aria-label={strings.navigationLabel} className="flex border-y border-line px-0 sm:px-10">
      {PAGES.map((item, i) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'relative flex h-12 flex-1 items-center justify-center gap-2 text-sm sm:h-[52px] sm:flex-none sm:justify-start sm:gap-3 sm:pr-9 sm:text-[15px]',
              isActive ? 'font-semibold text-ink' : 'text-ink-soft hover:text-accent',
            ].join(' ')}
          >
            <span className={`font-mono text-[11px] sm:text-xs ${isActive ? 'font-medium text-accent' : 'text-muted'}`}>{pad(i + 1)}</span>
            <span className="hidden sm:inline">{strings[item.titleKey]}</span>
            <span className="sm:hidden">{strings[item.tabKey]}</span>
            {isActive && <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-[3px] bg-accent sm:right-9" />}
          </Link>
        );
      })}
    </nav>
  );
}
