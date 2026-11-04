'use client';

import React from 'react';
import Link from 'next/link';
import siteData from '@/content/site.json';
import pillarsData from '@/content/pillars.json';
import solutionsData from '@/content/solutions.json';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  BarChart3,
  CheckCircle2,
  Play,
  Mail,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-14 pb-16 md:pt-24 md:pb-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-[#0070F2]/15 text-[#00B8F5] border border-[#00B8F5]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#00C8F8] animate-spin" style={{ animationDuration: '6s' }} />
              <span>ABHIYANTA INDIA SOLUTIONS — ENTERPRISE SAP & AI PORTFOLIO</span>
            </div>

            <h1 className="text-display font-extrabold text-white leading-tight">
              Architecting the Autonomous SAP Enterprise
            </h1>

            <p className="text-body text-[#9FB3D1] max-w-3xl mx-auto leading-relaxed">
              Discover 28 production solutions built across SAP BTP Cloud Foundry,
              Clean Core decoupled extensibility, Agentic AI, and real-time boardroom steering.
              Eliminate manual reconciliation and upgrade friction with zero core modifications.
            </p>

            {/* Primary Entry Action Button */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/pillars"
              >
                <Button size="lg" variant="primary" className="gap-2.5 px-8 py-4 text-base font-bold">
                  <span>Explore the 5 Pillars</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link
                href="/solution/podzo"
              >
                <Button size="lg" variant="secondary" className="gap-2.5 px-6 py-4">
                  <Play className="w-4 h-4 fill-current text-[#00B8F5]" />
                  <span>View Flagship (PODZO)</span>
                </Button>
              </Link>

              <Link href="/present">
                <Button size="lg" variant="glass" className="gap-2 px-6 py-4">
                  <span>Presenter Deck</span>
                </Button>
              </Link>
            </div>

            {/* Executive Proof Points Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-white/10 max-w-4xl mx-auto">
              {siteData.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-[#9FB3D1] font-medium mt-1 uppercase tracking-wider font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT ABHIYANTA HAS MADE (Innovation Spotlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-[#00B8F5] tracking-wider uppercase mb-2 block">
            PROVEN ENTERPRISE IMPACT
          </span>
          <h2 className="text-h2 font-bold text-white mb-4">
            Engineering Rigor for High-Volume Global SAP Landscapes
          </h2>
          <p className="text-xs sm:text-sm text-[#9FB3D1] leading-relaxed">
            Abhiyanta India Solutions bridges mission-critical SAP ERP transactions with modern cloud native intelligence, delivering sub-second logistics reconciliation, autonomous financial matching, and upgrade-safe Clean Core compliance.
          </p>
        </div>

        {/* 3 Strategic Pillars Spotlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassPanel glowColor="#0070F2" className="p-8">
            <div className="w-12 h-12 rounded-xl bg-[#0070F2]/20 border border-[#0070F2]/40 text-[#00B8F5] flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Autonomous AI & Joule Agents
            </h3>
            <p className="text-xs text-[#9FB3D1] leading-relaxed mb-6">
              Multi-turn agent skills integrated into SAP Build Work Zone. Computer vision OCR extracts tare/gross weighbridge slips with 99.2% accuracy, triggering touchless MIRO postings.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#3DDC97]">
              <CheckCircle2 className="w-4 h-4" />
              <span>99.2% Extraction Accuracy</span>
            </div>
          </GlassPanel>

          <GlassPanel glowColor="#00B8F5" className="p-8">
            <div className="w-12 h-12 rounded-xl bg-[#00B8F5]/20 border border-[#00B8F5]/40 text-[#00B8F5] flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              100% Clean Core Extensibility
            </h3>
            <p className="text-xs text-[#9FB3D1] leading-relaxed mb-6">
              Side-by-side decoupled cloud applications on SAP BTP Cloud Foundry. Zero custom tables in S/4HANA core, ensuring zero upgrade lock-in and seamless cloud migration cycles.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#3DDC97]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero Core ERP Modifications</span>
            </div>
          </GlassPanel>

          <GlassPanel glowColor="#F0AB00" className="p-8">
            <div className="w-12 h-12 rounded-xl bg-[#F0AB00]/20 border border-[#F0AB00]/40 text-[#F0AB00] flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              HanaMorph Modernization
            </h3>
            <p className="text-xs text-[#9FB3D1] leading-relaxed mb-6">
              1:1 architectural and visual lineage parity transforming legacy HANA calculation views into modern SAP Datasphere graphical DAG models with zero business disruption.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#3DDC97]">
              <CheckCircle2 className="w-4 h-4" />
              <span>95% Faster Migration Cycle</span>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* 3. DIRECT ACTION BANNER TO 5 PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <GlassPanel glowColor="#0070F2" className="p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-mono text-[#00B8F5] uppercase tracking-wider font-bold">
              READY TO EXPLORE THE PORTFOLIO?
            </span>
            <h2 className="text-h2 font-bold text-white">
              Inspect the 5 Enterprise Architecture Pillars
            </h2>
            <p className="text-xs sm:text-sm text-[#9FB3D1] leading-relaxed">
              Step inside our structured experience centre to review live applications, 3-tier topologies, interactive 8-card walkthroughs, or book an executive sales demonstration.
            </p>
            <div className="pt-2">
              <Link href="/pillars">
                <Button size="lg" variant="primary" className="gap-2.5 px-8 py-3.5">
                  <span>Enter the 5 Pillars Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
