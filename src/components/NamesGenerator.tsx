'use client';

import React, { useState, useEffect, useId } from 'react';
import { copyToClipboard } from '@/utils/clipboard';
import { generateLocalNames } from '@/utils/names';
import { useLocale } from '@/utils/locale';
import { useCopyShortcut, useGenerateShortcut } from '@/utils/useGenerateShortcut';
import ActionBar from './ActionBar';
import PrimaryButton from './PrimaryButton';
import SegmentedControl from './SegmentedControl';
import ShortcutHint from './ShortcutHint';
import { pad } from './PageIntro';
import { CheckIcon, CloseIcon, CopyIcon } from './icons';

interface Name {
  firstName: string;
  lastName: string;
}

type NameOrder = 'first-last' | 'last-first';

const NamesGenerator: React.FC = () => {
  // null while the field is empty, so the user can clear it and type a new number (restored to 10 on blur).
  const [numNames, setNumNames] = useState<number | null>(10);
  const count = numNames ?? 10;
  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null); // key of the item that was just copied
  const [order, setOrder] = useState<NameOrder>('first-last'); // order used by every copy action
  const orderName = useId();

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

  // A name in the chosen order. "Copy all" puts one per line; the CSV button puts them on a single
  // line separated by commas ("First Last, First Last, ...").
  const fullName = (n: Name) => (order === 'first-last' ? `${n.firstName} ${n.lastName}` : `${n.lastName} ${n.firstName}`);

  const copyAll = () => {
    if (names.length > 0) handleCopy(names.map(fullName).join('\n'), 'all');
  };

  useGenerateShortcut(() => {
    if (!loading) generateNames();
  });
  useCopyShortcut(copyAll);

  const stepButton = 'flex h-12 w-11 items-center justify-center text-xl text-ink hover:bg-paper sm:w-[46px]';
  const groupButton = 'inline-flex h-[52px] items-center gap-2.5 px-4 text-[15px] font-medium text-ink hover:bg-ink hover:text-on-ink sm:h-[46px]';

  return (
    <div>
      <ActionBar
        options={
          <div className="flex flex-col gap-1.5">
            <span id="count-label" className="text-[13px] font-medium text-ink-soft">{strings.countLabel}</span>
            <div role="group" aria-labelledby="count-label" className="flex h-12 w-fit rounded-[2px] border border-control focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-2">
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
        }
      >
        {names.length > 0 && !loading && (
          <div role="group" aria-label={strings.copyAll} className="flex shrink-0 divide-x divide-ink rounded-[2px] border border-ink sm:h-12">
            <button type="button" onClick={copyAll} aria-keyshortcuts="C" className={groupButton}>
              {copied === 'all' ? <CheckIcon /> : <CopyIcon />}
              {copied === 'all' ? strings.copied : strings.copyAll}
              <ShortcutHint keyName="c" />
            </button>
            <button
              type="button"
              onClick={() => handleCopy(names.map(fullName).join(', '), 'csv')}
              aria-label={strings.copyAllCsv}
              title={strings.copyAllCsv}
              className={groupButton}
            >
              {copied === 'csv' ? <CheckIcon /> : null}
              CSV
            </button>
          </div>
        )}
        <PrimaryButton className="max-sm:order-first max-sm:basis-full" onClick={generateNames} disabled={loading} aria-busy={loading} title={strings.aiTitle}>
          {strings.generateNames}
        </PrimaryButton>
      </ActionBar>

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
        <div role="status" className="mt-7 border-t border-t-rule">
          <p className="eyebrow py-3">{strings.generating}</p>
          {[0, 1, 2, 3].map(i => (
            <div key={i} aria-hidden="true" className="flex h-[46px] items-center border-t border-line">
              <span className="h-4 w-2/5 animate-pulse bg-line" />
            </div>
          ))}
        </div>
      ) : (
        names.length > 0 && (
          <section aria-label={strings.namesGenerator} className="mt-7 border-t border-t-rule">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2.5 text-[13px] text-muted">
              <p>{strings.namesCopyHint}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span>{strings.copyOrderLabel}</span>
                <SegmentedControl
                  name={orderName}
                  ariaLabel={strings.copyOrderLabel}
                  value={order}
                  onChange={setOrder}
                  options={[
                    { value: 'first-last', label: strings.orderFirstLast },
                    { value: 'last-first', label: strings.orderLastFirst },
                  ]}
                />
              </div>
            </div>
            {/* Fixed column widths: the "copied" confirmation can never make the columns shift. */}
            <table className="w-full table-fixed border-t border-line text-left">
              <colgroup>
                <col className="w-10 sm:w-14" />
                <col />
                <col />
                <col className="w-14 sm:w-[7.5rem]" />
              </colgroup>
              <thead>
                <tr className="eyebrow h-10 border-b border-line">
                  <th scope="col" className="font-medium">{strings.numberHeader}</th>
                  <th scope="col" className="font-medium">{strings.firstNameHeader}</th>
                  <th scope="col" className="font-medium">{strings.lastNameHeader}</th>
                  <th scope="col" className="pr-1 text-right font-medium">{strings.copy}</th>
                </tr>
              </thead>
              <tbody>
                {names.map((name, index) => {
                  const full = fullName(name);
                  const rowKey = `${index}-full`;
                  const cell = (value: string, key: string) => (
                    <button
                      type="button"
                      onClick={() => handleCopy(value, key)}
                      title={strings.copyText(value)}
                      className="group -mx-2.5 my-1.5 inline-flex min-h-[34px] items-center gap-2 rounded-[2px] px-2.5 py-1 text-left text-base hover:bg-paper focus-visible:bg-paper sm:text-lg"
                    >
                      {value}
                      {copied === key ? (
                        <CheckIcon width={14} height={14} className="shrink-0 text-accent-2" />
                      ) : (
                        <CopyIcon width={14} height={14} className="hidden shrink-0 text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block" />
                      )}
                    </button>
                  );
                  return (
                    <tr key={index} className={`border-b border-line ${copied === rowKey ? 'bg-paper' : ''}`}>
                      <td className="font-mono text-xs text-muted">{pad(index + 1)}</td>
                      <td>{cell(name.firstName, `${index}-first`)}</td>
                      <td>{cell(name.lastName, `${index}-last`)}</td>
                      <td>
                        {/* One button in a fixed-width cell, so the confirmation swaps content without moving anything.
                            The column header names it on phones, where only the icon shows. */}
                        <button
                          type="button"
                          onClick={() => handleCopy(full, rowKey)}
                          aria-label={strings.copyText(full)}
                          title={strings.copyText(full)}
                          className="inline-flex h-9 w-full items-center justify-end gap-1.5 rounded-[2px] px-2 text-sm font-medium text-accent-2 hover:bg-paper focus-visible:bg-paper"
                        >
                          {copied === rowKey ? <CheckIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
                          <span className="hidden sm:inline">{copied === rowKey ? strings.copied : strings.copy}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )
      )}
    </div>
  );
};

export default NamesGenerator;
