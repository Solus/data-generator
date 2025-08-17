'use client';

import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { copyToClipboard } from '@/utils/clipboard';

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
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [lang, setLang] = useState<'hr' | 'en'>('hr');

  const L: Record<string, any> = {
    en: {
      numberOfNames: 'Number of Names:',
      generateNames: 'Generate Names',
      generating: 'Generating names…',
      actions: 'Actions',
      moreOptions: 'More copy options',
      copyText: (v: string) => `Copy "${v}"`,
      decrease: 'Decrease number of names',
      increase: 'Increase number of names',
      aiTitle: 'Generate names using AI',
      firstNameHeader: 'First Name',
      lastNameHeader: 'Last Name',
      openActions: 'Open actions',
    },
    hr: {
      numberOfNames: 'Broj imena:',
      generateNames: 'Generiraj imena',
      generating: 'Generiranje imena…',
      actions: 'Akcije',
      moreOptions: 'Više opcija kopiranja',
      copyText: (v: string) => `Kopiraj "${v}"`,
      decrease: 'Smanji broj imena',
      increase: 'Povećaj broj imena',
      aiTitle: 'Generiraj imena pomoću AI',
      firstNameHeader: 'Ime',
      lastNameHeader: 'Prezime',
      openActions: 'Otvori akcije',
    },
  };

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
        const errorMessage = result.error?.message || 'No names generated. Please try again.';
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
    <div className='p-4'>
  <div className='flex items-end space-x-4 mb-4'>
        <div className='flex-1'>
          <label htmlFor='numNames' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            {L[lang].numberOfNames}
          </label>
          <div className='mt-1 inline-flex items-center rounded-md shadow-sm bg-white dark:bg-gray-800'>
            <button
              type='button'
              onClick={decrementNum}
              className='px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100'
              aria-label='Decrease number of names'
            >
              −
            </button>
            <input
              id='numNames'
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              value={numNames}
              onChange={onNumChange}
              min={1}
              max={50}
              className='w-20 text-center px-2 py-2 border-t border-b border-gray-300 dark:border-gray-700 focus:outline-none'
              aria-label='Number of names'
            />
            <button
              type='button'
              onClick={incrementNum}
              className='px-3 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100'
              aria-label='Increase number of names'
            >
              +
            </button>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={generateNames}
            disabled={loading}
            aria-busy={loading}
            className='inline-flex items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-600'
            title={L[lang].aiTitle}
          >
            {/* Heroicon sparkles (AI/magic indicator) */}
            <SparklesIcon className='w-5 h-5' aria-hidden='true' />
            <span>{L[lang].generateNames}</span>
          </button>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as 'hr' | 'en')}
            aria-label='Select language'
            className='ml-2 rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-700 text-sm'
          >
            <option value='hr'>HR</option>
            <option value='en'>EN</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className='mt-6 flex flex-col items-center space-y-3'>
          <div className='inline-flex items-center gap-2'>
            <svg className='animate-spin w-6 h-6 text-blue-600 dark:text-blue-400' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg' aria-hidden>
              <path d='M21 12a9 9 0 11-18 0' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            <span className='text-sm text-blue-600 dark:text-blue-400'>{L[lang].generating}</span>
          </div>

          {/* Skeleton rows to indicate incoming data */}
          <div className='w-full max-w-2xl space-y-2'>
            <div className='h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-700' />
            <div className='h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-700' />
            <div className='h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-700' />
          </div>
        </div>
      )}
      {error && <p className='text-center text-red-500 dark:text-red-400'>{error}</p>}

      {!loading && names.length > 0 && (
        <div className='grid grid-cols-[1fr_1fr_auto] gap-x-4 gap-y-2 items-center mt-6'>
          {/* Headers */}
          <div className='font-bold p-2 text-left text-gray-600 dark:text-gray-400 uppercase tracking-wider text-sm'>{L[lang].firstNameHeader}</div>
          <div className='font-bold p-2 text-left text-gray-600 dark:text-gray-400 uppercase tracking-wider text-sm'>{L[lang].lastNameHeader}</div>
          <div className='font-bold p-2 text-center text-gray-600 dark:text-gray-400 uppercase tracking-wider text-sm'>{L[lang].actions}</div>

          {/* Data Rows */}
          {names.map((name, index) => (
            <React.Fragment key={index}>
              {/* First Name Cell */}
              <div className='bg-gray-50 dark:bg-gray-800 rounded-md group relative flex items-center'>
                <span className='p-2 flex-grow'>{name.firstName}</span>
                <button
                  onClick={() => handleCopy(name.firstName, `${index}-firstName`)}
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-sm bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity dark:bg-gray-700'
                  title={L[lang].copyText(name.firstName)}
                >
                  {copyStatus[`${index}-firstName`] === 'success' ? (
                    <i className='fas fa-check text-green-500'></i>
                  ) : (
                    <i className='fas fa-copy'></i>
                  )}
                </button>
              </div>

              {/* Last Name Cell */}
              <div className='bg-gray-50 dark:bg-gray-800 rounded-md group relative flex items-center'>
                <span className='p-2 flex-grow'>{name.lastName}</span>
                <button
                  onClick={() => handleCopy(name.lastName, `${index}-lastName`)}
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-sm bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity dark:bg-gray-700'
                  title={L[lang].copyText(name.lastName)}
                >
                  {copyStatus[`${index}-lastName`] === 'success' ? (
                    <i className='fas fa-check text-green-500'></i>
                  ) : (
                    <i className='fas fa-copy'></i>
                  )}
                </button>
              </div>

              {/* Actions Cell - Primary copy button + dropdown for alternate order */}
              <div className='flex justify-center items-center'>
                <div
                  className='relative inline-flex rounded-md shadow-sm'
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenDropdown(null);
                  }}
                >
                  <button
                    onClick={() => handleCopy(`${name.firstName} ${name.lastName}`, `${index}-fullName`)}
                    title={`Copy "${name.firstName} ${name.lastName}"`}
                    aria-label={`Copy ${name.firstName} ${name.lastName}`}
                    className='p-2 rounded-l-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center justify-center'
                  >
                    {copyStatus[`${index}-fullName`] === 'success' ? (
                      <svg className='w-5 h-5 text-green-200' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M5 13l4 4L19 7' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                    ) : (
                      <svg className='w-5 h-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
                        <rect x='9' y='9' width='13' height='13' rx='2' />
                        <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                    )}
                    <span className='sr-only'>{`Copy ${name.firstName} ${name.lastName}`}</span>
                  </button>

                  <button
                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                    aria-haspopup='menu'
                    aria-expanded={openDropdown === index}
                    title='More copy options'
                    className='py-2 px-2 rounded-r-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <svg className='w-4 h-4' viewBox='0 0 20 20' fill='none' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
                      <path d='M6 8l4 4 4-4' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                  </button>

                  {openDropdown === index && (
                    <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10'>
                      <button
                        onClick={() => {
                          handleCopy(`${name.lastName} ${name.firstName}`, `${index}-fullNameRev`);
                          setOpenDropdown(null);
                        }}
                        className='w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
                      >
                        {L[lang].copyText(`${name.lastName} ${name.firstName}`)}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default NamesGenerator;
