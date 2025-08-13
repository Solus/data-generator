'use client';

import React, { useState } from 'react';
import { CopyIcon } from '@radix-ui/react-icons';

interface Name {
  firstName: string;
  lastName: string;
}

/**
 * Handles copying text to clipboard and provides visual feedback.
 * @param text The text to copy.
 * @param buttonElement The HTMLButtonElement that triggered the copy, for visual feedback.
 */
const copyToClipboard = async (text: string, buttonElement: HTMLButtonElement): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err: unknown) {
    console.error('Failed to copy using Clipboard API:', err);
    // Fallback to execCommand if modern API fails
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

const NamesGenerator: React.FC = () => {
  const [numNames, setNumNames] = useState<number>(10);
  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async (text: string, buttonElement: HTMLButtonElement) => {
    const iconElement = buttonElement.querySelector('i');
    const originalIconClass = iconElement?.className;
    
    if (iconElement) {
      iconElement.classList.remove('fa-copy');
      iconElement.classList.add('fa-check');
      iconElement.classList.add('text-green-500');
    }

    const success = await copyToClipboard(text, buttonElement);
    if (!success) {
      setError('Failed to copy. Please copy manually.');
    } else {
      setError(null);
    }
    
    setTimeout(() => {
      if (iconElement) {
        iconElement.classList.remove('fa-check');
        iconElement.classList.add('fa-copy');
        iconElement.classList.remove('text-green-500');
      }
    }, 1000);
  };

  const generateNames = async () => {
    setError(null);
    setLoading(true);

    const prompt = `Generate a list of ${numNames} unique Croatian first and last names. Format each name as "Firstname,Lastname" on a new line, with no introductory or concluding text.`;

    const chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        const nameLines = text.split('\n').filter((line: string) => line.trim() !== '');
        const newNames = nameLines.map((line: string) => {
          const parts = line.split(',');
          return { firstName: parts[0]?.trim(), lastName: parts[1]?.trim() };
        });
        setNames(newNames);
      } else {
        setError('No names generated. Please try again.');
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
            Number of Names:
          </label>
          <input
            id='numNames'
            type='number'
            value={numNames}
            onChange={(e) => setNumNames(parseInt(e.target.value))}
            min='1'
            max='50'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
          />
        </div>
        <button
          onClick={generateNames}
          disabled={loading}
          className='py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400'
        >
          {loading ? 'Generating...' : 'Generate Names'}
        </button>
      </div>

      {loading && <p className='text-center text-blue-500'>Generating names...</p>}
      {error && <p className='text-center text-red-500'>{error}</p>}

      {!loading && names.length > 0 && (
        <div className='names-grid'>
          <div className='names-grid-header'>Ime</div>
          <div className='names-grid-header'>Prezime</div>
          <div className='names-grid-header text-center'>Actions</div>
          {names.map((name, index) => (
            <div key={index} className='names-grid-row'>
              <div className='names-cell group relative'>
                <span className='p-2'>{name.firstName}</span>
                <button
                  onClick={(e) => handleCopy(name.firstName, e.currentTarget)}
                  className='absolute right-1 top-1/2 -translate-y-1/2 p-1 text-sm bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity dark:bg-gray-700'
                  title={`Copy ${name.firstName}`}
                >
                  <i className='fas fa-copy'></i>
                </button>
              </div>
              <div className='names-cell group relative'>
                <span className='p-2'>{name.lastName}</span>
                <button
                  onClick={(e) => handleCopy(name.lastName, e.currentTarget)}
                  className='absolute right-1 top-1/2 -translate-y-1/2 p-1 text-sm bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity dark:bg-gray-700'
                  title={`Copy ${name.lastName}`}
                >
                  <i className='fas fa-copy'></i>
                </button>
              </div>
              <div className='names-cell flex justify-center items-center space-x-2'>
                <button
                  onClick={(e) => handleCopy(`${name.firstName} ${name.lastName}`, e.currentTarget)}
                  className='py-1 px-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors'
                  title={`Copy ${name.firstName} ${name.lastName}`}
                >
                  I P
                </button>
                <button
                  onClick={(e) => handleCopy(`${name.lastName} ${name.firstName}`, e.currentTarget)}
                  className='py-1 px-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors'
                  title={`Copy ${name.lastName} ${name.firstName}`}
                >
                  P I
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NamesGenerator;
