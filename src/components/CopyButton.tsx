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

  const baseClassName = 'flex items-center justify-center text-white transition-colors';
  const feedbackClassName = copyFeedback === 'success' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <button onClick={handleCopy} className={`${baseClassName} ${feedbackClassName} ${className}`} title={resolvedTitle}>
      {copyFeedback === 'success' ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
    </button>
  );
};

export default CopyButton;