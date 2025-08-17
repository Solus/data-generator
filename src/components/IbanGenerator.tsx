'use client';

import React, { useState, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';
import CopyButton from './CopyButton';
import { generateRandomDigits, calculateIBANCheckDigits } from '@/utils/generators';

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

import { useLocale } from '@/utils/locale';

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
    <div className="space-y-6">
      {/* Bank Selection & Random Checkbox */}
      <div className="flex flex-col space-y-2">
        <label className="flex items-center font-bold">
          <i className="fas fa-university mr-2"></i> {strings.selectBankLabel}
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
    <CustomDropdown
              options={bankData}
              value={selectedBankKey}
              onChange={handleBankChange} // Use the new handler here
              renderDisplay={(key) => (
                <span className={key ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}>
      {key ? `${bankData[key]?.name} (${bankData[key]?.vbdi})` : strings.selectBankPlaceholder}
                </span>
              )}
              renderOption={(key, option) => (
                <div className="flex justify-between cursor-pointer">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{option.name}</span>
                  <span className="text-gray-600 dark:text-gray-400">{option.vbdi}</span>
                </div> 
              )}
            />
          </div>
          <div className="flex items-center">
            <input
              id="random-iban"
              type="checkbox"
              checked={isRandomSelected}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setIsRandomSelected(isChecked);
                if (isChecked) {
                  // When checking "Random", clear the specific bank selection.
                  // The next "Generate" click will pick a random one.
                  setSelectedBankKey('');
                }
              }}
              className="h-4 w-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="random-iban" className="ml-2 font-bold text-gray-700 dark:text-gray-300 cursor-pointer">{strings.randomBank}</label>
          </div>
        </div>
      </div>

      {/* Generated IBAN Display */}
      <div className="flex flex-col space-y-2">
        <label className="flex items-center font-bold">
          <i className="fas fa-file-invoice-with-watermark mr-2"></i> {strings.generatedIbanLabel}
        </label>
        <div className="flex items-center space-x-2">
          <span className="flex-1 p-4 text-2xl text-center font-mono rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
            {generatedIban ? (
              <>
                <span className="text-blue-600 dark:text-blue-400">{generatedIban.substring(0, 2)}</span>
                <span className="text-red-600 dark:text-red-400">{generatedIban.substring(2, 4)}</span>
                <span className="text-green-600 dark:text-green-400">{generatedIban.substring(4, 11)}</span>
                <span className="text-purple-600 dark:text-purple-400">{generatedIban.substring(11, 21)}</span>
              </>
            ) : (
              '\u00a0'
            )}
          </span>
          <CopyButton
            textToCopy={generatedIban}
            className="w-12 h-12 rounded-full cursor-pointer"
            title={strings.copyIban}
            onNoText={() => setError(strings.noIbanToCopy)}
            onCopyError={(message) => setError(message)}
          />
        </div>
        {error && <div className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</div>}
      </div>
      
      {/* Generate Button */}
      <button
        onClick={() => generateAndSetIban()}
        className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
      >
        <i className="fas fa-key mr-2"></i> {strings.generateIban}
      </button>
    </div>
  );
};

export default IbanGenerator;
