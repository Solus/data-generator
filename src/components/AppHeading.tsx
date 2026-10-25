'use client';

import React from 'react';
import { useLocale } from '@/utils/locale';

// Client component so the heading follows the language selector without a page reload.
const AppHeading: React.FC = () => {
  const { strings } = useLocale();
  return (
    <div>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{strings.appTitle}</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{strings.appSubtitle}</p>
    </div>
  );
};

export default AppHeading;
