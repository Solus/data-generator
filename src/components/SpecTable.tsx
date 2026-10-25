import React from 'react';

// Small "schedule" table of facts about the generated value (length, algorithm, ...).
const SpecTable: React.FC<{ rows: [label: string, value: string][] }> = ({ rows }) => (
  <dl className="mt-9 border-t border-line">
    {rows.map(([label, value]) => (
      <div key={label} className="grid min-h-[42px] grid-cols-[8.5rem_1fr] items-center gap-4 border-b border-line py-2 sm:grid-cols-[220px_1fr]">
        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{label}</dt>
        <dd className="text-[15px]">{value}</dd>
      </div>
    ))}
  </dl>
);

export default SpecTable;
