'use client';

import React from 'react';
import { X, Layers, Cpu, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface ArchitectureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  solutionTitle: string;
  sapComponents?: string[];
}

export const ArchitectureDialog: React.FC<ArchitectureDialogProps> = ({
  isOpen,
  onClose,
  solutionTitle,
  sapComponents = [
    'SAP BTP Cloud Foundry',
    'SAP S/4HANA Cloud',
    'SAP Event Mesh',
    'SAP HANA Cloud',
    'SAP AI Core',
  ],
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="card w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7ED] text-[var(--ok)] mb-1.5">
              <ShieldCheck size={14} />
              <span>Clean Core Architecture Certified</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--navy)]">
              {solutionTitle} — Enterprise Blueprint
            </h3>
            <p className="text-xs text-[var(--text-dim)]">
              Modular 3-Tier decoupled cloud topology compliant with SAP Clean Core mandate.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3-Tier Architecture Diagram */}
        <div className="space-y-3">
          {/* Tier 1: Experience Layer */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--brand-50)] text-[var(--brand)] flex items-center justify-center shrink-0">
              <Layers size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]">
                  Tier 1: Experience &amp; UI Layer
                </h5>
                <span className="text-[10px] font-mono text-[var(--brand)] font-semibold">Decoupled</span>
              </div>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Responsive SAP Fiori Horizon UI, React 19 micro-frontends, role-based Launchpad, and mobile offline capabilities.
              </p>
            </div>
          </div>

          {/* Tier 2: SAP BTP Cloud Foundation */}
          <div className="p-4 rounded-xl bg-[var(--brand-50)]/60 border border-[var(--brand)]/30 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--brand)] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Cpu size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]">
                  Tier 2: SAP BTP Cloud Foundry &amp; AI Core
                </h5>
                <span className="text-[10px] font-mono text-[var(--brand-600)] font-semibold">Side-by-Side</span>
              </div>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Node.js CAP runtime, asynchronous Event Mesh pub/sub queuing, SAP Generative AI Hub, and automated tenant isolation.
              </p>
            </div>
          </div>

          {/* Tier 3: ERP Clean Core */}
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E6F7ED] text-[var(--ok)] flex items-center justify-center shrink-0">
              <Database size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]">
                  Tier 3: SAP S/4HANA Clean Core System of Record
                </h5>
                <span className="text-[10px] font-mono text-[var(--ok)] font-semibold">Touchless ERP</span>
              </div>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Released CDS Views, standard OData v4 APIs, and touchless transaction settlement without modifying ERP standard tables.
              </p>
            </div>
          </div>
        </div>

        {/* Bound Components Chips */}
        <div>
          <h6 className="text-[11px] font-bold text-[var(--navy)] uppercase tracking-wide mb-2">
            Provisioned SAP Cloud Services:
          </h6>
          <div className="flex flex-wrap gap-2">
            {sapComponents.map((comp, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--surface)] text-[var(--navy)] border border-[var(--border)] shadow-2xs"
              >
                <CheckCircle2 size={12} className="text-[var(--ok)]" />
                <span>{comp}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-primary h-10 px-6 text-xs"
          >
            <span>Close Blueprint</span>
          </button>
        </div>
      </div>
    </div>
  );
};
