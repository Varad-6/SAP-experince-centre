'use client';

import React from 'react';
import Link from 'next/link';
import { CardSchema } from '@/lib/schema';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Play, FileText, CheckCircle2, ExternalLink } from 'lucide-react';

type CardData = z.infer<typeof CardSchema>;

export const CtaCard: React.FC<{ card: CardData; slug: string }> = ({ card, slug }) => {
  const actions = card.actions || [];

  return (
    <div className="space-y-6 text-center py-4">
      <div className="w-14 h-14 rounded-full bg-[#3DDC97]/20 border border-[#3DDC97]/40 flex items-center justify-center mx-auto text-[#3DDC97]">
        <CheckCircle2 className="w-7 h-7" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-2">
          Walkthrough Complete!
        </h3>
        <p className="text-xs text-[#9FB3D1] max-w-md mx-auto leading-relaxed">
          You have completed the architectural tour for this solution. Select an action below to engage with the live system or review deployment specs.
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
              >
                <Button variant="primary" className="gap-2">
                  <Play className="w-4 h-4 fill-current" />
                  <span>{act.label}</span>
                </Button>
              </a>
            );
          } else if (act.type === 'prereq') {
            return (
              <Link key={i} href="/prerequisites">
                <Button variant="secondary" className="gap-2">
                  <FileText className="w-4 h-4 text-[#00B8F5]" />
                  <span>{act.label}</span>
                </Button>
              </Link>
            );
          } else {
            return (
              <Link key={i} href="/architecture">
                <Button variant="glass" className="gap-2">
                  <span>{act.label}</span>
                </Button>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};
