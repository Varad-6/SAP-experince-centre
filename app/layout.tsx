import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/components/AppProvider';

export const metadata: Metadata = {
  title: 'AIS Experience Centre — Enterprise SAP BTP, AI & SAC Portfolio',
  description:
    'Executive presentation and architecture centre showcasing 28 production solutions across SAP BTP, Agentic AI, Joule, HanaMorph and SAP Analytics Cloud.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#060D1D] text-[#EAF2FF] overflow-x-hidden">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
