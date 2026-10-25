// Copies text, preferring the async Clipboard API and falling back to a hidden textarea +
// execCommand (older browsers, insecure contexts). Only logs when BOTH fail, so a copy that works
// via the fallback doesn't leave an error in the console.
export const copyToClipboard = async (text: string): Promise<boolean> => {
  let apiError: unknown;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err: unknown) {
    apiError = err;
  }

  const previouslyFocused = document.activeElement as HTMLElement | null;
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.setAttribute('readonly', '');
  tempInput.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
  document.body.appendChild(tempInput);
  tempInput.select();

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (fallbackErr: unknown) {
    apiError = apiError ?? fallbackErr;
  } finally {
    document.body.removeChild(tempInput);
    previouslyFocused?.focus?.();
  }

  if (!success) console.warn('Could not copy to the clipboard:', apiError);
  return success;
};
