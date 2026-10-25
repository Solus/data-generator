import React from 'react';
import { GENERATE_SHORTCUT_KEY } from '@/utils/useGenerateShortcut';

// Small key badge for generate buttons. Hidden on devices without a hover-capable pointer (touch),
// where there's no keyboard to use it with.
const ShortcutHint: React.FC = () => (
  <kbd
    aria-hidden="true"
    className="ml-1 hidden rounded border border-white/40 px-1.5 text-xs font-mono uppercase leading-5 opacity-80 [@media(hover:hover)]:inline-block"
  >
    {GENERATE_SHORTCUT_KEY}
  </kbd>
);

export default ShortcutHint;
