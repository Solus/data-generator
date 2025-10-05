'use client';

import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { copyToClipboard } from '@/utils/clipboard';
import { useLocale } from '@/utils/locale';

interface Name {
  firstName: string;
  lastName: string;
}

const NamesGenerator: React.FC = () => {
  const [numNames, setNumNames] = useState<number>(10);
  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<Record<string, 'idle' | 'success'>>({});

  const { strings } = useLocale();

  const handleCopy = async (text: string, key: string) => {
    const success = await copyToClipboard(text);
    if (!success) {
      setError('Failed to copy. Please copy manually.');
    } else {
      setError(null);
      setCopyStatus(prev => ({ ...prev, [key]: 'success' }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [key]: 'idle' }));
      }, 1000);
    }
  };

  const incrementNum = () => setNumNames(n => Math.min(50, n + 1));
  const decrementNum = () => setNumNames(n => Math.max(1, n - 1));
  const onNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value);
    if (Number.isNaN(v)) return;
    setNumNames(Math.min(50, Math.max(1, v)));
  };

  const generateNames = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numNames }),
      });

      const result = await response.json();

      if (!response.ok) {
        // If our API returns an error, it will be in result.error
        throw new Error(result.error || 'Failed to generate names.');
      }

      if (result.candidates && result.candidates.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        const nameLines = text.split('\n').filter((line: string) => line.trim() !== '');
        const newNames = nameLines.map((line: string) => {
          const parts = line.split(',');
          return { firstName: parts[0]?.trim(), lastName: parts[1]?.trim() };
        });
        setNames(newNames);
      } else {
        const errorMessage = result.error?.message || strings.noNamesGenerated;
        setError(errorMessage);
        setNames([]);
      }
    } catch (e: unknown) {
      console.error(e);
      let errorMessage = 'An error occurred while fetching names.';
      if (e instanceof Error) {
        errorMessage = `Error: ${e.message}`;
      }
      setError(errorMessage);
      setNames([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Count + Generate */}
      <div className="space-y-3">
        <label className="flex items-center font-semibold text-gray-800 dark:text-gray-200">
          <i className="fas fa-users mr-2 text-gray-600 dark:text-gray-400"></i>
          {strings.numberOfNames}
        </label>
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <div className="inline-flex items-stretch rounded-xl overflow-hidden border border-teal-200 dark:border-slate-700 ring-1 ring-inset ring-teal-100 dark:ring-slate-700/60 bg-teal-50 dark:bg-slate-800">
              <button
                type="button"
                onClick={decrementNum}
                className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 hover:bg-teal-100 dark:hover:bg-slate-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                aria-label={strings.decrease}
              >
                −
              </button>
              <input
                id="numNames"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={numNames}
                onChange={onNumChange}
                min={1}
                max={50}
                className="w-24 text-center px-2 py-2 bg-transparent font-mono text-gray-900 dark:text-gray-100 focus:outline-none"
                aria-label={strings.numberOfNames}
              />
              <button
                type="button"
                onClick={incrementNum}
                className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 hover:bg-teal-100 dark:hover:bg-slate-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                aria-label={strings.increase}
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={generateNames}
            disabled={loading}
            aria-busy={loading}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-600
            dark:bg-teal-600 dark:hover:bg-teal-500 dark:active:bg-teal-500 dark:text-slate-100/90
            font-semibold shadow-sm shadow-teal-500/20 transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
            focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:bg-gray-400 dark:disabled:bg-gray-600"
            title={strings.aiTitle}
          >
            <SparklesIcon className="w-5 h-5 -rotate-12 opacity-90" aria-hidden="true" />
            <span className="tracking-wide">{strings.generateNames}</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-2 flex flex-col items-center space-y-4">
          <div className="inline-flex items-center gap-2">
            <svg className="animate-spin w-6 h-6 text-teal-600 dark:text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M21 12a9 9 0 1 1-18 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm text-teal-600 dark:text-teal-400">{strings.generating}</span>
          </div>
          <div className="w-full max-w-2xl space-y-2">
            <div className="h-9 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
            <div className="h-9 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
            <div className="h-9 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
          </div>
        </div>
      )}

      {error && (
        <div className="flex justify-center">
          <div
            role="alert"
            className="text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-600/40 rounded-md px-3 py-1.5 leading-snug"
          >
            {error}
          </div>
        </div>
      )}

      {!loading && names.length > 0 && (
        <div className="space-y-2.5" aria-live="polite">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-x-3 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400">
            <div className="pl-1.5">{strings.firstNameHeader}</div>
            <div className="pl-1.5">{strings.lastNameHeader}</div>
            <div className="text-center">{strings.actions}</div>
          </div>
          <div className="space-y-1.5">
            {names.map((name, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_auto] gap-x-3 items-center rounded-xl border border-teal-200 dark:border-slate-700 ring-1 ring-inset ring-teal-100 dark:ring-slate-700/60 bg-teal-50 dark:bg-slate-800 px-1.5 py-1"
              >
                {/* First name pill cell */}
                <div className="relative group flex items-center rounded-md px-1.5 py-0.5 font-mono text-gray-800 dark:text-gray-200 text-sm">
                  {name.firstName}
                  <button
                    onClick={() => handleCopy(name.firstName, `${index}-firstName`)}
                    className="ml-auto w-7 h-7 flex items-center justify-center rounded-md bg-transparent hover:bg-teal-100 dark:hover:bg-slate-700/60 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                    title={strings.copyText(name.firstName)}
                  >
                    {copyStatus[`${index}-firstName`] === 'success'
                      ? <i className="fas fa-check text-green-500"></i>
                      : <i className="far fa-copy text-teal-600 dark:text-teal-400"></i>}
                  </button>
                </div>

                {/* Last name pill cell */}
                <div className="relative group flex items-center rounded-md px-1.5 py-0.5 font-mono text-gray-800 dark:text-gray-200 text-sm">
                  {name.lastName}
                  <button
                    onClick={() => handleCopy(name.lastName, `${index}-lastName`)}
                    className="ml-auto w-7 h-7 flex items-center justify-center rounded-md bg-transparent hover:bg-teal-100 dark:hover:bg-slate-700/60 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                    title={strings.copyText(name.lastName)}
                  >
                    {copyStatus[`${index}-lastName`] === 'success'
                      ? <i className="fas fa-check text-green-500"></i>
                      : <i className="far fa-copy text-teal-600 dark:text-teal-400"></i>}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex justify-center items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(`${name.firstName} ${name.lastName}`, `${index}-fullName`)}
                    title={strings.copyText(`${name.firstName} ${name.lastName}`)}
                    aria-label={strings.copyText(`${name.firstName} ${name.lastName}`)}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white active:bg-teal-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                  >
                    {copyStatus[`${index}-fullName`] === 'success'
                      ? <i className="fas fa-check text-green-500"></i>
                      : <i className="far fa-copy"></i>}
                  </button>
                  <button
                    onClick={() => handleCopy(`${name.lastName} ${name.firstName}`, `${index}-fullNameRev`)}
                    title={strings.copyText(`${name.lastName} ${name.firstName}`)}
                    aria-label={strings.copyText(`${name.lastName} ${name.firstName}`)}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent hover:bg-teal-100 dark:hover:bg-slate-700/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                  >
                    {copyStatus[`${index}-fullNameRev`] === 'success' ? (
                      <i className="fas fa-check text-green-500"></i>
                    ) : (
                      <span className="relative w-4 h-4 flex items-center justify-center" aria-hidden="true">
                        <i className="far fa-copy text-teal-600 dark:text-teal-400"></i>
                        <i className="fas fa-exchange-alt absolute text-teal-600 dark:text-teal-400" style={{ fontSize: '0.5rem' }}></i>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NamesGenerator;
