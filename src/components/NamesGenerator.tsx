'use client';

import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '@/utils/clipboard';
import { generateLocalNames } from '@/utils/names';
import { useLocale } from '@/utils/locale';
import { useGenerateShortcut } from '@/utils/useGenerateShortcut';
import PrimaryButton from './PrimaryButton';
import { pad } from './PageIntro';
import { CheckIcon, CloseIcon, CopyIcon } from './icons';

interface Name {
  firstName: string;
  lastName: string;
}

const outlineButton =
  'inline-flex h-11 items-center gap-2 rounded-[2px] border border-ink px-3.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-on-ink sm:h-10';

const NamesGenerator: React.FC = () => {
  // null while the field is empty, so the user can clear it and type a new number (restored to 10 on blur).
  const [numNames, setNumNames] = useState<number | null>(10);
  const count = numNames ?? 10;
  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null); // key of the item that was just copied

  const { strings } = useLocale();

  // Show a ready-to-use list on load (built-in list: instant, no AI call). Done after mount to avoid a hydration mismatch.
  useEffect(() => {
    setNames(generateLocalNames(10));
  }, []);

  const handleCopy = async (text: string, key: string) => {
    const success = await copyToClipboard(text);
    if (!success) {
      setError(strings.copyFailed);
    } else {
      setError(null);
      setCopied(key);
      setTimeout(() => setCopied(current => (current === key ? null : current)), 1500);
    }
  };

  const incrementNum = () => setNumNames(n => Math.min(50, (n ?? 0) + 1));
  const decrementNum = () => setNumNames(n => Math.max(1, (n ?? 2) - 1));
  const onNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (digits === '') {
      setNumNames(null);
      return;
    }
    setNumNames(Math.min(50, Math.max(1, parseInt(digits, 10))));
  };

  const generateNames = async () => {
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numNames: count }),
      });

      const result = await response.json();

      if (!response.ok) {
        // If our API returns an error, it will be in result.error
        throw new Error(result.error || 'Failed to generate names.');
      }

      const text: string | undefined = result.candidates?.[0]?.content?.parts?.[0]?.text;
      const newNames: Name[] = (text ?? '')
        .split('\n')
        .filter((line: string) => line.includes(','))
        .map((line: string) => {
          const parts = line.split(',');
          return { firstName: parts[0].trim(), lastName: parts[1].trim() };
        })
        .filter((n: Name) => n.firstName && n.lastName)
        .slice(0, count); // the model sometimes returns more than requested

      if (newNames.length === 0) throw new Error(strings.noNamesGenerated);
      setNames(newNames);
    } catch (e: unknown) {
      // AI unavailable or returned nothing usable: use the built-in list instead.
      console.error(e);
      setNames(generateLocalNames(count));
      setNotice(strings.usedBuiltInNames);
    } finally {
      setLoading(false);
    }
  };

  useGenerateShortcut(() => {
    if (!loading) generateNames();
  });

  const stepButton = 'flex h-12 w-11 items-center justify-center text-xl text-ink hover:bg-paper sm:w-[46px]';

  return (
    <div className="mt-7">
      {/* Count + generate + bulk copy */}
      <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-7">
        <div className="flex flex-col gap-2">
          <span id="count-label" className="text-sm font-medium text-ink-soft">{strings.countLabel}</span>
          <div role="group" aria-labelledby="count-label" className="flex h-12 w-fit rounded-[2px] border border-control">
            <button type="button" onClick={decrementNum} aria-label={strings.decrease} className={`${stepButton} border-r border-control`}>−</button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={numNames ?? ''}
              onChange={onNumChange}
              onBlur={() => setNumNames(n => n ?? 10)}
              aria-labelledby="count-label"
              className="w-16 bg-transparent text-center font-mono text-base text-ink focus:outline-none"
            />
            <button type="button" onClick={incrementNum} aria-label={strings.increase} className={`${stepButton} border-l border-control`}>+</button>
          </div>
        </div>

        <PrimaryButton onClick={generateNames} disabled={loading} aria-busy={loading} title={strings.aiTitle}>
          {strings.generateNames}
        </PrimaryButton>

        {names.length > 0 && !loading && (
          <div className="flex flex-wrap gap-2.5 sm:ml-auto">
            {([
              ['all', strings.copyAll, names.map(n => `${n.firstName} ${n.lastName}`).join('\n')],
              ['csv', strings.copyAllCsv, names.map(n => `${n.firstName},${n.lastName}`).join('\n')],
            ] as const).map(([key, label, text]) => (
              <button key={key} type="button" onClick={() => handleCopy(text, key)} className={outlineButton}>
                {copied === key ? <CheckIcon width={15} height={15} /> : <CopyIcon width={15} height={15} />}
                {copied === key ? strings.copied : label}
              </button>
            ))}
          </div>
        )}
      </div>

      {notice && !loading && (
        <p role="status" className="mt-5 flex items-start gap-2 border-l-2 border-accent-2 bg-paper py-2 pl-3 pr-1 text-sm text-ink">
          <span className="flex-1 py-1">{notice}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label={strings.dismiss} title={strings.dismiss} className="flex h-8 w-8 shrink-0 items-center justify-center text-muted hover:text-ink">
            <CloseIcon width={16} height={16} />
          </button>
        </p>
      )}

      {error && (
        <p role="alert" className="mt-5 border-l-2 border-accent bg-paper px-3 py-2 text-sm text-ink">
          {error}
        </p>
      )}

      {/* Announces copy confirmations to screen readers. */}
      <span role="status" className="sr-only">{copied ? strings.copied : ''}</span>

      {loading ? (
        <div role="status" className="mt-8 border-t border-t-rule">
          <p className="eyebrow py-3">{strings.generating}</p>
          {[0, 1, 2, 3].map(i => (
            <div key={i} aria-hidden="true" className="flex h-[46px] items-center border-t border-line">
              <span className="h-4 w-2/5 animate-pulse bg-line" />
            </div>
          ))}
        </div>
      ) : (
        names.length > 0 && (
          <table className="mt-8 w-full border-t border-t-rule text-left">
            <thead>
              <tr className="eyebrow h-9 border-b border-line text-[11px]">
                <th scope="col" className="w-10 font-medium sm:w-14">{strings.numberHeader}</th>
                <th scope="col" className="font-medium">{strings.firstNameHeader}</th>
                <th scope="col" className="font-medium">{strings.lastNameHeader}</th>
                <th scope="col" className="sr-only">{strings.actions}</th>
              </tr>
            </thead>
            <tbody>
              {names.map((name, index) => {
                const full = `${name.firstName} ${name.lastName}`;
                const reversed = `${name.lastName} ${name.firstName}`;
                const cell = (value: string, key: string) => (
                  <button
                    type="button"
                    onClick={() => handleCopy(value, key)}
                    title={strings.copyText(value)}
                    className="group inline-flex min-h-[46px] items-center gap-1.5 text-left text-[15px] hover:text-accent-2 sm:text-[17px]"
                  >
                    {value}
                    {copied === key && <CheckIcon width={14} height={14} className="text-accent-2" />}
                  </button>
                );
                return (
                  <tr key={index} className="border-b border-line">
                    <td className="font-mono text-xs text-muted">{pad(index + 1)}</td>
                    <td>{cell(name.firstName, `${index}-first`)}</td>
                    <td>{cell(name.lastName, `${index}-last`)}</td>
                    <td className="whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => handleCopy(full, `${index}-full`)}
                        aria-label={strings.copyText(full)}
                        title={strings.copyText(full)}
                        className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 text-sm font-medium text-accent-2 hover:underline"
                      >
                        {copied === `${index}-full` ? <CheckIcon width={15} height={15} /> : <CopyIcon width={15} height={15} />}
                        <span className="hidden sm:inline">{copied === `${index}-full` ? strings.copied : strings.copy}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(reversed, `${index}-rev`)}
                        aria-label={strings.copyText(reversed)}
                        title={strings.copyText(reversed)}
                        className="hidden h-11 w-11 items-center justify-center text-muted hover:text-ink sm:inline-flex"
                      >
                        {copied === `${index}-rev` ? (
                          <CheckIcon width={15} height={15} />
                        ) : (
                          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default NamesGenerator;
