import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import pillarsData from '@/content/pillars.json';
import solutionsData from '@/content/solutions.json';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PillarBotDock } from '@/components/PillarBotDock';

export function generateStaticParams() {
  return pillarsData.map((p) => ({ id: p.id }));
}

export default async function PillarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pillar = pillarsData.find((p) => p.id === id);

  if (!pillar) {
    notFound();
  }

  const solutions = solutionsData.filter((s) => s.pillarId === id);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[var(--bg)] text-[var(--text)] px-6 sm:px-8 py-8 sm:py-12 max-w-[1200px] mx-auto">
      {/* Top Bar / Header */}
      <div className="mb-8 pb-6 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link
            href="/pillars"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-dim)] hover:text-[var(--brand)] transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All pillars</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold"
              style={{
                backgroundColor: `${pillar.accent}15`,
                color: pillar.accent,
              }}
            >
              PILLAR {pillar.order}
            </span>
            <span className="text-xs text-[var(--text-dim)]">•</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--ok)]">
              <ShieldCheck className="w-3.5 h-3.5" /> Clean Core Certified
            </span>
          </div>

          <h1 className="text-h1 font-bold text-[var(--navy)] tracking-tight mb-2">
            {pillar.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-dim)] max-w-3xl leading-relaxed">
            {pillar.tagline}
          </p>
        </div>
      </div>

      {/* Grid of Clean Enterprise Project Cards (No Photos, No Top Chips) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {solutions.map((sol) => {
          return (
            <Link
              key={sol.slug}
              href={`/solution/${sol.slug}`}
              className="group card p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-[var(--shadow-lg)] flex flex-col justify-between h-full relative"
              style={{
                borderTop: `3px solid ${pillar.accent}`,
              }}
            >
              <div>
                {/* Title */}
                <h2 className="text-base font-bold text-[var(--navy)] group-hover:text-[var(--brand)] transition-colors mb-2 leading-snug">
                  {sol.title}
                </h2>

                {/* One-Liner */}
                <p className="text-xs sm:text-sm text-[var(--text-dim)] leading-relaxed mb-4">
                  {sol.oneLiner}
                </p>

                {/* Tags */}
                {sol.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {sol.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--brand-50)] text-[var(--brand-600)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Link aligned at bottom */}
              <div className="pt-3 border-t border-[var(--border)]/60 flex items-center justify-between text-xs font-semibold text-[var(--brand)] group-hover:translate-x-0.5 transition-transform mt-auto">
                <span>View solution architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Docked Bot */}
      <PillarBotDock />
    </div>
  );
}
