'use client';

import React from 'react';
import { useLocale } from '@/utils/locale';
import type { Lang } from '@/utils/lang';

const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: 'hr', label: 'HR', name: 'Hrvatski' },
  { code: 'en', label: 'EN', name: 'English' },
];

// Plain text toggle. Each language is named in its own language, as is conventional.
const LanguageSelector: React.FC = () => {
  const { lang, setLang, strings } = useLocale();

  return (
    <div role="group" aria-label={strings.selectLanguage} className="flex items-center text-sm">
      {LANGS.map((l, i) => (
        <React.Fragment key={l.code}>
          {i > 0 && <span aria-hidden="true" className="text-muted">/</span>}
          <button
            type="button"
            lang={l.code}
            aria-label={l.name}
            aria-pressed={lang === l.code}
            onClick={() => setLang(l.code)}
            className={`flex h-11 min-w-9 items-center justify-center px-1 sm:min-w-0 ${lang === l.code ? 'font-semibold text-ink' : 'text-muted hover:text-ink'}`}
          >
            {l.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default LanguageSelector;
