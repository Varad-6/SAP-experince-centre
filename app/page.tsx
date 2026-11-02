'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import solutionsData from '@/data/solutions.json';
import { 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Zap, 
  TrendingUp, 
  Database, 
  BrainCircuit, 
  BarChart3,
  Presentation
} from 'lucide-react';

export default function HomePage() {
  const [selectedPillar, setSelectedPillar] = useState<number | 'all'>('all');

  const pillars = [
    { id: 'all', label: 'All Solutions', count: solutionsData.length, icon: Layers },
    { id: 2, label: 'Pillar 2: BTP Applications', count: solutionsData.filter(s => s.pillar === 2).length, icon: Zap },
    { id: 3, label: 'Pillar 3: AI & Joule Copilots', count: solutionsData.filter(s => s.pillar === 3).length, icon: BrainCircuit },
    { id: 4, label: 'Pillar 4: Accelerators (HanaMorph)', count: solutionsData.filter(s => s.pillar === 4).length, icon: Database },
    { id: 5, label: 'Pillar 5: SAC Analytics', count: solutionsData.filter(s => s.pillar === 5).length, icon: BarChart3 },
  ];

  const filteredSolutions = selectedPillar === 'all'
    ? solutionsData
    : solutionsData.filter(s => s.pillar === selectedPillar);

  return (
    <div className="min-h-screen pb-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-blue-50/20 to-slate-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-sap-blue border border-blue-200 dark:border-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>ABHIYANTA INDIA SOLUTIONS — ENTERPRISE PORTFOLIO</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Where Enterprise SAP Meets <span className="text-sap-blue">Autonomous Intelligence</span>
              </h1>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                A unified digital experience centre showcasing 28 production solutions built across SAP BTP Cloud Foundry, 
                Agentic AI & Joule Copilots, HanaMorph Modernization, and SAP Analytics Cloud.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#catalog"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-sap-blue text-white shadow-lg shadow-blue-500/20 hover:bg-sap-darkBlue transition-all"
                >
                  <span>Explore Solutions</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/present"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <Presentation className="w-4 h-4 text-sap-blue" />
                  <span>Launch Presenter Mode</span>
                </Link>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-2xl font-black text-sap-blue">&lt;30s</div>
                  <div className="text-xs text-slate-500 font-medium">Logistics Verification</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600">85%</div>
                  <div className="text-xs text-slate-500 font-medium">Touchless Invoicing</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-purple-600">95%</div>
                  <div className="text-xs text-slate-500 font-medium">Modernization Speedup</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-600">9 Cockpits</div>
                  <div className="text-xs text-slate-500 font-medium">Live SAC Stories</div>
                </div>
              </div>
            </div>

            {/* Right Live Production System Spotlight */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group">
                {/* Browser Top Bar Mockup */}
                <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="px-3 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 truncate max-w-[220px]">
                    sap-btp-ais-eu30.hana.ondemand.com
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* System Screen */}
                <img 
                  src="/media/podzo_live_production_screen.png" 
                  alt="PODZO Cloud Foundry Live Production Console" 
                  className="w-full h-72 object-cover object-top transition duration-500 group-hover:scale-105"
                />
                
                {/* Overlay Banner */}
                <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-sap-blue flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Live SAP Cloud Foundry Production
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">EU30 Frankfurt</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    PODZO Control Tower & AI Dispatch Console
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Live enterprise execution: Autonomous sales order allocation, computer vision weighbridge matching, and zero-touch MIRO settlement.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATALOG FILTER & SOLUTIONS GRID */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Enterprise Solutions Catalog
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select any solution to explore use cases, animated 3-step flows, architecture diagrams, and live demos.
            </p>
          </div>
        </div>

        {/* Pillar Filter Pills */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
          {pillars.map((pil) => {
            const Icon = pil.icon;
            const isSelected = selectedPillar === pil.id;
            return (
              <button
                key={String(pil.id)}
                onClick={() => setSelectedPillar(pil.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-sap-blue text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{pil.label}</span>
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  {pil.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map((sol) => (
            <div
              key={sol.slug}
              className="group flex flex-col justify-between rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-sap-blue/50 dark:hover:border-sap-blue/50 transition-all duration-300"
            >
              <div>
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-sap-blue uppercase tracking-wider">
                    {sol.pillarName}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    {sol.status}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sap-blue transition">
                  {sol.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 mb-4 line-clamp-2">
                  {sol.tagline}
                </p>

                {/* Hero KPI Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-4">
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {sol.heroKpi.value}
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                    {sol.heroKpi.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {sol.heroKpi.description}
                  </div>
                </div>

                {/* S/4HANA Touchpoint Badges */}
                <div className="space-y-1 mb-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    SAP Touchpoints
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sol.sapTouchpoints.slice(0, 3).map((mod, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  href={`/solutions/${sol.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sap-blue hover:text-sap-darkBlue group-hover:translate-x-1 transition"
                >
                  <span>Explore Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {sol.demoUrl && sol.demoUrl.startsWith('http') && (
                  <a
                    href={sol.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Live App"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
