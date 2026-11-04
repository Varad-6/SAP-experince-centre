import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import pillarsData from '@/content/pillars.json';
import solutionsData from '@/content/solutions.json';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ThumbnailImage } from '@/components/ThumbnailImage';

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
      <div className="mb-8 pb-6 border-b border-[var(--border)]">
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

      {/* Grid of Project Cards (repeat(auto-fill, minmax(240px, 1fr))) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {solutions.map((sol) => {
          const isProd = sol.featured || sol.hasFullDemo;
          const thumbnailPath =
            sol.slug === 'sap-btp-vibe-coding'
              ? '/assets/apps/sap-btp-vibe-coding/01_Entitlements_Entity_Assignments.png'
              : `/assets/apps/${sol.slug}/screen-1.png`;

          return (
            <Link
              key={sol.slug}
              href={`/solution/${sol.slug}`}
              className="group card block overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow)] flex flex-col justify-between"
            >
              <div>
                {/* 16:9 Thumbnail */}
                <div className="relative aspect-video w-full bg-[var(--surface-2)] overflow-hidden border-b border-[var(--border)] flex items-center justify-center">
                  <ThumbnailImage
                    src={thumbnailPath}
                    alt={sol.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {sol.featured && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--brand)] text-white shadow-sm">
                      FLAGSHIP
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5">
                  {/* Status & ROI Chips */}
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isProd
                          ? 'bg-[#E6F7ED] text-[var(--ok)]'
                          : 'bg-[var(--surface-2)] text-[var(--text-dim)]'
                      }`}
                    >
                      {isProd ? 'Production' : 'Preview'}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--surface-2)] text-[var(--navy)] border border-[var(--border)]">
                      {sol.roiMetric}
                    </span>
                  </div>

                  {/* Title (700, 16px) */}
                  <h2 className="text-base font-bold text-[var(--navy)] group-hover:text-[var(--brand)] transition-colors mb-1.5 leading-snug">
                    {sol.title}
                  </h2>

                  {/* 2-line Tagline (text-dim, 13px) */}
                  <p className="text-[13px] text-[var(--text-dim)] leading-relaxed line-clamp-2">
                    {sol.oneLiner}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-4 sm:px-5 pb-4 pt-1 flex items-center justify-between text-xs font-semibold text-[var(--brand)]">
                <span>View details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
