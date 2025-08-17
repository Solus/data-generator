import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import ThemeToggleWrapper from '@/components/ThemeToggleWrapper';
import LanguageSelector from '@/components/LanguageSelector';
import { LocaleProvider } from '@/utils/locale';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Data Generator',
  description: 'A simple web application to generate Croatian IBANs, OIBs, and names.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
	<html lang="en">
	  <head>
		{/* Font Awesome CDN for icons */}
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
	  </head>
			<body className={inter.className}>
				<LocaleProvider>
					<div className="bg-background text-foreground min-h-screen">
						<div className="mx-auto my-10 max-w-4xl p-4">
							<div className="flex justify-between items-center mb-4">
								<h1 className="text-3xl font-bold">Data Generator</h1>
								<div className='flex items-center space-x-2'>
									<LanguageSelector />
									<ThemeToggleWrapper />
								</div>
							</div>
							<Navigation />
							<div className="rounded-b-lg border-x border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
								{children}
							</div>
						</div>
					</div>
				</LocaleProvider>
			</body>
	</html>
  );
}
