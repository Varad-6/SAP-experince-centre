'use client';

import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Mail, CheckCircle2, Copy, X, Calendar, Building, User, Sparkles } from 'lucide-react';

export interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  solutionTitle: string;
  slug: string;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({
  isOpen,
  onClose,
  solutionTitle,
  slug,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recipient = 'sales@abhiyanta.com';
    const subject = encodeURIComponent(`[Enterprise Demo Request] ${solutionTitle} — ${company || 'Client'}`);
    const bodyContent = `Hello Abhiyanta India Solutions (AIS) Sales Team,\n\nI would like to schedule an executive demonstration and architecture deep dive for ${solutionTitle}.\n\n--- Client Details ---\nName: ${name}\nCorporate Email: ${email}\nCompany / Organization: ${company}\nPreferred Date/Time: ${preferredDate || 'Earliest available'}\n\nProject Scope & Business Requirements:\n${notes || 'Interested in exploring Clean Core architecture and production deployment.'}\n\nGenerated via AIS Experience Centre (https://sap.abhiyanta.com)`;

    // Copy to clipboard for easy fallback
    navigator.clipboard.writeText(bodyContent).then(() => {
      setCopied(true);
    }).catch(() => {});

    // Open mail client
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <GlassPanel glowColor="#0070F2" className="max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-[#9FB3D1] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#00B8F5]">
              <Mail className="w-4 h-4" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase">
                AIS SALES ENGAGEMENT DESK
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Book an Executive Demo
            </h3>
            <p className="text-xs text-[#9FB3D1] mb-6">
              Connect directly with our Lead Architects for a tailored briefing on{' '}
              <span className="text-white font-medium">{solutionTitle}</span>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#9FB3D1] mb-1">
                  FULL NAME *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9FB3D1]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Michael Vance"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#060D1D]/90 border border-white/15 text-white text-xs placeholder:text-white/30 focus:border-[#00B8F5] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#9FB3D1] mb-1">
                    WORK EMAIL *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9FB3D1]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#060D1D]/90 border border-white/15 text-white text-xs placeholder:text-white/30 focus:border-[#00B8F5] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#9FB3D1] mb-1">
                    COMPANY *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9FB3D1]" />
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Novartis / Tata"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#060D1D]/90 border border-white/15 text-white text-xs placeholder:text-white/30 focus:border-[#00B8F5] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#9FB3D1] mb-1">
                  PREFERRED DATE & TIME (OPTIONAL)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9FB3D1]" />
                  <input
                    type="text"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    placeholder="e.g. Next Tuesday at 2:00 PM IST"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#060D1D]/90 border border-white/15 text-white text-xs placeholder:text-white/30 focus:border-[#00B8F5] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#9FB3D1] mb-1">
                  SPECIFIC REQUIREMENTS / NOTES (OPTIONAL)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Outline your current S/4HANA version, integration challenges, or key metrics..."
                  className="w-full p-3 rounded-xl bg-[#060D1D]/90 border border-white/15 text-white text-xs placeholder:text-white/30 focus:border-[#00B8F5] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button variant="glass" size="md" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit" className="gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Send Demo Request to Sales</span>
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#3DDC97]/20 border border-[#3DDC97]/40 flex items-center justify-center mx-auto text-[#3DDC97]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">
              Demo Request Dispatched!
            </h3>

            <p className="text-xs text-[#9FB3D1] max-w-sm mx-auto leading-relaxed">
              Your email client was opened with the pre-formatted briefing request to{' '}
              <span className="text-[#00B8F5] font-mono">sales@abhiyanta.com</span>.
              Our Lead Architect team will respond within 2 business hours.
            </p>

            {copied && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3DDC97]/15 border border-[#3DDC97]/30 text-xs font-mono text-[#3DDC97]">
                <Copy className="w-3.5 h-3.5" />
                <span>Briefing copied to clipboard</span>
              </div>
            )}

            <div className="pt-4">
              <Button variant="primary" size="md" onClick={onClose}>
                Return to Solution
              </Button>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
};
