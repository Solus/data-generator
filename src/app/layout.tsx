import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Croatian IBAN, OIB, and Name Generator',
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
        <div className="bg-background text-foreground min-h-screen">
          <div className="mx-auto my-10 max-w-4xl p-4">
            <h1 className="text-3xl font-bold mb-4">Croatian IBAN, OIB, and Name Generator</h1>
            <nav className="mb-6">
              <ul className="flex space-x-2 border-b border-gray-200">
                <li>
                  <Link href="/iban" passHref>
                    <button className="inline-block p-3 text-lg font-medium hover:bg-gray-100 transition-colors">
                      <i className="fas fa-money-check-dollar mr-2"></i> IBAN Generator
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/oib" passHref>
                    <button className="inline-block p-3 text-lg font-medium hover:bg-gray-100 transition-colors">
                      <i className="fas fa-id-card mr-2"></i> OIB Generator
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/names" passHref>
                    <button className="inline-block p-3 text-lg font-medium hover:bg-gray-100 transition-colors">
                      <i className="fas fa-users mr-2"></i> Names
                    </button>
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="rounded-b-lg border-x border-b border-gray-200 p-4 shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
