import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
}

// Native checkbox with role="switch" (keyboard + screen-reader friendly), drawn as a square track.
const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, id }) => (
  <label htmlFor={id} className="flex min-h-12 cursor-pointer select-none items-center gap-3 text-[15px]">
    <input
      id={id}
      type="checkbox"
      role="switch"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className="relative inline-block h-[22px] w-10 rounded-[2px] bg-control transition-colors peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-2 peer-checked:[&>span]:translate-x-[18px]"
    >
      <span className="absolute left-[3px] top-[3px] h-4 w-4 rounded-[1px] bg-sheet transition-transform" />
    </span>
    {label}
  </label>
);

export default Switch;
