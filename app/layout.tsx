import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/components/AppProvider';
import { Director } from '@/components/mascot/Director';

export const metadata: Metadata = {
  title: 'AIS Experience Centre — Enterprise SAP BTP, AI & SAC Portfolio',
  description:
    'Interactive 3D presentation and architecture centre showcasing 28 enterprise solutions across SAP BTP, Agentic AI, Joule, HanaMorph and SAP Analytics Cloud.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#050E22] text-[#EAF2FF] overflow-x-hidden">
        <AppProvider>
          {children}
          {/* Global Chibi Lead Architect Director */}
          <Director />
        </AppProvider>
      </body>
    </html>
  );
}
