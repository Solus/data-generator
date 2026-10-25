# Backlog

UX improvements and open questions found in the June UX review but not yet done.

## UX
- **IBAN colour segments have no legend** (country / check digits / bank / account number).
- **Notice for built-in names isn't dismissible** and stays until the next generate.

## Localisation
- Page title/description (`metadata`) and the header subtitle in `layout.tsx` are English-only.
- Theme toggle tooltip is English-only; language selector label (`Select language`) too.

## Unverified
- Copy confirmation behaviour, keyboard navigation and contrast ratios haven't been audited.
- `npm run lint` hasn't been run; two ESLint configs coexist (`.eslintrc.cjs` and `eslint.config.mjs`).
- Retry/fallback across the two Gemini models has only been tested for single-model failures.

## Housekeeping
- Stray root files (`route.ts`, `clipboard.ts`, `oib_iban_generator.html`, duplicate `postcss.config.js`) look like leftovers.
- `package.json` pins next/react/typescript to `latest`.
- README is still the create-next-app boilerplate.
