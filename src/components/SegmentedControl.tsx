import React from 'react';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  /** Show only the icon below the sm breakpoint (label stays available to screen readers). */
  iconOnlyOnPhone?: boolean;
}

interface SegmentedControlProps<T extends string> {
  name: string;
  ariaLabel: string;
  value: T;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  /** md = 36px tall (touch-friendly), sm = 32px. */
  size?: 'sm' | 'md';
  className?: string;
}

// Segmented switch built on native radio inputs, so arrow keys, focus and screen-reader semantics
// come for free. The selected segment is solid ink; hover only affects unselected segments.
function SegmentedControl<T extends string>({ name, ariaLabel, value, onChange, options, size = 'sm', className = '' }: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={`flex w-fit gap-0.5 rounded-[2px] border border-control p-0.5 ${className}`}>
      {options.map((o) => (
        <label key={o.value} title={o.label} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="peer sr-only"
          />
          <span
            className={`flex items-center justify-center gap-1.5 rounded-[1px] px-2.5 text-[13px] text-muted peer-not-checked:hover:text-ink peer-checked:bg-ink peer-checked:text-on-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-accent-2 ${size === 'md' ? 'h-9' : 'h-8'} ${o.iconOnlyOnPhone ? 'w-7 px-0 sm:w-auto sm:px-2.5' : ''}`}
          >
            {o.icon}
            <span className={o.iconOnlyOnPhone ? 'sr-only sm:not-sr-only' : ''}>{o.label}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

export default SegmentedControl;
