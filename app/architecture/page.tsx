'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Layers, 
  Database, 
  Cpu, 
  LayoutDashboard, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function ArchitecturePage() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const tiers = [
    {
      tierNumber: 3,
      name: 'CONSUMPTION & BOARDROOM LAYER',
      color: 'border-amber-400 bg-amber-500/5',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      description: 'Zero-install executive and operational user interfaces embedded in SAP corporate shells.',
      nodes: [
        { title: 'SAP Build Work Zone Header', desc: 'Enterprise shell hosting persistent floating SAP Joule copilot', badge: 'Shell UI' },
        { title: 'SAP Joule Conversational UI', desc: 'Natural language operational copilot executing O2C siding dispatches', badge: 'Copilot' },
        { title: '9 SAP Analytics Cloud Stories', desc: 'Live operational cockpits across PP, QM, PM, SD, and FI', badge: 'SAC Stories' },
        { title: 'Transporter Portal UI5', desc: 'External carrier self-service portal for siding slot bookings', badge: 'Fiori Web' }
      ]
    },
    {
      tierNumber: 2,
      name: 'BTP CLOUD FOUNDRY & INTELLIGENCE RUNTIME',
      color: 'border-blue-500 bg-blue-500/5',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      description: 'Stateless elastic microservices orchestrating AI reasoning and business logic.',
      nodes: [
        { title: 'SAP AI Core GenAI Hub', desc: 'Foundation models (GPT-4o, Claude 3.5) with zero prompt leakage', badge: 'LLM Gateway' },
        { title: 'Model Context Protocol (MCP) Server', desc: 'Standardized tools connecting AI agents to live SAP ADT REST APIs', badge: 'MCP Protocol' },
        { title: 'HanaMorph DAG Compiler', desc: 'Autonomous AST engine compiling Calculation Views into CSN 2.0', badge: 'Compiler' },
        { title: 'CAP Microservices (podzone-srv)', desc: 'Containerized Node.js runtimes handling business validation', badge: 'Cloud Foundry' },
        { title: 'Destination Service & mTLS', desc: 'Secure OAuth2 JWT Bearer token tunnel to S/4HANA core', badge: 'Security' }
      ]
    },
    {
      tierNumber: 1,
      name: 'ENTERPRISE DATA & RECORD OF TRUTH',
      color: 'border-emerald-500 bg-emerald-500/5',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      description: 'Governed single source of operational and analytical truth.',
      nodes: [
        { title: 'SAP S/4HANA Cloud & On-Prem', desc: 'Core transactions (SD, MM, PP, QM, PM, FI-CO) and standard BAPIs', badge: 'Transactional Core' },
        { title: 'SAP Datasphere Reusable Data Products', desc: 'Harmonized analytical data models with direct live In-A federation', badge: 'Semantic Layer' },
        { title: 'SAP HANA Cloud In-Memory DB', desc: 'High-performance columnar database hosting active tenant data', badge: 'Database' },
        { title: 'SAP ADT REST Endpoints', desc: 'Secure developer interface for program reading, dumps, and transports', badge: 'Developer API' }
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-sap-blue mb-4">
            <Compass className="w-3.5 h-3.5 text-sap-blue" />
            <span>UNIFIED SYSTEM TOPOLOGY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            End-to-End Enterprise System Topology
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mt-2 max-w-3xl">
            A zero-brittle integration paradigm enforcing multi-tier separation between transactional record of truth, 
            Cloud Foundry intelligence microservices, and boardroom consumption.
          </p>
        </div>
      </section>

      {/* Tiers Visual Topology */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="space-y-8">
          {tiers.map((tier) => (
            <div
              key={tier.tierNumber}
              className={`p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 ${tier.color} shadow-sm transition-all`}
            >
              {/* Tier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider ${tier.badgeColor}`}>
                    TIER {tier.tierNumber}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {tier.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {tier.description}
                </p>
              </div>

              {/* Node Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tier.nodes.map((node, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-sap-blue transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                        {node.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                      {node.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {node.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Security Box */}
        <div className="mt-8 p-6 rounded-2xl bg-blue-50/80 dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-sap-blue flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Zero-Direct-Database-Write Protocol
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Every operation executed by AI agents or user requests passes strictly through authenticated Cloud Foundry microservices 
              with OAuth2 JWT Bearer tokens. SAP standard BAPIs and business validation routines are executed natively on SAP S/4HANA, 
              guaranteeing zero data corruption and 100% audit compliance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
