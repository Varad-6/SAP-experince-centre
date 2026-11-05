'use client';

import React, { useEffect } from 'react';
import { Mail, Phone, X, UserCheck } from 'lucide-react';
import siteData from '@/content/site.json';

export interface ContactData {
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: ContactData | null;
  solutionTitle?: string;
}

export const ContactDialog: React.FC<ContactDialogProps> = ({
  isOpen,
  onClose,
  contact,
  solutionTitle,
}) => {
  const activeContact = contact || siteData.defaultContact;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(10,31,68,0.45)] animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card w-full max-w-md p-6 sm:p-8 relative bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-[var(--shadow)] rounded-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dialog Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[var(--brand-50)] text-[var(--brand)] flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--navy)] leading-tight">
              Direct Sales & Enterprise Contact
            </h3>
            {solutionTitle && (
              <p className="text-xs text-[var(--text-dim)] mt-0.5">
                Regarding: <span className="font-semibold text-[var(--text)]">{solutionTitle}</span>
              </p>
            )}
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] mb-6 space-y-3">
          <div>
            <h4 className="text-base font-bold text-[var(--navy)]">
              {activeContact.name}
            </h4>
            <p className="text-xs text-[var(--text-dim)] font-medium">
              {activeContact.role}
            </p>
          </div>

          <div className="pt-2 border-t border-[var(--border)] space-y-2.5 text-sm">
            <a
              href={`mailto:${activeContact.email}?subject=${encodeURIComponent(
                solutionTitle ? `[AIS Architecture] Inquiry: ${solutionTitle}` : '[AIS Architecture] Enterprise Inquiry'
              )}`}
              className="flex items-center gap-2.5 text-[var(--brand)] hover:underline font-semibold break-all"
            >
              <Mail className="w-4 h-4 shrink-0 text-[var(--brand)]" />
              <span>{activeContact.email}</span>
            </a>

            {activeContact.phone && (
              <a
                href={`tel:${activeContact.phone}`}
                className="flex items-center gap-2.5 text-[var(--text)] hover:text-[var(--brand)] font-semibold"
              >
                <Phone className="w-4 h-4 shrink-0 text-[var(--text-dim)]" />
                <span>{activeContact.phone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Direct Action */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary text-sm px-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
