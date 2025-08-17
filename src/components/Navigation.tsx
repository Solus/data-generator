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
    <nav>
      <ul className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link href={item.href} passHref>
                <button
                  className={`inline-block p-3 text-lg font-medium transition-colors rounded-t-lg cursor-pointer ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className={`${item.icon} mr-2`}></i> {item.label}
                </button>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}