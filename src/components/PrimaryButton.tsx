import React from 'react';
import { ArrowIcon } from './icons';
import ShortcutHint from './ShortcutHint';
import { GENERATE_SHORTCUT_KEY } from '@/utils/useGenerateShortcut';

// The one solid button: near-black on light, near-white on dark. Fills the row next to the copy
// button on phones; natural width from sm up.
const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...rest }) => (
  <button
    type="button"
    aria-keyshortcuts={GENERATE_SHORTCUT_KEY.toUpperCase()}
    {...rest}
    className={`inline-flex h-[52px] min-w-0 flex-1 items-center justify-between gap-6 rounded-[2px] bg-ink px-5 text-[15px] font-medium text-on-ink transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:flex-none sm:gap-8 ${className}`}
  >
    <span>{children}</span>
    <span className="flex items-center gap-3">
      <ShortcutHint keyName={GENERATE_SHORTCUT_KEY} />
      <ArrowIcon width={18} height={18} />
    </span>
  </button>
);

export default PrimaryButton;
