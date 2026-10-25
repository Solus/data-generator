# Backlog

UX improvements and open questions found in the June UX review but not yet done.

## UX
- Names: per-name copy buttons on touch devices are untested on a real device (rule is in place).

## Testing
- No automated tests. The generator maths (OIB, IBAN, account control digit) is the part most worth covering; it was checked by hand against known-valid numbers.

## Unverified
- Copy confirmation behaviour, keyboard navigation and contrast ratios haven't been audited.
- Retry/fallback across the two Gemini models has only been tested for single-model failures.

## Housekeeping
- `Navigation.tsx` uses a `scrollbar-none` class that isn't defined anywhere (no-op); add a utility or drop it.
- Unused default Next assets in `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) — nothing references them.
- `package.json` pins next/react/typescript to `latest`.
