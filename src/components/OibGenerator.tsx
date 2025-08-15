'use client';

import React, { useState } from 'react';
import { generateRandomDigits, calculateOIBCheckDigit } from '@/utils/generators';
import CopyButton from './CopyButton';

const OibGenerator: React.FC = () => {
  // Use a lazy initializer for the initial state. This function runs only once.
  const [generatedOib, setGeneratedOib] = useState(() => {
    const firstTenDigits = generateRandomDigits(10);
    const checkDigit = calculateOIBCheckDigit(firstTenDigits);
    return firstTenDigits + checkDigit;
  });
  const [error, setError] = useState<string | null>(null);

  const generateOib = () => {
    setError(null);

    const firstTenDigits = generateRandomDigits(10);
    const checkDigit = calculateOIBCheckDigit(firstTenDigits);
    const oib = firstTenDigits + checkDigit;
    setGeneratedOib(oib);
  };

  return (
    <div className="space-y-6">
      {/* Generated OIB Display */}
      <div className="flex flex-col space-y-2">
        <label className="flex items-center font-bold">
          <i className="fas fa-id-card mr-2"></i> Generated OIB:
        </label>
        <div className="flex items-center space-x-2">
          <span className="flex-1 p-4 text-2xl text-center font-mono rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
            {generatedOib || '\u00a0'}
          </span>
          <CopyButton
            textToCopy={generatedOib}
            className="w-12 h-12 rounded-full"
            title="Copy OIB"
            onNoText={() => setError('No OIB to copy. Please generate one first.')}
            onCopyError={(message) => setError(message)}
          />
        </div>
        {error && <div className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</div>}
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
