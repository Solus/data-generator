import React from 'react';

interface ActionBarProps {
  /** Page-specific options (bank, count, ...), on the left. */
  options?: React.ReactNode;
  /** The actions (copy, generate), always on the right from sm up and side by side on phones. */
  children: React.ReactNode;
}

// The same bar on every page, directly under the heading: options on the left, actions on the right.
const ActionBar: React.FC<ActionBarProps> = ({ options, children }) => (
  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-9 sm:gap-y-4">
    {options && <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-9">{options}</div>}
    <div className="flex flex-wrap gap-2.5 sm:ml-auto">{children}</div>
  </div>
);

export default ActionBar;
