import React from 'react';
import { ArrowIcon } from './icons';
import ShortcutHint from './ShortcutHint';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Show the "G" key badge (only wired up on pages that use useGenerateShortcut). */
  shortcut?: boolean;
}

// The one solid button: near-black on light, near-white on dark. Full width on phones.
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, shortcut = true, className = '', ...rest }) => (
  <button
    type="button"
    aria-keyshortcuts={shortcut ? 'G' : undefined}
    {...rest}
    className={`inline-flex h-[52px] w-full items-center justify-between gap-8 rounded-[2px] bg-ink px-5 text-[15px] font-medium text-on-ink transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:w-auto ${className}`}
  >
    <span>{children}</span>
    <span className="flex items-center gap-3">
      {shortcut && <ShortcutHint />}
      <ArrowIcon width={18} height={18} />
    </span>
  </button>
);

export default PrimaryButton;
