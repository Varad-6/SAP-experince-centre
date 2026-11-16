'use client';

import React from 'react';
import Link from 'next/link';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { Play, FileText, CheckCircle2 } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const CtaCard: React.FC<{ card: CardData; slug: string }> = ({ card, slug }) => {
  const actions = card.actions || [];

  return (
    <div className="space-y-6 text-center py-4">
      <div className="w-14 h-14 rounded-full bg-[#E6F7ED] border border-[#A6E9BD] flex items-center justify-center mx-auto text-[var(--ok)]">
        <CheckCircle2 className="w-7 h-7" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-[var(--navy)] mb-2">
          Architecture Walkthrough Complete
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-dim)] max-w-md mx-auto leading-relaxed">
          You have reviewed the key functional stages, Clean Core pipeline, and SAP BTP components. Advance to the closing slide to access live demo credentials and enterprise contact.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {actions.map((act, i) => {
          if (act.type === 'demo') {
            return (
              <a
                key={i}
                href="https://sap-btp-ais-d0a7p7v8.launchpad.cfapps.eu30.hana.ondemand.com/site?siteId=a70e83a1-241a-44ba-9f8e-5a760483a8d2#podzone-dispatch"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{act.label}</span>
              </a>
            );
          } else if (act.type === 'prereq') {
            return (
              <Link
                key={i}
                href="/prerequisites"
                className="btn btn-secondary inline-flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{act.label}</span>
              </Link>
            );
          } else {
            return (
              <Link
                key={i}
                href="/architecture"
                className="btn btn-secondary inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{act.label}</span>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};
