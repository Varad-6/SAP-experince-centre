'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  CheckCircle2,
  ArrowUp,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { ArchitectureData, TierData } from '@/lib/schema';

export interface ArchitectureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  solutionTitle: string;
  architecture?: ArchitectureData;
}

const STEP_COLORS = ['#0070F2', '#19C3A6', '#188918', '#8B5CF6'];

export const ArchitectureDialog: React.FC<ArchitectureDialogProps> = ({
  isOpen,
  onClose,
  solutionTitle,
  architecture,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll and handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomOpen) {
          setIsZoomOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, isZoomOpen, onClose]);

  if (!isOpen || !architecture) return null;

  const renderIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'cpu':
        return <Cpu size={20} />;
      case 'database':
        return <Database size={20} />;
      case 'layers':
      default:
        return <Layers size={20} />;
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="blueprint-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-[#0A1F44]/45 backdrop-blur-xs animate-fadeIn"
        onClick={onClose}
      >
        <div
          ref={dialogRef}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-[720px] h-[100dvh] sm:h-auto sm:max-h-[calc(100dvh-48px)] bg-[var(--surface)] sm:border sm:border-[var(--border)] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header - Sticky on mobile */}
          <div className="sticky top-0 z-10 bg-[var(--surface)] border-b border-[var(--border)] p-4 sm:p-6 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--brand-50)] text-[var(--brand-600)] mb-1.5 border border-[var(--brand)]/20">
                  <ShieldCheck size={14} className="text-[var(--brand)]" />
                  <span>{architecture.badge || 'Clean Core Architecture Certified'}</span>
                </div>
                <h2 id="blueprint-title" className="text-lg sm:text-xl font-bold text-[var(--navy)] leading-tight">
                  {architecture.title || `${solutionTitle} — Enterprise Blueprint`}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-dim)] mt-1">
                  {architecture.subtitle || 'Modular 3-Tier decoupled cloud topology compliant with SAP Clean Core mandate.'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-2 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Optional Summary Info Strip */}
            {architecture.summary && (
              <div className="mt-3 p-3 rounded-xl bg-[var(--brand-50)]/70 border border-[var(--brand)]/20 text-xs sm:text-sm text-[var(--navy)] leading-relaxed font-medium">
                {architecture.summary}
              </div>
            )}
          </div>

          {/* Body Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Tiers with Centered Up-Arrows */}
            {architecture.tiers.map((tier: TierData, idx: number) => {
              const isBlue = tier.tint === 'blue';
              return (
                <React.Fragment key={tier.tier || idx}>
                  {idx > 0 && (
                    <div
                      aria-hidden="true"
                      className="flex justify-center py-1 select-none"
                    >
                      <ArrowUp className="w-6 h-6 text-[var(--brand)] opacity-60" />
                    </div>
                  )}

                  <div
                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      isBlue
                        ? 'bg-[var(--brand-50)]/50 border-[var(--brand)]/30 shadow-2xs'
                        : 'bg-[var(--surface)] border-[var(--border)] shadow-2xs'
                    }`}
                  >
                    {/* Tier Header */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${
                            isBlue
                              ? 'bg-[var(--brand)] text-white'
                              : 'bg-[var(--surface-2)] text-[var(--brand)] border border-[var(--border)]'
                          }`}
                        >
                          {renderIcon(tier.icon)}
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.04em] text-[var(--navy)]">
                          {tier.name}
                        </h3>
                      </div>
                      {tier.tag && (
                        <span
                          className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                            isBlue
                              ? 'text-[var(--brand-600)] bg-white/80 border border-[var(--brand)]/20'
                              : 'text-[var(--ok)] bg-[#E6F7ED] border border-[#A6E9BD]'
                          }`}
                        >
                          {tier.tag}
                        </span>
                      )}
                    </div>

                    {/* Tier Body - Direct text fallback */}
                    {tier.text && (
                      <p className="text-sm text-[var(--text-dim)] leading-relaxed mt-1">
                        {tier.text}
                      </p>
                    )}

                    {/* Tier 1 / General Items (2-column on desktop, single on mobile) */}
                    {tier.items && tier.tier === 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        {tier.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="p-3 rounded-lg bg-[var(--surface)]/90 border border-[var(--border)]/70 shadow-2xs"
                          >
                            <div className="text-sm font-semibold text-[var(--navy)] mb-1">
                              {item.name}
                            </div>
                            {item.text && (
                              <div className="text-xs sm:text-sm text-[var(--text-dim)] leading-relaxed">
                                {item.text}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tier 2: Components row + Lifecycle Stepper */}
                    {tier.tier === 2 && (
                      <div className="space-y-4 mt-3">
                        {/* Components chips */}
                        {tier.components && tier.components.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
                            {tier.components.map((comp, compIdx) => (
                              <span
                                key={compIdx}
                                className="h-7 px-3 inline-flex items-center rounded-full text-xs font-semibold bg-[var(--surface)] text-[var(--navy)] border border-[var(--border)] shadow-2xs"
                              >
                                {comp}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Lifecycle title & Stepper */}
                        {tier.lifecycle && tier.lifecycle.length > 0 && (
                          <div>
                            {tier.lifecycleTitle && (
                              <h4 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider mb-2.5">
                                {tier.lifecycleTitle}
                              </h4>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                              {tier.lifecycle.map((step, sIdx) => {
                                const stepColor = STEP_COLORS[sIdx % STEP_COLORS.length];
                                return (
                                  <div
                                    key={step.step}
                                    className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col relative shadow-2xs"
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                                        style={{ backgroundColor: stepColor }}
                                      >
                                        {step.step}
                                      </div>
                                      <div className="text-sm font-semibold text-[var(--navy)] leading-tight">
                                        {step.title}
                                      </div>
                                    </div>
                                    <ul className="text-xs sm:text-[13px] text-[var(--text-dim)] space-y-1 list-disc list-inside leading-relaxed">
                                      {step.bullets.map((b, bIdx) => (
                                        <li key={bIdx} className="pl-1">
                                          {b}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tier 3: 3-column pill grid */}
                    {tier.items && tier.tier === 3 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                        {tier.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm font-medium text-[var(--navy)] flex items-center shadow-2xs"
                          >
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            {/* Bound Components Chips */}
            {architecture.chips && architecture.chips.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wide mb-2.5">
                  {architecture.chipsTitle || 'PROVISIONED SAP CLOUD SERVICES:'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {architecture.chips.map((comp, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--surface)] text-[var(--navy)] border border-[var(--border)] shadow-2xs"
                    >
                      <CheckCircle2 size={13} className="text-[var(--ok)] shrink-0" />
                      <span>{comp}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Benefits */}
            {architecture.benefits && architecture.benefits.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wide mb-2.5">
                  {architecture.benefitsTitle || 'KEY BENEFITS:'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {architecture.benefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#E6F7ED] text-[var(--ok)] border border-[#A6E9BD] shadow-2xs"
                    >
                      <Sparkles size={13} className="text-[var(--ok)] shrink-0" />
                      <span>{benefit}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer - Sticky on mobile */}
          <div className="sticky bottom-0 z-10 bg-[var(--surface)] border-t border-[var(--border)] p-4 sm:p-6 pt-3 flex items-center justify-end gap-3">
            {architecture.diagram && (
              <button
                type="button"
                onClick={() => {
                  setZoomScale(1);
                  setIsZoomOpen(true);
                }}
                className="btn btn-secondary h-10 px-4 text-xs font-semibold inline-flex items-center gap-2"
              >
                <Maximize2 size={14} />
                <span>View full diagram</span>
              </button>
            )}

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="btn btn-primary h-10 px-6 text-xs font-semibold shadow-sm"
            >
              <span>Close Blueprint</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Diagram Zoom / Pan Modal */}
      {isZoomOpen && architecture.diagram && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ zIndex: 70 }}
          className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex flex-col animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* Zoom Modal Toolbar */}
          <div
            className="flex items-center justify-between p-4 bg-black/50 text-white border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-semibold truncate pr-4">
              {architecture.title} — Full Topology Diagram
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomScale((s) => Math.max(0.5, s - 0.25))}
                className="p-2 rounded bg-white/15 hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(1)}
                className="p-2 rounded bg-white/15 hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={() => setZoomScale((s) => Math.min(3, s + 0.25))}
                className="p-2 rounded bg-white/15 hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="p-2 rounded bg-white/15 hover:bg-white/25 active:scale-95 transition-all ml-2 cursor-pointer"
                title="Close Viewer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Diagram Container */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={architecture.diagram}
              alt={architecture.title}
              style={{ transform: `scale(${zoomScale})`, transition: 'transform 0.2s ease-out' }}
              className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl cursor-grab active:cursor-grabbing"
            />
          </div>
        </div>
      )}
    </>
  );
};
