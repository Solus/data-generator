'use client';

import React, { useState, useEffect } from 'react';
import { generateRandomDigits, calculateOIBCheckDigit } from '@/utils/generators';
import CopyButton from './CopyButton';
import Dimensioned from './Dimensioned';
import PrimaryButton from './PrimaryButton';
import SpecTable from './SpecTable';
import { useLocale } from '@/utils/locale';
import { useGenerateShortcut } from '@/utils/useGenerateShortcut';

const OIB_LENGTH = 11;

const OibGenerator: React.FC = () => {
  const [generatedOib, setGeneratedOib] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { strings } = useLocale();

  const generateOib = () => {
    setError(null);
    const firstTenDigits = generateRandomDigits(10);
    const checkDigit = calculateOIBCheckDigit(firstTenDigits);
    setGeneratedOib(firstTenDigits + checkDigit);
  };

  useGenerateShortcut(generateOib);

  // Generate after mount: a random value during render differs between server and browser (hydration mismatch).
  useEffect(() => {
    generateOib();
  }, []);

  const specs: [string, string][] = [
    [strings.specLength, strings.digitsCount(OIB_LENGTH)],
    [strings.specAlgorithm, 'ISO 7064, MOD 11,10'],
  ];

  return (
    <div className="mt-7">
      <section aria-labelledby="oib-result-label" className="border-y border-b-line border-t-rule pb-5 pt-5 sm:pb-6">
        <div className="mb-3 flex items-center justify-between sm:mb-5">
          <h2 id="oib-result-label" className="eyebrow">{strings.oibResultLabel}</h2>
          <CopyButton
            textToCopy={generatedOib}
            title={strings.copyOib}
            onNoText={() => setError(strings.noOibToCopy)}
            onCopyError={(message) => setError(message)}
          />
        </div>

        {/* One plain number: unlike the IBAN, an OIB has no meaningful parts to pick out. */}
        <div
          className="figure inline-block whitespace-nowrap font-mono font-medium leading-none tracking-[-0.01em]"
          style={{ '--figure-units': 7.2 } as React.CSSProperties}
        >
          <Dimensioned label={strings.digitsCount(OIB_LENGTH)} className="min-h-[1em]">
            <span aria-live="polite">{generatedOib || ' '}</span>
          </Dimensioned>
        </div>
      </section>

      <div className="mt-7">
        <PrimaryButton onClick={generateOib}>{strings.generateOib}</PrimaryButton>
      </div>

      {error && (
        <p role="alert" className="mt-4 border-l-2 border-accent bg-paper px-3 py-2 text-sm text-ink">
          {error}
        </p>
      )}

      <SpecTable rows={specs} />
    </div>
  );
};

export default OibGenerator;
