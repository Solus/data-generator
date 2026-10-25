'use client';

import React, { useState, useEffect } from 'react';
import ActionBar from './ActionBar';
import CopyButton from './CopyButton';
import CustomDropdown from './CustomDropdown';
import Dimensioned from './Dimensioned';
import PrimaryButton from './PrimaryButton';
import SpecTable from './SpecTable';
import Switch from './Switch';
import { generateAccountNumber, calculateIBANCheckDigits } from '@/utils/generators';
import { useLocale } from '@/utils/locale';
import { useCopyFeedback } from '@/utils/useCopyFeedback';
import { useCopyShortcut, useGenerateShortcut } from '@/utils/useGenerateShortcut';

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
  const { status: copyStatus, copy } = useCopyFeedback();

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

  const handleCopy = async () => {
    if (!generatedIban) {
      setError(strings.noIbanToCopy);
      return;
    }
    setError(null);
    if (!(await copy(generatedIban))) setError(strings.copyFailed);
  };

  useGenerateShortcut(() => generateAndSetIban());
  useCopyShortcut(handleCopy);

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

  // HR + 2 check digits | 7-digit bank code | 10-digit account number. The bank code segment also
  // names the bank, so the IBAN always shows which bank it belongs to (picked or random).
  const bankCode = generatedIban.substring(4, 11);
  const bankName = Object.values(bankData).find((b) => b.vbdi === bankCode)?.name;
  const segments = [
    { text: generatedIban.substring(0, 4), color: 'text-accent', swatch: 'bg-accent', dim: strings.ibanDimCheck, legend: strings.ibanLegendCheck },
    { text: bankCode, color: 'text-accent-2', swatch: 'bg-accent-2', dim: strings.ibanDimBank, sub: bankName, legend: bankName ? `${strings.ibanLegendBank} · ${bankName}` : strings.ibanLegendBank },
    { text: generatedIban.substring(11, 21), color: 'text-ink', swatch: 'bg-ink', dim: strings.ibanDimAccount, legend: strings.ibanLegendAccount },
  ];

  return (
    <div>
      <ActionBar
        options={
          <>
            <div className="flex flex-col gap-1.5 sm:w-[360px]">
              <span id="bank-label" className="text-[13px] font-medium text-ink-soft">{strings.bankLabel}</span>
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
          </>
        }
      >
        <CopyButton status={copyStatus} onClick={handleCopy} title={strings.copyIban} />
        <PrimaryButton onClick={() => generateAndSetIban()}>{strings.generateIban}</PrimaryButton>
      </ActionBar>

      {error && (
        <p role="alert" className="mt-4 border-l-2 border-accent bg-paper px-3 py-2 text-sm text-ink">
          {error}
        </p>
      )}

      <section aria-labelledby="iban-result-label" className="mt-7 border-y border-b-line border-t-rule pb-5 pt-4 sm:pb-6">
        <div className="mb-3 flex items-center justify-between sm:mb-5">
          <h2 id="iban-result-label" className="eyebrow">{strings.ibanResultLabel}</h2>
          <span className="hidden text-[13px] text-muted sm:block">{strings.clickToCopy}</span>
        </div>

        {/* Screen readers get the whole number once; the segmented drawing is visual only. */}
        <p className="sr-only" aria-live="polite">{generatedIban}</p>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`${strings.copyIban}: ${generatedIban}`}
          className="figure flex min-h-[1em] cursor-copy gap-[0.5em] whitespace-nowrap text-left font-mono font-medium leading-none tracking-[-0.01em]"
          style={{ '--figure-units': 13.8, '--figure-max': '4.25rem' } as React.CSSProperties}
        >
          {generatedIban
            ? segments.map((s) => (
                <Dimensioned key={s.dim} label={s.dim} sublabel={s.sub} className={s.color}>
                  {s.text}
                </Dimensioned>
              ))
            : ' '}
        </button>

        {/* On phones the dimension lines don't fit, so the same information is a short legend. */}
        <ul className="mt-4 text-[13px] sm:hidden">
          {segments.map((s) => (
            <li key={s.dim} className="flex min-h-7 items-center gap-2.5 py-0.5">
              <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 ${s.swatch}`} />
              <span className="flex-1 text-ink-soft">{s.legend}</span>
              <span className="font-mono text-xs text-muted">{s.text.length}</span>
            </li>
          ))}
        </ul>
      </section>

      <SpecTable
        rows={[
          [strings.specLength, strings.charsCount(21)],
          [strings.specAlgorithm, 'ISO 13616, MOD 97-10'],
          [strings.specAccountCheck, 'ISO 7064, MOD 11,10'],
        ]}
      />
    </div>
  );
};

export default IbanGenerator;
