'use client';

import React, { useState } from 'react';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import {
  CheckCircle2,
  Key,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const WorkflowCard: React.FC<{ card: CardData }> = ({ card }) => {
  const [copied, setCopied] = useState(false);
  const steps = card.steps || [];

  // If explicit steps are provided, render standard timeline
  if (steps.length > 0) {
    return (
      <div className="space-y-3.5">
        {steps.map((st) => (
          <div
            key={st.step}
            className="p-4 sm:p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--brand-50)] text-[var(--brand-600)] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                0{st.step}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--navy)] mb-0.5">{st.title}</h4>
                {(() => {
                  const cleanDesc =
                    st.desc && st.desc.startsWith(st.title)
                      ? st.desc.slice(st.title.length).replace(/^[\s:–—-]+/, '').trim()
                      : st.desc;
                  return cleanDesc && cleanDesc !== st.title ? (
                    <p className="text-xs text-[var(--text-dim)] leading-relaxed">{cleanDesc}</p>
                  ) : null;
                })()}
              </div>
            </div>

            <div className="shrink-0 px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-xs font-mono font-semibold text-[var(--navy)] shadow-xs self-start sm:self-center">
              {st.sapAction}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback: Check if slide context relates to Credentials, Service Keys, Tokens or JSON
  const descriptionText =
    typeof card.description === 'string'
      ? card.description
      : (card.description as any)?.plain || '';

  const rawText = (
    (card.title || '') +
    ' ' +
    (card.subtitle || '') +
    ' ' +
    (card.caption || '') +
    ' ' +
    descriptionText
  ).toLowerCase();

  const isCredentialOrJson =
    rawText.includes('credential') ||
    rawText.includes('service key') ||
    rawText.includes('json') ||
    rawText.includes('token') ||
    rawText.includes('auth') ||
    rawText.includes('secret') ||
    rawText.includes('binding');

  // Extract curated bullet points from card description
  const descObj = typeof card.description === 'object' ? (card.description as any) : null;
  const blocks = descObj?.blocks || [];
  const extractedBullets: string[] = blocks.flatMap((b: any) => b.items || []);
  const bullets =
    extractedBullets.length > 0
      ? extractedBullets
      : descriptionText.split('\n\n').filter(Boolean);

  const jsonSnippet = `{
  "clientid": "sb-aicore-prod!b4129|aicore!b23",
  "clientsecret": "••••••••••••••••••••••••••••••••",
  "serviceurls": {
    "AI_API_URL": "https://api.ai.eu10.model.cloud.sap/v2"
  },
  "appname": "sap-btp-vibe-coding-runtime",
  "identityzone": "eu10-ent-prod",
  "url": "https://eu10-ent-prod.authentication.eu10.hana.ondemand.com",
  "status": "BINDING_ACTIVE"
}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isCredentialOrJson) {
    return (
      <div className="space-y-4">
        {/* Terminal Header */}
        <div className="rounded-xl border border-[var(--border)] bg-[#0d131f] text-slate-100 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#141b2d] border-b border-slate-800 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-slate-200">SAP AI Core Service Key (Masked JSON)</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active Binding
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* JSON Body */}
          <pre className="p-4 text-xs font-mono text-slate-200 leading-relaxed overflow-x-auto selection:bg-cyan-500/30">
            <code>
              {`{\n`}
              <span className="text-slate-400">{`  "clientid"`}</span>: <span className="text-emerald-400">{`"sb-aicore-prod!b4129|aicore!b23"`}</span>,{`\n`}
              <span className="text-slate-400">{`  "clientsecret"`}</span>: <span className="text-amber-300">{`"••••••••••••••••••••••••••••••••"`}</span>,{`\n`}
              <span className="text-slate-400">{`  "serviceurls"`}</span>: {`{\n`}
              <span className="text-slate-400">{`    "AI_API_URL"`}</span>: <span className="text-cyan-300">{`"https://api.ai.eu10.model.cloud.sap/v2"`}</span>{`\n`}
              {`  },\n`}
              <span className="text-slate-400">{`  "appname"`}</span>: <span className="text-emerald-400">{`"sap-btp-vibe-coding-runtime"`}</span>,{`\n`}
              <span className="text-slate-400">{`  "identityzone"`}</span>: <span className="text-purple-300">{`"eu10-ent-prod"`}</span>,{`\n`}
              <span className="text-slate-400">{`  "status"`}</span>: <span className="text-emerald-400">{`"BINDING_ACTIVE"`}</span>{`\n`}
              {`}`}
            </code>
          </pre>
        </div>

        {/* Security & Clean Core Callout Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[var(--ok)] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[var(--navy)]">Decoupled Security Vault</div>
              <div className="text-[11px] text-[var(--text-dim)] leading-tight mt-0.5">
                Zero secrets persisted in S/4HANA core; credentials managed strictly via SAP BTP Credential Store.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-3">
            <Cpu className="w-4 h-4 text-[var(--brand)] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[var(--navy)]">Generative AI Hub Target</div>
              <div className="text-[11px] text-[var(--text-dim)] leading-tight mt-0.5">
                Instant authentication token issuance for enterprise LLM endpoints and orchestration pipelines.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // General Architecture & Process Blueprint
  return (
    <div className="space-y-4">
      {/* 3-Stage Process Pipeline */}
      <div className="space-y-2.5">
        {bullets.map((b: string, i: number) => (
          <div
            key={i}
            className="p-3.5 sm:p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-start justify-between gap-3 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[var(--brand-50)] text-[var(--brand-600)] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                0{i + 1}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[var(--navy)] font-medium leading-relaxed">
                  {b}
                </p>
              </div>
            </div>

            <div className="shrink-0 px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[10px] font-mono font-semibold text-[var(--brand-600)] uppercase">
              Phase 0{i + 1} Validated
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Telemetry Summary Bar */}
      <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div>
          <div className="text-[10px] font-semibold text-[var(--text-dim)] uppercase">Tier</div>
          <div className="text-xs font-bold text-[var(--navy)] mt-0.5">Side-by-Side BTP</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-[var(--text-dim)] uppercase">Core Drift</div>
          <div className="text-xs font-bold text-[var(--ok)] mt-0.5">0% Clean Core</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-[var(--text-dim)] uppercase">Protocol</div>
          <div className="text-xs font-bold text-[var(--brand)] mt-0.5">OData v4 / Event Mesh</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-[var(--text-dim)] uppercase">SLA Target</div>
          <div className="text-xs font-bold text-[var(--navy)] mt-0.5">99.95% Availability</div>
        </div>
      </div>
    </div>
  );
};
