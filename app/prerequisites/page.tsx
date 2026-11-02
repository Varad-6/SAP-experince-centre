'use client';

import React, { useState } from 'react';
import solutionsData from '@/data/solutions.json';
import { CheckSquare, Square, Printer, Share2, ShieldCheck, Layers, Sparkles } from 'lucide-react';

export default function PrerequisitesPage() {
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>(
    solutionsData.map(s => s.slug) // by default all selected
  );

  const toggleSolution = (slug: string) => {
    if (selectedSolutions.includes(slug)) {
      setSelectedSolutions(selectedSolutions.filter(s => s !== slug));
    } else {
      setSelectedSolutions([...selectedSolutions, slug]);
    }
  };

  const selectAll = () => setSelectedSolutions(solutionsData.map(s => s.slug));
  const deselectAll = () => setSelectedSolutions([]);

  // Calculate consolidated prerequisites
  const activePrereqs = Array.from(
    new Set(
      solutionsData
        .filter(s => selectedSolutions.includes(s.slug))
        .flatMap(s => s.prerequisites)
    )
  ).sort();

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-sap-blue mb-4">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>DEPLOYMENT READINESS TOOL</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Consolidated Prerequisites Planner
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mt-2 max-w-2xl">
                Tick the solutions your enterprise intends to deploy to automatically generate a consolidated, 
                deduplicated bill of SAP BTP services, entitlements, and ERP prerequisites.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Checklist</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Solution Selector (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Select Solutions ({selectedSolutions.length}/{solutionsData.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-[11px] font-semibold text-sap-blue hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={deselectAll}
                  className="text-[11px] font-semibold text-slate-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {solutionsData.map((sol) => {
                const isChecked = selectedSolutions.includes(sol.slug);
                return (
                  <div
                    key={sol.slug}
                    onClick={() => toggleSolution(sol.slug)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {sol.name}
                      </h4>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {sol.pillarName}
                      </div>
                    </div>
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-sap-blue flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consolidated Bill of Prerequisites (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Consolidated Bill of Prerequisites
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Total required technical services and entitlements: <span className="font-bold text-sap-blue">{activePrereqs.length}</span>
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Ready to Provision
                </div>
              </div>

              {activePrereqs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Please select at least one solution on the left to see required prerequisites.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePrereqs.map((req, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {req}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Enterprise Subaccount Requirement
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Implementation Note */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-700 dark:text-slate-200">Advisory Note:</span> All solutions adhere strictly to SAP BTP Cloud Foundry enterprise quotas. Service instances and bindings can be deployed automatically via our standard CI/CD deployment scripts in under 48 hours.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
