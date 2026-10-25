import React from 'react';

// Small key badge for buttons. Hidden on devices without a hover-capable pointer (touch),
// where there's no keyboard to use it with.
const ShortcutHint: React.FC<{ keyName: string }> = ({ keyName }) => (
  <kbd
    aria-hidden="true"
    className="hidden rounded-[2px] border border-current px-1.5 font-mono text-xs uppercase leading-5 opacity-70 [@media(hover:hover)]:inline-block"
  >
    {keyName}
  </kbd>
);

export default ShortcutHint;
