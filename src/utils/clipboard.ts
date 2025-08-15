export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err: unknown) {
    console.error('Failed to copy using Clipboard API:', err);
    // Fallback for older browsers or insecure contexts
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      const success = document.execCommand('copy');
      document.body.removeChild(tempInput);
      return success;
    } catch (fallbackErr: unknown) {
      console.error('Failed to copy even with execCommand:', fallbackErr);
      document.body.removeChild(tempInput);
      return false;
    }
  }
};