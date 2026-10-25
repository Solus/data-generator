import React from 'react';

interface DimensionedProps {
  children: React.ReactNode;
  /** Caption centred under the dimension line. */
  label: string;
  className?: string;
}

// A value with an architectural dimension line (thin rule with end ticks) and caption beneath it.
// The line and caption are decorative; hidden on phones where the legend list is used instead.
const Dimensioned: React.FC<DimensionedProps> = ({ children, label, className = '' }) => (
  <div>
    <div className={className}>{children}</div>
    <div aria-hidden="true" className="hidden sm:block">
      <div className="relative mt-[18px] h-px bg-dim">
        <span className="absolute -top-1 left-0 h-[9px] w-px bg-dim" />
        <span className="absolute -top-1 right-0 h-[9px] w-px bg-dim" />
      </div>
      <p className="mt-2 whitespace-nowrap text-center font-mono text-[11px] uppercase tracking-[0.06em] text-muted">{label}</p>
    </div>
  </div>
);

export default Dimensioned;
