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

A small Next.js (App Router, TypeScript, Tailwind v4) tool that generates test data for Croatia: IBANs, OIBs (national ID numbers) and personal names. Pages live in `src/app/{iban,oib,names}/page.tsx` (server components) and each renders the shared intro plus the matching client component from `src/components/`.

## Architecture

- **Generators are client-side except names.** `src/utils/generators.ts` holds the OIB and IBAN check-digit algorithms (OIB ISO 7064 MOD 11,10; IBAN mod-97). Generated account numbers also carry the Croatian domestic control digit (same MOD 11,10 as the OIB, over the first 9 digits); the bank codes in `IbanGenerator` already satisfy it, so a new bank's code must too. `IbanGenerator.tsx` / `OibGenerator.tsx` call them directly in the browser.
- **Names go through an API route.** `NamesGenerator.tsx` POSTs `{ numNames }` (1–50) to `src/app/api/generate-names/route.ts`, which calls the Gemini API (`gemini-3.5-flash-lite`, falling back to `gemini-3.5-flash` (override with `GEMINI_MODEL` / `GEMINI_FALLBACK_MODEL` in `.env.local`); 503/429 are retried once per model. Google retires models often (404) and some listed ones are unusable or overloaded, so test with the models-list endpoint before changing defaults) with `GEMINI_API_KEY` from `.env.local` and returns Google's raw response. The model is prompted to return `Firstname,Lastname` per line; the client does the parsing. If the request fails or yields no usable names, the client falls back to `generateLocalNames` in `src/utils/names.ts` (built-in list) and shows a notice. Keep the key server-side only.
- **i18n is a hand-rolled context**, not a library. `src/utils/locale.tsx` provides `LocaleProvider`/`useLocale()` (default language `hr`, also `en`); strings live in `src/locales/{en,hr}.ts` and may be functions (e.g. `copyText(v)`). When adding UI text, add the key to **both** locale files. The chosen language is stored in a `lang` cookie; the async root layout reads it to set `<html lang>` and `initialLang`. Shared constants/types live in `src/utils/lang.ts` — keep them out of `locale.tsx`, because values imported from a `'use client'` file into the server layout arrive as references, not the actual value.
- **Design system (clean, "architectural drawing" look):** all colours are semantic tokens in `globals.css` (`--paper`, `--sheet`, `--ink`, `--muted`, `--line`, `--accent`, `--accent-2`, ...), defined for light in `:root` and for dark in `.dark`, and exposed to Tailwind as `bg-sheet`, `text-muted`, `border-line`, etc. Use these utilities for colour; don't hardcode hex values or add `dark:` colour variants. Fonts are Instrument Sans + IBM Plex Mono via `next/font` (the `latin-ext` subset is needed for Croatian letters). Corners are `rounded-[2px]`; the `eyebrow` utility is the small mono caption style. Colour accents: the primary button is filled with `accent` (text colour `on-accent`, hover `accent-strong`; in dark mode the accent is light so its text is dark), and the generated IBAN/OIB sits in a tinted `panel` (`panel-line` border, 2px accent top rule). Hover/highlight tints use `hover`. Contrast of every screen was audited in both themes; keep text at 4.5:1 or better.
- **Theming:** dark mode is class-based (`.dark` on `<html>`). The user's preference is light, dark or system (follow the device), handled by `src/utils/theme.ts` and shown as a three-way radio switch in `ThemeToggle`. It is stored in `localStorage.theme` as `light`/`dark`; system is the absence of the key. An inline script in `layout.tsx` applies the class before first paint (keep its logic in step with `theme.ts`); `ThemeToggleWrapper` reads the preference via `useSyncExternalStore`, and `theme.ts` re-applies the class when the device setting changes (only while on system) or another tab changes the preference.
- **Page shell:** the async root layout draws the framed "sheet" (corner crosshairs, `AppHeader`, numbered top `Navigation`, `AppFooter`). `PAGES` in `PageIntro.tsx` is the single list of pages used by the intro and tabs. Each page renders `<PageIntro page="..."/>` (eyebrow + heading, no subtitle) plus its generator. The theme switch is in the header from `sm` up and in the footer on phones; the footer shows the test-data note and, where a keyboard is likely, a legend of the shortcuts.
- **Page structure (keep it consistent across pages):** (on the IBAN page "Random bank" is the first, default option of the bank dropdown; there is no separate switch) heading → `ActionBar` (page options on the left; `CopyButton` + `PrimaryButton` on the right, side by side on phones) → result (IBAN/OIB hero figure, or the names table) → `SpecTable` facts. The generated number is itself a button that copies it. Shortcuts: **G** generates, **C** copies (copy-all on Names); `useKeyShortcut` ignores typing, Ctrl/Cmd/Alt combos and key repeat. Copy feedback comes from `useCopyFeedback`, so the button, the number and the shortcut all behave identically. `SegmentedControl` (native radios) is the one switch style; give each instance a unique `name` (`useId`).
- **Fluid figures:** the generated IBAN/OIB use the `figure` utility (`globals.css`), which sizes the text from the viewport so the one-line number never overflows (set `--figure-units` to the line's width in em). IBAN dimension lines/captions are hidden on phones in favour of a legend list. The bank-code caption names the bank the IBAN belongs to (also in the phone legend), so keep that when changing the IBAN display.
- **No random values during render.** Generated values (IBAN, OIB) are created in `useEffect` after mount; generating them in the `useState` initializer causes a hydration mismatch.
- Icons are small inline SVG components in `src/components/icons.tsx`; there is no icon library or CDN, so add new icons there.
- Path alias: `@/*` → `src/*`.

## Repo quirks

- ESLint 9 with the flat config in `eslint.config.mjs` (don't re-add a legacy `.eslintrc`; with ESLint 8 it made `next lint` crash). `eslint-config-next` is pinned to match the Next version.
- Translation strings are typed as `typeof en`, so a key missing from `src/locales/en.ts` is a compile error; `hr.ts` must have the same keys.
- Tailwind 4 is configured in CSS (`globals.css`) plus `postcss.config.mjs`; there is no `tailwind.config`.
- `package.json` uses `latest` for next/react/typescript, so installs can drift.
