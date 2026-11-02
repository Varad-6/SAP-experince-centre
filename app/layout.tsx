import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ChibiMascot from '@/components/mascot/ChibiMascot';

export const metadata: Metadata = {
  title: 'AIS Experience Centre — Enterprise SAP BTP, AI & SAC Portfolio',
  description: 'Interactive presentation and architecture centre showcasing 28 enterprise solutions across SAP BTP, Agentic AI, Joule, HanaMorph and SAP Analytics Cloud.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        {/* Global Interactive Chibi Lead Architect Mascot */}
        <ChibiMascot />
      </body>
    </html>
  );
}
