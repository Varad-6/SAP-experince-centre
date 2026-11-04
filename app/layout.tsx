import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Abhiyanta India Solutions — Enterprise Experience Centre',
  description: 'Enterprise portfolio showcasing 28 production SAP solutions across 5 pillars.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen">
        {/* Minimalist Top Bar: company name 'Abhiyanta' (text, 600) left, nothing else */}
        <header className="h-14 px-6 sm:px-8 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between sticky top-0 z-30">
          <a href="/" className="font-semibold text-base text-[var(--navy)] tracking-tight no-underline hover:text-[var(--brand)]">
            Abhiyanta
          </a>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
