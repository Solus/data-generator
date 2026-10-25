// Plain module (no 'use client') so both the server layout and the client LocaleProvider can import it.
export type Lang = 'en' | 'hr';

// The language lives in a cookie (not localStorage) so the server can render <html lang> and the
// right strings on the first response, with no flash of the wrong language.
export const LANG_COOKIE = 'lang';
