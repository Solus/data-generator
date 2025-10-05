'use client';

import React, { useState } from 'react';
import { generateRandomDigits, calculateOIBCheckDigit } from '@/utils/generators';
import CopyButton from './CopyButton';
import { useLocale } from '@/utils/locale';

const OibGenerator: React.FC = () => {
  const [generatedOib, setGeneratedOib] = useState(() => {
    const firstTenDigits = generateRandomDigits(10);
    const checkDigit = calculateOIBCheckDigit(firstTenDigits);
    return firstTenDigits + checkDigit;
  });
  const [error, setError] = useState<string | null>(null);
  const { strings } = useLocale();

  const generateOib = () => {
    setError(null);
    const firstTenDigits = generateRandomDigits(10);
    const checkDigit = calculateOIBCheckDigit(firstTenDigits);
    setGeneratedOib(firstTenDigits + checkDigit);
  };

  return (
    <div className="space-y-6">
      {/* OIB Display */}
      <div className="space-y-2">
        <label className="flex items-center font-semibold text-gray-800 dark:text-gray-200">
          <i className="fas fa-id-card mr-2 text-gray-600 dark:text-gray-400"></i>
          {strings.generatedOibLabel}
        </label>

        <div
          className="relative rounded-xl border border-teal-200 dark:border-slate-700 ring-1 ring-inset ring-teal-100 dark:ring-slate-700/60 bg-teal-50 dark:bg-slate-800"
          aria-live="polite"
        >
          <div className="pl-4 pr-12 py-3 text-3xl text-left font-mono tracking-wide text-gray-900 dark:text-slate-100">
            {generatedOib ? (
              <span className="font-mono font-semibold">{generatedOib}</span>
            ) : (
              '\u00a0'
            )}
          </div>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <CopyButton
              textToCopy={generatedOib}
              className="w-10 h-10 rounded-md cursor-pointer bg-transparent border-0 shadow-none
                  hover:bg-teal-100 dark:hover:bg-slate-700/60
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
                  focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900
                  [&>i]:text-teal-600 dark:[&>i]:text-teal-400 [&>i]:[font-weight:400]
                  [&>svg]:fill-transparent [&>svg]:stroke-current [&>svg]:stroke-2 [&>svg]:text-teal-600 dark:[&>svg]:text-teal-400
                  hover:[&>i]:text-teal-700 dark:hover:[&>i]:text-teal-300 hover:[&>svg]:text-teal-700 dark:hover:[&>svg]:text-teal-300"
              title={strings.copyOib}
              onNoText={() => setError(strings.noOibToCopy)}
              onCopyError={(message) => setError(message)}
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-1 text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-600/40 rounded-md px-2 py-1.5 leading-snug"
          >
            {error}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={generateOib}
        className="w-full py-3.5 px-5 rounded-xl bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-600
        dark:bg-teal-600 dark:hover:bg-teal-500 dark:active:bg-teal-500 dark:text-slate-100/90
        font-semibold shadow-sm shadow-teal-500/20 transition-colors flex items-center justify-center gap-2
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
        focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
      >
        <i className="fas fa-dice -rotate-12 opacity-90"></i>
        <span className="tracking-wide">{strings.generateOib}</span>
      </button>
    </div>
  );
};

export default OibGenerator;
