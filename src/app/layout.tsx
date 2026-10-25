import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import ThemeToggleWrapper from '@/components/ThemeToggleWrapper';
import LanguageSelector from '@/components/LanguageSelector';
import AppHeading from '@/components/AppHeading';
import en from '@/locales/en';
import hr from '@/locales/hr';
import { cookies } from 'next/headers';
import { LocaleProvider } from '@/utils/locale';
import { LANG_COOKIE, type Lang } from '@/utils/lang';

const inter = Inter({ subsets: ['latin'] });

const getLang = async (): Promise<Lang> => ((await cookies()).get(LANG_COOKIE)?.value === 'en' ? 'en' : 'hr');

export async function generateMetadata(): Promise<Metadata> {
  const strings = (await getLang()) === 'en' ? en : hr;
  return { title: strings.appTitle, description: strings.appDescription };
}

// Runs before first paint so the saved/system theme is applied with no flash of the wrong one.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();

  return (
	// suppressHydrationWarning: the inline theme script changes <html class> before React hydrates.
	<html lang={lang} suppressHydrationWarning>
	  <head>
		<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
		{/* Font Awesome CDN for icons */}
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
		<style>{`
          html.dark body {
            background-color: #020617 !important;
            background-image: none !important;
          }
          /* Force material-card dark background */
          html.dark .material-card {
            background-color: #0f172a !important; /* slate-900 */
            border-color: rgba(51,65,85,0.7) !important; /* slate-700 */
          }
          .material-card {
            background-color: #ffffff; /* solid light mode */
          }
        `}</style>
	  </head>
			<body className={`${inter.className} antialiased min-h-screen
        bg-slate-100 text-slate-900
        dark:bg-slate-950 dark:text-slate-100
        dark:bg-none dark:[background-image:none]
        transition-colors`}>
				<LocaleProvider initialLang={lang}>
					<div className="min-h-screen">
						<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
							<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
							<AppHeading />
								<div className="flex items-center space-x-3 rounded-full bg-white/70 dark:bg-slate-800/60 px-3 py-2 shadow-lg shadow-cyan-200/30 dark:shadow-cyan-900/40 backdrop-blur md:space-x-4">
									<LanguageSelector />
									<ThemeToggleWrapper />
								</div>
							</div>
							<div
                className="material-card mt-8 rounded-3xl border shadow-2xl shadow-cyan-500/10 dark:shadow-black/40
                  border-slate-200 dark:border-slate-700
                  bg-white dark:bg-slate-900 transition-colors"
              >
                <Navigation />
                <div className="px-4 py-8 sm:px-10 sm:py-12">
                  {children}
                </div>
              </div>
						</div>
					</div>
				</LocaleProvider>
			</body>
	</html>
  );
}
