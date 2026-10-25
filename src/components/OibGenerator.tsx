'use client';

import React, { useState, useEffect } from 'react';
import { generateRandomDigits, calculateOIBCheckDigit } from '@/utils/generators';
import ActionBar from './ActionBar';
import CopyButton from './CopyButton';
import Dimensioned from './Dimensioned';
import PrimaryButton from './PrimaryButton';
import SpecTable from './SpecTable';
import { useLocale } from '@/utils/locale';
import { useCopyFeedback } from '@/utils/useCopyFeedback';
import { useCopyShortcut, useGenerateShortcut } from '@/utils/useGenerateShortcut';

const OIB_LENGTH = 11;

const OibGenerator: React.FC = () => {
  const [generatedOib, setGeneratedOib] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { strings } = useLocale();
  const { status: copyStatus, copy } = useCopyFeedback();

  const generateOib = () => {
    setError(null);
    const firstTenDigits = generateRandomDigits(10);
    const checkDigit = calculateOIBCheckDigit(firstTenDigits);
    setGeneratedOib(firstTenDigits + checkDigit);
  };

  const handleCopy = async () => {
    if (!generatedOib) {
      setError(strings.noOibToCopy);
      return;
    }
    setError(null);
    if (!(await copy(generatedOib))) setError(strings.copyFailed);
  };

  useGenerateShortcut(generateOib);
  useCopyShortcut(handleCopy);

  // Generate after mount: a random value during render differs between server and browser (hydration mismatch).
  useEffect(() => {
    generateOib();
  }, []);

  const specs: [string, string][] = [
    [strings.specLength, strings.digitsCount(OIB_LENGTH)],
    [strings.specAlgorithm, 'ISO 7064, MOD 11,10'],
  ];

  return (
    <div>
      <ActionBar>
        <CopyButton status={copyStatus} onClick={handleCopy} title={strings.copyOib} />
        <PrimaryButton onClick={generateOib}>{strings.generateOib}</PrimaryButton>
      </ActionBar>

      {error && (
        <p role="alert" className="mt-4 border-l-2 border-accent bg-paper px-3 py-2 text-sm text-ink">
          {error}
        </p>
      )}

      <section aria-labelledby="oib-result-label" className="mt-7 border-y border-b-line border-t-rule pb-6 pt-4 sm:pb-7">
        <div className="mb-3 flex items-center justify-between sm:mb-5">
          <h2 id="oib-result-label" className="eyebrow">{strings.oibResultLabel}</h2>
          <span className="hidden text-[13px] text-muted sm:block">{strings.clickToCopy}</span>
        </div>

        {/* One plain number: unlike the IBAN, an OIB has no meaningful parts to pick out. */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`${strings.copyOib}: ${generatedOib}`}
          className="figure inline-block min-h-[1em] whitespace-nowrap text-left font-mono font-medium leading-none tracking-[-0.02em]"
          style={{ '--figure-units': 7.2, '--figure-max': '6.5rem' } as React.CSSProperties}
        >
          <Dimensioned label={strings.digitsCount(OIB_LENGTH)}>{generatedOib || ' '}</Dimensioned>
        </button>
        <p className="sr-only" aria-live="polite">{generatedOib}</p>
      </section>

      <SpecTable rows={specs} />
    </div>
  );
};

export default OibGenerator;
