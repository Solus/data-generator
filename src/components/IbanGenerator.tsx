'use client';

import React, { useState, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';

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

const calculateIBANCheckDigits = (ibanWithoutCheckDigits: string): string => {
  const rearranged = ibanWithoutCheckDigits.substring(4) + ibanWithoutCheckDigits.substring(0, 4);
  let numericString = '';
  for (let i = 0; i < rearranged.length; i++) {
    const char = rearranged[i];
    if (char >= 'A' && char <= 'Z') {
      numericString += (char.charCodeAt(0) - 55).toString();
    } else {
      numericString += char;
    }
  }

  let remainder = 0;
  for (let i = 0; i < numericString.length; i += 9) {
    const chunk = numericString.substring(i, i + 9);
    remainder = parseInt(String(remainder) + chunk, 10) % 97;
  }

  const checkDigitValue = 98 - remainder;
  return (checkDigitValue < 10 ? '0' : '') + checkDigitValue.toString();
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

const IbanGenerator: React.FC = () => {
  const [selectedBankKey, setSelectedBankKey] = useState<string>('');
  const [generatedIban, setGeneratedIban] = useState<string>('');
  const [vbdi, setVbdi] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [isRandomSelected, setIsRandomSelected] = useState<boolean>(true);

  // Effect to generate IBAN on initial load
  useEffect(() => {
    generateIban();
  }, []);

  // Effect to generate IBAN when selectedBankKey changes
  useEffect(() => {
    // Only generate if a specific bank is selected
    if (selectedBankKey) {
      generateIban();
    }
  }, [selectedBankKey]);

  const generateIban = () => {
    setError(null);
    setCopyFeedback('idle');

    let currentVbdi = '';
    let currentSelectedBankKey = selectedBankKey;

    if (isRandomSelected) {
      const bankKeys = Object.keys(bankData);
      const randomKey = bankKeys[Math.floor(Math.random() * bankKeys.length)];
      currentSelectedBankKey = randomKey;
      setSelectedBankKey(randomKey);
    }

    if (!currentSelectedBankKey || !bankData[currentSelectedBankKey]) {
      setError('Please select a bank or check the random option.');
      return;
    }

    const selectedBank = bankData[currentSelectedBankKey];
    currentVbdi = selectedBank.vbdi;
    
    setVbdi(currentVbdi);

    const accountNumber = generateRandomDigits(10);
    const countryCode = 'HR';
    const bbban = currentVbdi + accountNumber;
    const checkDigits = calculateIBANCheckDigits(countryCode + '00' + bbban);
    const iban = countryCode + checkDigits + bbban;
    setGeneratedIban(iban);
  };

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!generatedIban) {
      setError('No IBAN to copy. Please generate one first.');
      return;
    }
    const success = await copyToClipboard(generatedIban, e.currentTarget);
    if (success) {
      setCopyFeedback('success');
      setTimeout(() => setCopyFeedback('idle'), 1000);
    } else {
      setCopyFeedback('error');
      setError('Failed to copy IBAN. Please copy manually.');
    }
  };

  const handleBankChange = (key: string) => {
    setSelectedBankKey(key);
    setIsRandomSelected(false); // Uncheck random when a bank is selected manually
  };

  return (
    <div className="space-y-6">
      {/* Bank Selection & Random Checkbox */}
      <div className="flex flex-col space-y-2">
        <label className="flex items-center font-bold">
          <i className="fas fa-university mr-2"></i> Select Bank:
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <CustomDropdown
              options={bankData}
              value={selectedBankKey}
              onChange={handleBankChange} // Use the new handler here
              renderDisplay={(key) => (
                <span className={key ? 'text-gray-900' : 'text-gray-500'}>
                  {key ? `${bankData[key]?.name} (${bankData[key]?.vbdi})` : '-- Select a Bank --'}
                </span>
              )}
              renderOption={(key, option) => (
                <div className="flex justify-between">
                  <span className="font-medium">{option.name}</span>
                  <span className="text-gray-500">{option.vbdi}</span>
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
                setIsRandomSelected(e.target.checked);
                if (e.target.checked) {
                  setSelectedBankKey('');
                }
              }}
              className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="random-iban" className="ml-2 font-bold text-gray-700">Random</label>
          </div>
        </div>
      </div>

      {/* Generated IBAN Display */}
      <div className="flex flex-col space-y-2">
        <label className="flex items-center font-bold">
          <i className="fas fa-file-invoice-with-watermark mr-2"></i> Generated IBAN:
        </label>
        <div className="flex items-center space-x-2">
          <span className="flex-1 p-4 text-2xl text-center font-mono rounded-lg bg-gray-100 border border-gray-300">
            {generatedIban ? (
              <>
                <span className="text-blue-600">{generatedIban.substring(0, 2)}</span>
                <span className="text-red-600">{generatedIban.substring(2, 4)}</span>
                <span className="text-green-600">{generatedIban.substring(4, 11)}</span>
                <span className="text-purple-600">{generatedIban.substring(11, 21)}</span>
              </>
            ) : (
              '\u00a0'
            )}
          </span>
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center w-12 h-12 rounded-full text-white transition-colors
              ${copyFeedback === 'success' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}
            `}
            title="Copy IBAN"
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
        onClick={generateIban}
        className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        <i className="fas fa-key mr-2"></i> Generate IBAN
      </button>
    </div>
  );
};

export default IbanGenerator;
