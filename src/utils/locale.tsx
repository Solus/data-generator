'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import en from '@/locales/en';
import hr from '@/locales/hr';
import { LANG_COOKIE, type Lang } from '@/utils/lang';

type LocaleContextShape = {
  lang: Lang;
  setLang: (l: Lang) => void;
  strings: typeof en;
};

const LocaleContext = createContext<LocaleContextShape>({ lang: 'en', setLang: () => {}, strings: en });

export const LocaleProvider: React.FC<React.PropsWithChildren<{ initialLang?: Lang }>> = ({
  children,
  initialLang = 'hr',
}) => {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const strings = lang === 'hr' ? hr : en;

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = l;
    document.title = (l === 'hr' ? hr : en).appTitle;
  }, []);

  return <LocaleContext.Provider value={{ lang, setLang, strings }}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => useContext(LocaleContext);
