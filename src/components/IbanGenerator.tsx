'use client';

import React, { useState, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';
import CopyButton from './CopyButton';
import { generateRandomDigits, calculateIBANCheckDigits } from '@/utils/generators';
import { useLocale } from '@/utils/locale';

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

    const accountNumber = generateRandomDigits(10);
    const countryCode = 'HR';
    const bbban = currentVbdi + accountNumber;
    const checkDigits = calculateIBANCheckDigits(countryCode + '00' + bbban);
    const iban = countryCode + checkDigits + bbban;
    setGeneratedIban(iban);
  };

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

  return (
    // Container now inherits background from parent card
    <div className="space-y-6">
      {/* Bank Selection & Random Switch */}
      <div className="space-y-2">
        <label className="flex items-center font-semibold text-gray-800 dark:text-gray-200">
          <i className="fas fa-university mr-2 text-gray-600 dark:text-gray-400"></i>
          {strings.selectBankLabel}
        </label>
        <div className="flex items-center gap-4">
          {/* Dropdown (visually disabled when random is ON) */}
          <div
            className={`flex-1 ${isRandomSelected
              ? 'pointer-events-none cursor-not-allowed rounded-md bg-gray-100 dark:bg-slate-700/40 ring-1 ring-inset ring-gray-300/60 dark:ring-slate-600/60'
              : ''}`}
            aria-disabled={isRandomSelected}
          >
            <CustomDropdown
              options={bankData}
              value={selectedBankKey}
              onChange={handleBankChange}
              renderDisplay={(key) => (
                <span
                  className={
                    key
                      ? 'text-gray-900 dark:text-gray-100'
                      : isRandomSelected
                        ? 'text-gray-500 dark:text-slate-500'
                        : 'text-gray-500 dark:text-slate-400'
                  }
                >
                  {key ? `${bankData[key]?.name} (${bankData[key]?.vbdi})` : strings.selectBankPlaceholder}
                </span>
              )}
              renderOption={(key, option) => (
                <div className="flex justify-between cursor-pointer">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{option.name}</span>
                  <span className="text-gray-600 dark:text-slate-400">{option.vbdi}</span>
                </div>
              )}
            />
          </div>

          {/* Material switch for Random Bank */}
          <div className="flex items-center">
            <span className="mr-3 font-medium text-gray-700 dark:text-gray-300">{strings.randomBank}</span>
            <label htmlFor="random-iban" className="relative inline-flex items-center cursor-pointer select-none">
              <input
                id="random-iban"
                type="checkbox"
                checked={isRandomSelected}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setIsRandomSelected(isChecked);
                  if (isChecked) {
                    setSelectedBankKey('');
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 rounded-full transition-colors
                  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-700
                  peer-focus:ring-offset-2 peer-focus:ring-offset-white dark:peer-focus:ring-offset-gray-900
                  peer-checked:bg-teal-500 shadow-inner dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"></div>
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white dark:bg-slate-200 rounded-full
                  border border-gray-300 dark:border-slate-400 transform transition-transform peer-checked:translate-x-5
                  shadow-sm dark:shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.5)]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Generated IBAN Display */}
      <div className="space-y-2">
        <label className="flex items-center font-semibold text-gray-800 dark:text-gray-200">
          <i className="fas fa-file-invoice-dollar mr-2 text-gray-600 dark:text-gray-400"></i>
          {strings.generatedIbanLabel}
        </label>

        {/* teal-tinted pill with embedded copy */}
        <div className="relative rounded-xl border border-teal-200 dark:border-slate-700 ring-1 ring-inset ring-teal-100 dark:ring-slate-700/60 bg-teal-50 dark:bg-slate-800
          dark:shadow-[0_2px_4px_-1px_rgba(0,0,0,0.65),0_1px_2px_rgba(0,0,0,0.45)]">
          <div className="pl-4 pr-12 py-3 text-3xl text-left font-mono tracking-wide text-gray-900 dark:text-slate-100">
            {generatedIban ? (
              <>
                <span className="font-mono text-amber-700 dark:text-amber-300 font-semibold">
                  {generatedIban.substring(0, 4)}
                </span>
                <span className="font-mono text-cyan-800 dark:text-cyan-300 font-semibold">
                  {generatedIban.substring(4, 11)}
                </span>
                <span className="font-mono text-fuchsia-700 dark:text-fuchsia-300 font-semibold">
                  {generatedIban.substring(11, 21)}
                </span>
              </>
            ) : (
              '\u00a0'
            )}
          </div>

          {/* Embedded copy button (ghost by default, darker hollow icon) */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <CopyButton
              textToCopy={generatedIban}
              className="w-10 h-10 rounded-md cursor-pointer bg-transparent border-0 shadow-none
                hover:bg-teal-100 dark:hover:bg-slate-700/60
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
                focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900
                [&>i]:text-teal-600 dark:[&>i]:text-teal-400 [&>i]:[font-weight:400]
                [&>svg]:fill-transparent [&>svg]:stroke-current [&>svg]:stroke-2 [&>svg]:text-teal-600 dark:[&>svg]:text-teal-400
                hover:[&>i]:text-teal-700 dark:hover:[&>i]:text-teal-300 hover:[&>svg]:text-teal-700 dark:hover:[&>svg]:text-teal-300"
              title={strings.copyIban}
              onNoText={() => setError(strings.noIbanToCopy)}
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
        onClick={() => generateAndSetIban()}
        className="w-full py-3.5 px-5 rounded-xl bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-600
        dark:bg-teal-600 dark:hover:bg-teal-500 dark:active:bg-teal-500 dark:text-slate-100/90
        font-semibold shadow-sm shadow-teal-500/20 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_14px_-4px_rgba(0,0,0,0.7)]
        transition-colors flex items-center justify-center gap-2
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
        focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
      >
        <i className="fas fa-wand-magic-sparkles -rotate-12 opacity-90"></i>
        <span className="tracking-wide">{strings.generateIban}</span>
      </button>
    </div>
  );
};

export default IbanGenerator;