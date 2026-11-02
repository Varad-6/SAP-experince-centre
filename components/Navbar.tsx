'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Compass, CheckSquare, Presentation, ExternalLink, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Solutions', href: '/', icon: Layers },
    { label: '3-Tier Topology', href: '/architecture', icon: Compass },
    { label: 'Prerequisites Planner', href: '/prerequisites', icon: CheckSquare },
    { label: 'Presenter Mode', href: '/present', icon: Presentation, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sap-blue to-cyan-500 p-0.5 shadow-md shadow-blue-500/10 flex items-center justify-center text-white font-bold text-lg">
            <img src="/media/ais_logo.png" alt="AIS Logo" className="w-8 h-8 object-contain rounded-lg" onError={(e)=>{ (e.target as HTMLElement).style.display='none'; }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                AIS Experience Centre
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Enterprise SAP BTP · AI · Joule · SAC
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  item.highlight
                    ? 'bg-sap-blue text-white shadow-sm hover:bg-sap-darkBlue'
                    : isActive
                    ? 'bg-blue-50 dark:bg-slate-800 text-sap-blue'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://sap-btp-ais-d0a7p7v8.launchpad.cfapps.eu30.hana.ondemand.com/site?siteId=a70e83a1-241a-44ba-9f8e-5a760483a8d2#podzone-dispatch"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <span>Live PODZO App</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
