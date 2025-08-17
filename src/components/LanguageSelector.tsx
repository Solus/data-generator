'use client';

import React from 'react';
import { useLocale } from '@/utils/locale';

const LanguageSelector: React.FC = () => {
  const { lang, setLang } = useLocale();

  return (
    <div>
      <label htmlFor='lang-select' className='sr-only'>Select language</label>
      <select
        id='lang-select'
        value={lang}
        onChange={(e) => setLang(e.target.value as 'hr' | 'en')}
        className='rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-700 text-sm'
        aria-label='Select language'
      >
        <option value='hr'>HR</option>
        <option value='en'>EN</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
