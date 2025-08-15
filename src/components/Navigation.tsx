'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/iban', icon: 'fas fa-money-check-dollar', label: 'IBAN Generator' },
  { href: '/oib', icon: 'fas fa-id-card', label: 'OIB Generator' },
  // { href: '/names', icon: 'fas fa-users', label: 'Names' },
];

export default function Navigation() {
  const pathname = usePathname();

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