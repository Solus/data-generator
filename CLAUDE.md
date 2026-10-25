# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # dev server at http://localhost:3000
npm run build   # production build
npm run start   # serve production build
npm run lint    # next lint
```

There is no test runner configured.

## What this is

A small Next.js (App Router, TypeScript, Tailwind v4) tool that generates test data for Croatia: IBANs, OIBs (national ID numbers) and personal names. Pages live in `src/app/{iban,oib,names}/page.tsx` and each renders the matching component from `src/components/`.

## Architecture

- **Generators are client-side except names.** `src/utils/generators.ts` holds the OIB and IBAN check-digit algorithms (OIB ISO 7064 MOD 11,10; IBAN mod-97). Generated account numbers also carry the Croatian domestic control digit (same MOD 11,10 as the OIB, over the first 9 digits); the bank codes in `IbanGenerator` already satisfy it, so a new bank's code must too. `IbanGenerator.tsx` / `OibGenerator.tsx` call them directly in the browser.
- **Names go through an API route.** `NamesGenerator.tsx` POSTs `{ numNames }` (1–50) to `src/app/api/generate-names/route.ts`, which calls the Gemini API (`gemini-3.5-flash-lite`, falling back to `gemini-3.5-flash` (override with `GEMINI_MODEL` / `GEMINI_FALLBACK_MODEL` in `.env.local`); 503/429 are retried once per model. Google retires models often (404) and some listed ones are unusable or overloaded, so test with the models-list endpoint before changing defaults) with `GEMINI_API_KEY` from `.env.local` and returns Google's raw response. The model is prompted to return `Firstname,Lastname` per line; the client does the parsing. If the request fails or yields no usable names, the client falls back to `generateLocalNames` in `src/utils/names.ts` (built-in list) and shows a notice. Keep the key server-side only.
- **i18n is a hand-rolled context**, not a library. `src/utils/locale.tsx` provides `LocaleProvider`/`useLocale()` (default language `hr`, also `en`); strings live in `src/locales/{en,hr}.ts` and may be functions (e.g. `copyText(v)`). When adding UI text, add the key to **both** locale files. The chosen language is stored in a `lang` cookie; the async root layout reads it to set `<html lang>` and `initialLang`. Shared constants/types live in `src/utils/lang.ts` — keep them out of `locale.tsx`, because values imported from a `'use client'` file into the server layout arrive as references, not the actual value.
- **Theming:** dark mode is class-based (`.dark` on `<html>`, `@custom-variant dark` in `globals.css`). An inline script in `layout.tsx` sets the class before first paint from `localStorage.theme` or the OS setting; `ThemeToggleWrapper` mirrors the `<html>` class via `useSyncExternalStore`, so the class is the single source of truth. `layout.tsx` also injects inline `<style>` overrides (`!important`) for `.material-card` and dark body background — account for these when changing card/background colors. The root layout wraps every page in the shared header, card and `Navigation`.
- **No random values during render.** Generated values (IBAN, OIB) are created in `useEffect` after mount; generating them in the `useState` initializer causes a hydration mismatch.
- Icons come from a mix of sources (Font Awesome via CDN `<link>` in `layout.tsx` and npm packages, Heroicons, Radix icons).
- Path alias: `@/*` → `src/*`.

## Repo quirks

- ESLint 9 with the flat config in `eslint.config.mjs` (don't re-add a legacy `.eslintrc`; with ESLint 8 it made `next lint` crash). `eslint-config-next` is pinned to match the Next version.
- Translation strings are typed as `typeof en`, so a key missing from `src/locales/en.ts` is a compile error; `hr.ts` must have the same keys.
- Tailwind 4 is configured in CSS (`globals.css`) plus `postcss.config.mjs`; there is no `tailwind.config`.
- `package.json` uses `latest` for next/react/typescript, so installs can drift.
