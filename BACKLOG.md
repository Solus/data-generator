# Backlog

Open items and known gaps.

## Testing
- No automated tests. The generator maths (OIB, IBAN, account control digit) is the part most worth covering; it was checked by hand against known-valid numbers.

## Unverified
- Touch behaviour on a real phone (layouts were checked at phone widths in a desktop browser) and real screen-reader use. Text contrast was audited automatically in both themes.
- Retry/fallback across the two Gemini models has only been tested for single-model failures.

## Housekeeping
- `package.json` pins next/react/typescript to `latest`.
