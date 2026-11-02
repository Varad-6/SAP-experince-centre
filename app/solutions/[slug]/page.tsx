import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import solutionsData from '@/data/solutions.json';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Database,
  ArrowRight
} from 'lucide-react';

interface SolutionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return solutionsData.map((sol) => ({
    slug: sol.slug,
  }));
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const solution = solutionsData.find((s) => s.slug === slug);

  if (!solution) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Top Breadcrumb & Hero */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sap-blue mb-6 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Solutions Catalog</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-sap-blue uppercase tracking-wider">
                  {solution.pillarName}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {solution.status}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">Lead: {solution.lead}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {solution.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mt-2 max-w-3xl">
                {solution.tagline}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/solution/${solution.slug}/demo`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0070F2] to-[#00B8F5] text-white shadow-lg shadow-[#0070F2]/30 hover:brightness-110 transition"
              >
                <span>Launch 3D Interactive Walkthrough</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {solution.demoUrl && (
                <a
                  href={solution.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#102A5C]/40 border border-white/10 text-white hover:bg-[#102A5C]/70 transition"
                >
                  <span>Open Live Application</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main 8-Column Area */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 1. USE CASE & OVERVIEW */}
            <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                Enterprise Use Case Overview
              </h2>
              <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {solution.useCase}
              </p>

              {/* Live production image spotlight if PODZO */}
              {solution.slug === 'podzo' && (
                <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span>LIVE SAP BUILD WORK ZONE PRODUCTION RUNTIME (EU30)</span>
                    <span className="text-emerald-600 font-bold">ONLINE</span>
                  </div>
                  <img
                    src="/media/podzo_live_production_screen.png"
                    alt="PODZO Control Tower Live Screen"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </section>

            {/* 2. PROBLEM & SOLUTION DUAL CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-red-100 dark:border-red-950/50 shadow-sm">
                <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3">
                  The Business Problem
                </div>
                <ul className="space-y-3">
                  {solution.problem.map((prob, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      <span>{prob}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solution */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-950/50 shadow-sm">
                <div className="text-xs font-bold text-sap-blue uppercase tracking-wider mb-3">
                  Intelligent Solution Capabilities
                </div>
                <ul className="space-y-3">
                  {solution.solution.map((sol, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sap-blue flex-shrink-0 mt-0.5" />
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. HOW IT WORKS (3-STEP SEQUENTIAL FLOW) */}
            <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                End-to-End Operational Workflow Architecture
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {solution.flow.map((st, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-sap-blue text-white font-bold text-xs flex items-center justify-center mb-3 shadow-sm">
                        {st.step}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                        {st.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right 4-Column Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* HERO KPI CARD */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 border border-emerald-200 dark:border-emerald-900/50 shadow-sm">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                MEASURED IMPACT
              </span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                {solution.heroKpi.value}
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mt-1">
                {solution.heroKpi.label}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {solution.heroKpi.description}
              </p>
            </div>

            {/* S/4HANA TOUCHPOINTS */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                SAP S/4HANA Touchpoints
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {solution.sapTouchpoints.map((tp, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900"
                  >
                    {tp}
                  </span>
                ))}
              </div>
            </div>

            {/* TECH STACK CHIPS */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {solution.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* PREREQUISITES */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Deployment Prerequisites
              </h3>
              <ul className="space-y-2">
                {solution.prerequisites.map((req, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-sap-blue flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
