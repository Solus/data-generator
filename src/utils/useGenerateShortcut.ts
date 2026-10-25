import { useEffect, useRef } from 'react';

export const GENERATE_SHORTCUT_KEY = 'g';

// Pressing "G" on a page runs its generate action. Skipped while typing in a field, when a modifier
// key is held (so browser/OS shortcuts keep working), and for held-down key repeats.
export function useGenerateShortcut(onGenerate: () => void) {
  const latest = useRef(onGenerate);
  useEffect(() => {
    latest.current = onGenerate;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== GENERATE_SHORTCUT_KEY) return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || e.defaultPrevented) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"], [role="listbox"], [role="combobox"], [role="option"]')) return;
      e.preventDefault();
      latest.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
