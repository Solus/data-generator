import { useCallback, useEffect, useRef, useState } from 'react';
import { copyToClipboard } from './clipboard';

export type CopyStatus = 'idle' | 'success' | 'error';

// Copies text and reports a short-lived status ('success' / 'error' for 1.5 s, then 'idle'), so a
// button and a keyboard shortcut can share one code path and one piece of feedback.
export function useCopyFeedback() {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Don't touch state after unmount.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(async (text: string) => {
    const ok = await copyToClipboard(text);
    setStatus(ok ? 'success' : 'error');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 1500);
    return ok;
  }, []);

  return { status, copy };
}
