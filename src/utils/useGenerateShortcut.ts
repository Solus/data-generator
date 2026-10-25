import { useEffect, useRef } from 'react';

export const GENERATE_SHORTCUT_KEY = 'g';
export const COPY_SHORTCUT_KEY = 'c';

// Pressing a single key on a page runs an action. Skipped while typing in a field, when a modifier
// key is held (so browser/OS shortcuts such as Ctrl+C keep working), and for held-down key repeats.
export function useKeyShortcut(key: string, onPress: () => void) {
  const latest = useRef(onPress);
  useEffect(() => {
    latest.current = onPress;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // e.key can be undefined on synthetic events (e.g. browser autofill), so don't call methods on it blindly.
      if (e.key?.toLowerCase() !== key) return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || e.defaultPrevented) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"], [role="listbox"], [role="combobox"], [role="option"]')) return;
      e.preventDefault();
      latest.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key]);
}

export const useGenerateShortcut = (onGenerate: () => void) => useKeyShortcut(GENERATE_SHORTCUT_KEY, onGenerate);
export const useCopyShortcut = (onCopy: () => void) => useKeyShortcut(COPY_SHORTCUT_KEY, onCopy);
