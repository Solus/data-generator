import './globals.css';
import type { Metadata } from 'next';
import { Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import Navigation from '@/components/Navigation';
import en from '@/locales/en';
import hr from '@/locales/hr';
import { LocaleProvider } from '@/utils/locale';
import { LANG_COOKIE, type Lang } from '@/utils/lang';

// latin-ext is required for Croatian letters (š, č, ć, ž, đ).
const sans = Instrument_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-sans-app', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '500'], variable: '--font-mono-app', display: 'swap' });

const getLang = async (): Promise<Lang> => ((await cookies()).get(LANG_COOKIE)?.value === 'en' ? 'en' : 'hr');

export async function generateMetadata(): Promise<Metadata> {
  const strings = (await getLang()) === 'en' ? en : hr;
  return { title: strings.appTitle, description: strings.appDescription };
}

// Runs before first paint so the saved/system theme is applied with no flash of the wrong one.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})();`;

// Small registration mark drawn at each corner of the sheet (decorative).
const Crosshair = ({ className }: { className: string }) => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className={`absolute hidden text-cross sm:block ${className}`}>
    <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();

  return (
    // suppressHydrationWarning: the inline theme script changes <html class> before React hydrates.
    <html lang={lang} suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Font Awesome CDN for icons (removed once all icons are inline SVG) */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <LocaleProvider initialLang={lang}>
          <div className="min-h-screen p-3 sm:p-7">
            <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1200px] flex-col border border-frame bg-sheet sm:min-h-[calc(100vh-3.5rem)]">
              <Crosshair className="-left-[7px] -top-[7px]" />
              <Crosshair className="-right-[7px] -top-[7px]" />
              <Crosshair className="-bottom-[7px] -left-[7px]" />
              <Crosshair className="-bottom-[7px] -right-[7px]" />
              <AppHeader />
              <Navigation />
              <main className="flex-1 px-5 pb-10 pt-6 sm:px-16 sm:pb-12 sm:pt-9">{children}</main>
              <AppFooter />
            </div>
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
