import React from 'react';

interface DimensionedProps {
  children: React.ReactNode;
  /** Caption centred under the dimension line. */
  label: string;
  /** Optional second line under the caption (e.g. the bank's name), in the blue accent. */
  sublabel?: string;
  className?: string;
}

// A value with an architectural dimension line (thin rule with end ticks) and caption beneath it.
// Spans only, so it can sit inside a <button>. The line and captions are decorative and hidden
// on phones, where a legend list is used instead.
const Dimensioned: React.FC<DimensionedProps> = ({ children, label, sublabel, className = '' }) => (
  <span className="block">
    <span className={`block ${className}`}>{children}</span>
    <span aria-hidden="true" className="hidden sm:block">
      <span className="relative mt-[18px] block h-px bg-dim">
        <span className="absolute -top-1 left-0 h-[9px] w-px bg-dim" />
        <span className="absolute -top-1 right-0 h-[9px] w-px bg-dim" />
      </span>
      {/* Captions are centred overlays (fixed height, absolutely positioned) so a long caption can
          never make its segment wider than the digits above it; the figure's size stays exact. */}
      <span className="relative mt-2 block h-4">
        <span className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap font-mono text-xs font-medium uppercase leading-4 tracking-[0.06em] text-muted">{label}</span>
      </span>
      {sublabel && (
        <span className="relative mt-0.5 block h-[18px]">
          <span className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap font-sans text-[13px] font-medium normal-case leading-[18px] tracking-normal text-accent-2">{sublabel}</span>
        </span>
      )}
    </span>
  </span>
);

export default Dimensioned;
