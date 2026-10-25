'use client';

import React from 'react';
import { useLocale } from '@/utils/locale';
import { COPY_SHORTCUT_KEY } from '@/utils/useGenerateShortcut';
import type { CopyStatus } from '@/utils/useCopyFeedback';
import { CheckIcon, CopyIcon, WarningIcon } from './icons';
import ShortcutHint from './ShortcutHint';

interface CopyButtonProps {
  status: CopyStatus;
  onClick: () => void;
  /** Accessible name, e.g. "Copy IBAN". The visible text is always the short label. */
  title?: string;
  /** Visible text; defaults to "Copy". */
  label?: string;
}

// The secondary action next to the primary button. Purely presentational: the page owns the
// useCopyFeedback state so a keyboard shortcut and this button give the same feedback.
const CopyButton: React.FC<CopyButtonProps> = ({ status, onClick, title, label }) => {
  const { strings } = useLocale();
  const text = label ?? strings.copy;
  const name = title ?? text;

  const stateClass =
    status === 'success'
      ? 'border-ink bg-ink text-on-ink'
      : status === 'error'
        ? 'border-accent text-accent'
        : 'border-ink text-ink hover:bg-ink hover:text-on-ink';

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        title={name}
        aria-label={name}
        aria-keyshortcuts={COPY_SHORTCUT_KEY.toUpperCase()}
        className={`inline-flex h-[52px] shrink-0 items-center justify-center gap-2.5 rounded-[2px] border px-4 text-[15px] font-medium transition-colors sm:h-12 ${stateClass}`}
      >
        {status === 'success' ? <CheckIcon /> : status === 'error' ? <WarningIcon /> : <CopyIcon />}
        {/* Icon-only below 360px so the primary button's label stays on one line (name stays via aria-label). */}
        <span className="max-[359px]:sr-only">{status === 'success' ? strings.copied : text}</span>
        <ShortcutHint keyName={COPY_SHORTCUT_KEY} />
      </button>
      {/* Announces the result to screen readers; the button's own text change isn't announced. */}
      <span role="status" className="sr-only">
        {status === 'success' ? strings.copied : ''}
      </span>
    </>
  );
};

export default CopyButton;
