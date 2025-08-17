'use client';

import React, { createContext, useContext, useState } from 'react';
import en from '@/locales/en';
import hr from '@/locales/hr';

type Lang = 'en' | 'hr';

type LocaleContextShape = {
  lang: Lang;
  setLang: (l: Lang) => void;
  strings: Record<string, any>;
};

const LocaleContext = createContext<LocaleContextShape>({ lang: 'en', setLang: () => {}, strings: en });

export const LocaleProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('hr');
  const strings = lang === 'hr' ? hr : en;
  return <LocaleContext.Provider value={{ lang, setLang, strings }}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => useContext(LocaleContext);
