/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  Share2, 
  Mail, 
  Sparkles, 
  Globe, 
  Smartphone,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { EventSettings } from '../types';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventSettings: EventSettings;
  onOpenGuestPortal: () => void;
  onTriggerToast: (message: string, type: 'success' | 'info') => void;
}

export default function ShareLinkModal({
  isOpen,
  onClose,
  eventSettings,
  onOpenGuestPortal,
  onTriggerToast
}: ShareLinkModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  // Build current shareable attendee link
  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const shareableUrl = `${baseUrl}?mode=attendee`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shareableUrl)}&color=0d1b2a`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    onTriggerToast("Attendee form share link copied to clipboard!", "success");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const emailSubject = encodeURIComponent(`Invitation to Complete Attendee Profile - ${eventSettings.eventName}`);
  const emailBodyText = `Dear Delegate,\n\nPlease complete your official delegate profile and upload your headshot for the ${eventSettings.eventName} Commemoration Directory & Roster Book.\n\nFill out your details directly using our online attendee portal:\n${shareableUrl}\n\nVenue: ${eventSettings.venueAddress}\nDates: ${eventSettings.startDate} - ${eventSettings.endDate}\n\nThank you,\n${eventSettings.organizerDetails}`;

  const handleCopyEmailText = () => {
    navigator.clipboard.writeText(emailBodyText);
    setCopiedEmail(true);
    onTriggerToast("Invitation email text copied to clipboard!", "success");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-outline-variant shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-primary text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary-light shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Share Attendee Registration Portal</h2>
              <p className="font-sans text-xs text-white/80 mt-0.5">
                Distribute this link to delegates to let them fill out their details directly.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Quick URL Box */}
          <div className="space-y-2">
            <label className="font-sans text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-secondary" />
              <span>Direct Shareable Portal URL</span>
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={shareableUrl}
                className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs font-mono text-primary outline-none select-all"
              />
              <button 
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                  copiedLink 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-secondary text-white hover:bg-secondary/90 active:scale-95'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant/80">
              When delegates click this link, they land directly on the standalone submission page without admin controls.
            </p>
          </div>

          {/* Action buttons: Test / Preview Guest View */}
          <div className="p-4 bg-surface-container-lowest border border-outline-variant/80 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="font-sans text-xs font-bold text-primary flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-secondary" />
                <span>Test & Preview Attendee Portal</span>
              </h4>
              <p className="text-[11px] text-on-surface-variant/80">
                Switch into Attendee Mode right now to experience the guest form firsthand.
              </p>
            </div>
            <button 
              onClick={() => {
                onClose();
                onOpenGuestPortal();
              }}
              className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Form</span>
            </button>
          </div>

          {/* QR Code & Mobile Scan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2 border-t border-outline-variant/60">
            <div className="flex flex-col items-center justify-center p-4 bg-white border border-outline-variant rounded-xl shadow-sm text-center">
              <img 
                src={qrCodeUrl} 
                alt="Attendee Registration QR Code" 
                className="w-36 h-36 rounded border border-outline-variant/50 p-1 bg-white"
              />
              <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-2.5 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-secondary" />
                Mobile QR Code
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="font-sans text-xs font-bold text-primary uppercase tracking-wider">Sharing Options</h4>
              
              <a 
                href={`mailto:?subject=${emailSubject}&body=${encodeURIComponent(emailBodyText)}`}
                className="w-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant px-3.5 py-2 rounded-lg text-xs font-semibold text-primary flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-secondary" />
                <span>Open in Email App</span>
              </a>

              <button 
                onClick={handleCopyEmailText}
                className="w-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant px-3.5 py-2 rounded-lg text-xs font-semibold text-primary flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-secondary" />}
                <span>{copiedEmail ? "Invitation Copied!" : "Copy Email Template"}</span>
              </button>

              <div className="p-2.5 bg-secondary-container/30 border border-secondary-container rounded-lg text-[11px] text-primary space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                  <span>Secure Submission</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-normal">
                  All guest submissions are saved directly to your event roster under &apos;Under Review&apos; status.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/80 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-white border border-outline-variant hover:bg-surface-container text-primary rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
