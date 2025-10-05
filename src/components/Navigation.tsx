'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/utils/locale';

export default function Navigation() {
  const pathname = usePathname();
  const { strings } = useLocale();

  const navItems = [
    { href: '/iban', icon: 'fas fa-money-check-dollar', label: strings.ibanGenerator },
    { href: '/oib', icon: 'fas fa-id-card', label: strings.oibGenerator },
    { href: '/names', icon: 'fas fa-users', label: strings.namesGenerator },
  ];

  return (
    <nav
      aria-label={strings?.navigationLabel || 'Main navigation'}
      className="overflow-x-auto scrollbar-none"
    >
      <ul
        className="flex items-stretch gap-1 md:gap-2 px-2 md:px-4
        border-b border-gray-200 dark:border-slate-600
        bg-white/90 dark:bg-slate-900/95 backdrop-blur-sm rounded-t-3xl"
        role="tablist"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'relative inline-flex items-center gap-2 px-4 py-3.5 md:px-5 text-sm font-medium rounded-t-md',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
                  'transition-colors motion-safe:duration-150',
                  isActive
                    ? 'text-teal-600 dark:text-teal-400 after:content-[""] after:absolute after:inset-x-3 after:-bottom-px after:h-[2px] after:rounded-full after:bg-teal-500 dark:after:bg-teal-400'
                    : [
                        'text-gray-600 dark:text-gray-300',
                        'hover:text-teal-600 dark:hover:text-teal-300',
                        'hover:bg-teal-500/5 dark:hover:bg-slate-700/60',
                        'active:bg-teal-500/10 dark:active:bg-slate-700/80',
                      ].join(' '),
                ].join(' ')}
              >
                <i className={item.icon} aria-hidden="true"></i>
                <span>{item.label}</span>
                {!isActive && (
                  <span className="sr-only">
                    {strings?.navigateTo || 'Go to'} {item.label}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}