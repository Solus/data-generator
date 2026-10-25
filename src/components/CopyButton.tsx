'use client';

import React, { useEffect, useRef, useState } from 'react';
import { copyToClipboard } from '@/utils/clipboard';
import { useLocale } from '@/utils/locale';
import { CheckIcon, CopyIcon, WarningIcon } from './icons';

type CopyFeedback = 'idle' | 'success' | 'error';

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  /** Accessible name, e.g. "Copy IBAN". The visible text is always the short "Copy". */
  title?: string;
  onCopySuccess?: () => void;
  onCopyError?: (message: string) => void;
  onNoText?: () => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  className = '',
  title,
  onCopySuccess,
  onCopyError,
  onNoText,
}) => {
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { strings } = useLocale();

  const resolvedTitle = title ?? strings.copy;

  // Don't touch state after unmount.
  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const showFeedback = (feedback: CopyFeedback) => {
    setCopyFeedback(feedback);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyFeedback('idle'), 1500);
  };

  const handleCopy = async () => {
    if (!textToCopy) {
      onNoText?.();
      return;
    }

    const success = await copyToClipboard(textToCopy);
    if (success) {
      showFeedback('success');
      onCopySuccess?.();
    } else {
      showFeedback('error');
      onCopyError?.(strings.copyFailed);
    }
  };

  const stateClass =
    copyFeedback === 'success'
      ? 'border-ink bg-ink text-on-ink'
      : copyFeedback === 'error'
        ? 'border-accent text-accent'
        : 'border-ink text-ink hover:bg-ink hover:text-on-ink';

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        title={resolvedTitle}
        aria-label={resolvedTitle}
        className={`inline-flex h-11 items-center gap-2 rounded-[2px] border px-3.5 text-sm font-medium transition-colors sm:h-[34px] ${stateClass} ${className}`}
      >
        {copyFeedback === 'success' ? <CheckIcon width={15} height={15} /> : copyFeedback === 'error' ? <WarningIcon width={15} height={15} /> : <CopyIcon width={15} height={15} />}
        {copyFeedback === 'success' ? strings.copied : strings.copy}
      </button>
      {/* Announces the result to screen readers; the button's own text change isn't announced. */}
      <span role="status" className="sr-only">
        {copyFeedback === 'success' ? strings.copied : ''}
      </span>
    </>
  );
};

export default CopyButton;
