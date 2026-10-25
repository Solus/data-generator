// Theme preference: 'light', 'dark', or 'system' (follow the device). Stored in localStorage under
// "theme"; 'system' is stored as the absence of the key, so older saved values keep working.
// The <html class="dark"> flag is what the CSS reads; the inline script in layout.tsx sets it before
// first paint, and this module keeps it in sync afterwards.
export type ThemePref = 'light' | 'dark' | 'system';

const KEY = 'theme';
const EVENT = 'theme-pref-change';
const DARK_QUERY = '(prefers-color-scheme: dark)';

export const readPref = (): ThemePref => {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    return 'system'; // storage unavailable (private mode etc.)
  }
};

const applyTheme = (pref: ThemePref) => {
  const dark = pref === 'dark' || (pref === 'system' && window.matchMedia(DARK_QUERY).matches);
  document.documentElement.classList.toggle('dark', dark);
};

export const setPref = (pref: ThemePref) => {
  try {
    if (pref === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    // The choice just won't persist across visits.
  }
  applyTheme(pref);
  window.dispatchEvent(new Event(EVENT));
};

// For useSyncExternalStore. Also re-applies the theme when the device setting changes (while on
// 'system') and when the preference is changed in another tab.
export const subscribePref = (onChange: () => void) => {
  const media = window.matchMedia(DARK_QUERY);
  const onMediaChange = () => {
    if (readPref() === 'system') applyTheme('system');
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      applyTheme(readPref());
      onChange();
    }
  };

  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onStorage);
  media.addEventListener('change', onMediaChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onStorage);
    media.removeEventListener('change', onMediaChange);
  };
};
