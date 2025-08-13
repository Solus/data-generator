'use client';

import React, { useState, useEffect } from 'react';

// Helper Functions
const generateRandomDigits = (length: number): string => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const calculateOIBCheckDigit = (firstTenDigits: string): string => {
  let sum = 10;
  for (let i = 0; i < 10; i++) {
    let digit = parseInt(firstTenDigits[i], 10);
    sum = sum + digit;
    sum = sum % 10;
    if (sum === 0) {
      sum = 10;
    }
    sum = sum * 2;
    sum = sum % 11;
  }
  let checkDigit = 11 - sum;
  if (checkDigit === 10) {
    checkDigit = 0;
  }
  return checkDigit.toString();
};

const copyToClipboard = async (text: string, buttonElement: HTMLButtonElement): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err: unknown) {
    console.error('Failed to copy using Clipboard API:', err);
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

const OibGenerator: React.FC = () => {
  const [generatedOib, setGeneratedOib] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  // Effect to generate OIB on initial load
  useEffect(() => {
    generateOib();
  }, []);

  const generateOib = () => {
    setError(null);
    setCopyFeedback('idle');

    const firstTenDigits = generateRandomDigits(10);
    const checkDigit = calculateOIBCheckDigit(firstTenDigits);
    const oib = firstTenDigits + checkDigit;
    setGeneratedOib(oib);
  };

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!generatedOib) {
      setError('No OIB to copy. Please generate one first.');
      return;
    }
    const success = await copyToClipboard(generatedOib, e.currentTarget);
    if (success) {
      setCopyFeedback('success');
      setTimeout(() => setCopyFeedback('idle'), 1000);
    } else {
      setCopyFeedback('error');
      setError('Failed to copy OIB. Please copy manually.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Generated OIB Display */}
      <div className="flex flex-col space-y-2">
        <label className="flex items-center font-bold">
          <i className="fas fa-id-card mr-2"></i> Generated OIB:
        </label>
        <div className="flex items-center space-x-2">
          <span className="flex-1 p-4 text-2xl text-center font-mono rounded-lg bg-gray-100 border border-gray-300">
            {generatedOib || '\u00a0'}
          </span>
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center py-2 px-4 rounded-lg text-white transition-colors
              ${copyFeedback === 'success' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}
            `}
            title="Copy OIB"
          >
            {copyFeedback === 'success' ? (
              <i className="fas fa-check"></i>
            ) : (
              <i className="fas fa-copy"></i>
            )}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      {/* Generate Button */}
      <button
        onClick={generateOib}
        className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        <i className="fas fa-dice mr-2"></i> Generate OIB
      </button>
    </div>
  );
};

export default OibGenerator;
