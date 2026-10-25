# Backlog

UX improvements and open questions found in the June UX review but not yet done.

## UX
- Names: per-name copy buttons on touch devices are untested on a real device (rule is in place).

## Unverified
- Copy confirmation behaviour, keyboard navigation and contrast ratios haven't been audited.
- `npm run lint` hasn't been run; two ESLint configs coexist (`.eslintrc.cjs` and `eslint.config.mjs`).
- Retry/fallback across the two Gemini models has only been tested for single-model failures.

## Housekeeping
- Stray root files (`route.ts`, `clipboard.ts`, `oib_iban_generator.html`, duplicate `postcss.config.js`) look like leftovers.
- `package.json` pins next/react/typescript to `latest`.
- README is still the create-next-app boilerplate.
