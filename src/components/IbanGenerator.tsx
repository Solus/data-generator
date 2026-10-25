'use client';

import React, { useState, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';
import CopyButton from './CopyButton';
import Dimensioned from './Dimensioned';
import PrimaryButton from './PrimaryButton';
import Switch from './Switch';
import { generateAccountNumber, calculateIBANCheckDigits } from '@/utils/generators';
import { useLocale } from '@/utils/locale';
import { useGenerateShortcut } from '@/utils/useGenerateShortcut';

interface Bank {
  name: string;
  vbdi: string;
}

const bankData: Record<string, Bank> = {
  zaba: { name: 'Zagrebačka banka', vbdi: '2360000' },
  pbz: { name: 'Privredna banka Zagreb', vbdi: '2340009' },
  erste: { name: 'Erste & Steiermärkische Bank', vbdi: '2402006' },
  otp: { name: 'OTP banka', vbdi: '2407000' },
  rba: { name: 'Raiffeisenbank Hrvatska', vbdi: '2484008' },
};

const IbanGenerator: React.FC = () => {
  const [selectedBankKey, setSelectedBankKey] = useState<string>('');
  const [generatedIban, setGeneratedIban] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRandomSelected, setIsRandomSelected] = useState<boolean>(true);
  const { strings } = useLocale();

  const generateAndSetIban = (overrideBankKey?: string) => {
    setError(null);

    let bankKeyForGeneration = overrideBankKey || selectedBankKey;

    // This part handles the "random" case, which should only trigger
    // when the function is called without a specific key (e.g., from the button or on initial load)
    if (!overrideBankKey && isRandomSelected) {
      const bankKeys = Object.keys(bankData);
      const randomKey = bankKeys[Math.floor(Math.random() * bankKeys.length)];
      bankKeyForGeneration = randomKey;
      // Also update the dropdown to show which bank was randomly selected.
      setSelectedBankKey(randomKey);
    }

    if (!bankKeyForGeneration || !bankData[bankKeyForGeneration]) {
      setError(strings.selectBankOrRandom);
      setGeneratedIban('');
      return;
    }

    const selectedBank = bankData[bankKeyForGeneration];
    const currentVbdi = selectedBank.vbdi;

    const accountNumber = generateAccountNumber();
    const countryCode = 'HR';
    const bbban = currentVbdi + accountNumber;
    const checkDigits = calculateIBANCheckDigits(countryCode + '00' + bbban);
    const iban = countryCode + checkDigits + bbban;
    setGeneratedIban(iban);
  };

  useGenerateShortcut(() => generateAndSetIban());

  // Effect to generate IBAN on initial load only.
  useEffect(() => {
    generateAndSetIban();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleBankChange = (key: string) => {
    setSelectedBankKey(key);
    setIsRandomSelected(false); // Uncheck random when a bank is selected manually
    generateAndSetIban(key);
  };

  // HR + 2 check digits | 7-digit bank code | 10-digit account number
  const segments = [
    { text: generatedIban.substring(0, 4), color: 'text-accent', swatch: 'bg-accent', dim: strings.ibanDimCheck, legend: strings.ibanLegendCheck },
    { text: generatedIban.substring(4, 11), color: 'text-accent-2', swatch: 'bg-accent-2', dim: strings.ibanDimBank, legend: strings.ibanLegendBank },
    { text: generatedIban.substring(11, 21), color: 'text-ink', swatch: 'bg-ink', dim: strings.ibanDimAccount, legend: strings.ibanLegendAccount },
  ];

  return (
    <div className="mt-7">
      <section aria-labelledby="iban-result-label" className="border-y border-b-line border-t-rule pb-5 pt-5 sm:pb-6">
        <div className="mb-3 flex items-center justify-between sm:mb-5">
          <h2 id="iban-result-label" className="eyebrow">{strings.ibanResultLabel}</h2>
          <CopyButton
            textToCopy={generatedIban}
            title={strings.copyIban}
            onNoText={() => setError(strings.noIbanToCopy)}
            onCopyError={(message) => setError(message)}
          />
        </div>

        {/* Screen readers get the whole number once; the segmented drawing below is visual only. */}
        <p className="sr-only" aria-live="polite">{generatedIban}</p>
        <div
          aria-hidden="true"
          className="figure flex min-h-[1em] gap-[0.5em] whitespace-nowrap font-mono font-medium leading-none tracking-[-0.01em]"
          style={{ '--figure-units': 13.8 } as React.CSSProperties}
        >
          {generatedIban
            ? segments.map((s) => (
                <Dimensioned key={s.dim} label={s.dim} className={s.color}>
                  {s.text}
                </Dimensioned>
              ))
            : ' '}
        </div>

        {/* On phones the dimension lines don't fit, so the same information is a short legend. */}
        <ul className="mt-4 text-[13px] sm:hidden">
          {segments.map((s) => (
            <li key={s.dim} className="flex h-7 items-center gap-2.5">
              <span aria-hidden="true" className={`h-2.5 w-2.5 ${s.swatch}`} />
              <span className="flex-1 text-ink-soft">{s.legend}</span>
              <span className="font-mono text-xs text-muted">{s.text.length}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-9">
        <div className="flex flex-col gap-2 sm:w-[380px]">
          <span id="bank-label" className="text-sm font-medium text-ink-soft">{strings.bankLabel}</span>
          <CustomDropdown
            options={bankData}
            value={selectedBankKey}
            onChange={handleBankChange}
            disabled={isRandomSelected}
            labelledBy="bank-label"
            renderDisplay={(key) =>
              key ? (
                <span className="flex flex-1 items-center justify-between gap-3">
                  {bankData[key]?.name}
                  <span className="font-mono text-[13px] text-muted">{bankData[key]?.vbdi}</span>
                </span>
              ) : (
                <span className="text-muted">{strings.selectBankPlaceholder}</span>
              )
            }
            renderOption={(key, option) => (
              <div className="flex justify-between gap-3">
                <span>{option.name}</span>
                <span className="font-mono text-[13px] text-muted">{option.vbdi}</span>
              </div>
            )}
          />
        </div>

        <Switch
          id="random-iban"
          checked={isRandomSelected}
          onChange={(isChecked) => {
            setIsRandomSelected(isChecked);
            if (isChecked) {
              setSelectedBankKey('');
            }
          }}
          label={strings.randomBank}
        />

        <PrimaryButton className="sm:ml-auto" onClick={() => generateAndSetIban()}>
          {strings.generateIban}
        </PrimaryButton>
      </div>

      {error && (
        <p role="alert" className="mt-4 border-l-2 border-accent bg-paper px-3 py-2 text-sm text-ink">
          {error}
        </p>
      )}
    </div>
  );
};

export default IbanGenerator;
