'use client';

import React, { useState } from 'react';
import { copyToClipboard } from '@/utils/clipboard';
import { useLocale } from '@/utils/locale';

type CopyFeedback = 'idle' | 'success' | 'error';

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  title?: string;
  onCopySuccess?: () => void;
  onCopyError?: (message: string) => void;
  onNoText?: () => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  className,
  title,
  onCopySuccess,
  onCopyError,
  onNoText,
}) => {
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>('idle');
  const { strings } = useLocale();

  const resolvedTitle = title ?? strings.copy;

  const handleCopy = async () => {
    if (!textToCopy) {
      onNoText?.();
      return;
    }

    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopyFeedback('success');
      onCopySuccess?.();
      setTimeout(() => setCopyFeedback('idle'), 1000);
    } else {
      setCopyFeedback('error');
      onCopyError?.(strings.copyFailed);
    }
  };

  const baseClassName = 'flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';
  const feedbackClassName =
    copyFeedback === 'success'
      ? 'bg-teal-500 text-white animate-pulse'
      : 'bg-transparent text-teal-600 dark:text-teal-400 hover:bg-slate-200 dark:hover:bg-slate-700/60';

  return (
    <button onClick={handleCopy} className={`${baseClassName} ${feedbackClassName} ${className}`} title={resolvedTitle}>
      {copyFeedback === 'success' ? <i className="fas fa-check"></i> : <i className="far fa-copy"></i>}
    </button>
  );
};

export default CopyButton;