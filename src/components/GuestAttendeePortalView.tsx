/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle, 
  Upload, 
  UserCheck, 
  Award, 
  Building2, 
  MapPin, 
  Briefcase, 
  Mail, 
  Phone, 
  Linkedin, 
  QrCode, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  ChevronRight,
  Globe,
  Undo2,
  Share2,
  Calendar,
  Clock
} from 'lucide-react';
import { Attendee, EventSettings } from '../types';

interface GuestAttendeePortalViewProps {
  eventSettings: EventSettings;
  onAddAttendee: (attendee: Attendee) => void;
  onExitGuestMode?: () => void;
  onTriggerToast: (message: string, type: 'success' | 'info') => void;
}

const PRESET_HEADSHOTS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCVpXwecFt6HDMADhigcR5FEqCve75qo1CGcsG2OJHrBrkPjaPqZnPe6RwQomk49l8QvKgoNVZ5NdnABAU-Rz0GESspS_eqV3HkioOHnry5lA4z5SFzBaseXu1OT2eTYqu-VqhkD_qLRo91PRRDxD4lVUgXzI6sev-cjEZxSk_6PtWKFO1vHE3EzoH5j-cI0VBNSgn1m9XbRWQZaD7O0bCi9izlh07wwrCXLVAasavwKJ7aca1m3ED5",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBCH6ENS_WmlRdB2pjWd7LSoLnP0ptIgZttRte8vMUXVIWRM33GYT-gaXG2zqXtHNVIxenxviqoTZMWJsp5O3mhY5LsF3idTtPdzxFLGausUWLd1L9NZTHM9-Roas8ErOQltJVy8QAtiAeSxMb1aonxANgBmIbt0EtYFywGIS51UGXMeVqP7vPK-VNfmVJ1PGpGT2T-MZoy73VCct7ofzxKXepayomaQwaUUCbtbJ2z3JSawKvMOK1K",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpxBShPgpBgwlfUa0v_hydfLY92isqR6FG-Gie4VCEh7ZRWrnjKQbH9eZ10w1cmhg5JJJCmqczQVXVmTbEgo3LJkgOcuUAVHvgJFEksP6ckg4PtNEhTyqzWnU_S1g_64hzNvEfNx28NiUoVZMnyusaU9Uoyk9enLjyt4XOL_i1UNnKZH2wkPI3QkQMDjEUE14MjC-gd_c-hIQqHNczcYMBPoNNlpPdSFYKfqZm-YPm8q8RtGvs-I0Z",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDOhRI0DGCbG913iZi0Uy7ag-kGMH21qPwDkhYJQ8lMdKeVtWRfx0jVCqUhgkL36B0LouFjb01KNsI_H1_dh1oSChdHwz48WbWfPCE3O9LlzXjU6IYSE2GC0MmQUlgRcfkw740OpR-owzmDnlRujxZXRRVeOfD2T_HXUN9fTBBzLsAQxOhK4ftkwZYHP9qdjEsYQfPG5L6HhNHl0sWhhswM4kuMMCo0CbzDe40JbrYSqrmvFhNZ-Sj2"
];

const PRESET_LOGOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBHGob3oMolEkBqBNyE8tOtmRBPZBB-hongE1W7LLnCdRL8qfsaKBqHFlY6b8Dj-SZsKUzsLNanyTuThOKsoeK8npJmkt2HUBvVH-5bds3gcy4adIVUdf5V11k4h06erW1A5cvCy6LG4WxncFZLLO-R2C-auPKK7YJlu_ei3aARjNZQzjUvXKHlQLftIDC386-pjiJnFqqBAPjqMKB2drn7w-ZsFf55VBo0qczhK2cndweotEthn_s"
];

const EXPERTISE_CHIPS = [
  "Asset Management",
  "ESG Compliance",
  "Supply Chain",
  "Venture Capital",
  "Maritime & Logistics",
  "Green Energy",
  "Deep Tech & AI",
  "Global Finance"
];

export default function GuestAttendeePortalView({
  eventSettings,
  onAddAttendee,
  onExitGuestMode,
  onTriggerToast
}: GuestAttendeePortalViewProps) {
  // Form State
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('Maritime');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('Dubai');
  const [stateProv, setStateProv] = useState('Dubai');
  const [country, setCountry] = useState('United Arab Emirates');
  const [expertise, setExpertise] = useState<string[]>(["Asset Management"]);
  const [photoUrl, setPhotoUrl] = useState(PRESET_HEADSHOTS[0]);
  const [logoUrl, setLogoUrl] = useState(PRESET_LOGOS[0]);
  const [bio, setBio] = useState('');
  const [is10YearBadge, setIs10YearBadge] = useState(true);

  // Success screen state
  const [submittedAttendee, setSubmittedAttendee] = useState<Attendee | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?mode=attendee` : '';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    onTriggerToast("Public attendee submission link copied!", "success");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoUrl(uploadEvent.target.result as string);
          onTriggerToast("Custom headshot uploaded successfully.", "success");
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setLogoUrl(uploadEvent.target.result as string);
          onTriggerToast("Company logo uploaded.", "success");
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleToggleExpertise = (tag: string) => {
    if (expertise.includes(tag)) {
      setExpertise(prev => prev.filter(t => t !== tag));
    } else {
      setExpertise(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      onTriggerToast("Please enter your Full Name.", "info");
      return;
    }
    if (!designation.trim()) {
      onTriggerToast("Please enter your Designation.", "info");
      return;
    }
    if (!company.trim()) {
      onTriggerToast("Please enter your Company name.", "info");
      return;
    }

    const newAttendee: Attendee = {
      id: `att-guest-${Date.now()}`,
      name: fullName.trim(),
      designation: designation.trim(),
      company: company.trim(),
      industry: industry || "Maritime",
      status: "Under Review",
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      photoUrl: photoUrl,
      logoUrl: logoUrl,
      city: city || "Dubai",
      stateProv: stateProv || "Dubai",
      country: country || "United Arab Emirates",
      expertise: expertise,
      isAnniversaryAttendee: is10YearBadge,
      emailAddress: emailAddress,
      phoneNumber: phoneNumber,
      bio: bio
    };

    onAddAttendee(newAttendee);
    setSubmittedAttendee(newAttendee);
    onTriggerToast("Delegate profile submitted successfully!", "success");
  };

  const handleResetForm = () => {
    setSubmittedAttendee(null);
    setFullName('');
    setDesignation('');
    setCompany('');
    setIndustry('Maritime');
    setEmailAddress('');
    setPhoneNumber('');
    setBio('');
  };

  return (
    <div className="min-h-screen bg-surface-bright font-sans text-on-surface pb-16">
      
      {/* Tester & Admin Switcher Header Banner */}
      <div className="bg-primary text-white py-2.5 px-6 border-b border-secondary/30 text-xs font-semibold flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-bold uppercase tracking-wider text-[11px] text-secondary-light">
            Public Attendee Registration View
          </span>
          <span className="text-white/60 hidden md:inline">| Shareable Link Active</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-secondary-light" />}
            <span>{copiedLink ? "Link Copied!" : "Copy Share Link"}</span>
          </button>

          {onExitGuestMode && (
            <button 
              onClick={onExitGuestMode}
              className="flex items-center gap-1.5 bg-secondary hover:bg-secondary/90 text-white px-3.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Switch to Admin Console</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Cover Banner & Event Header */}
      <div className="relative bg-primary text-white overflow-hidden shadow-md">
        {/* Cover image background with high opacity gradient */}
        {eventSettings.coverBannerUrl && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img referrerPolicy="no-referrer" src={eventSettings.coverBannerUrl} alt="Cover Banner" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Event Brand Info */}
            <div className="flex items-center gap-5">
              {eventSettings.logoUrl && (
                <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg shrink-0 flex items-center justify-center border border-white/20">
                  <img referrerPolicy="no-referrer" src={eventSettings.logoUrl} alt="Event Logo" className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary-light text-[10px] font-extrabold uppercase tracking-widest mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>Official Delegate Registration</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  {eventSettings.eventName}
                </h1>
                <p className="font-sans text-xs text-white/80 mt-1 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-secondary-light" /> {eventSettings.startDate} - {eventSettings.endDate}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-secondary-light" /> {eventSettings.venueAddress}</span>
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-xs space-y-1 max-w-xs shrink-0">
              <div className="font-bold text-secondary-light flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Roster Directory</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Your submitted details will be compiled into the official commemoration volume & digital badge pass.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* SUCCESS SCREEN STATE */}
        {submittedAttendee ? (
          <div className="bg-white border border-outline-variant rounded-2xl shadow-xl p-8 md:p-12 space-y-8 animate-fade-in max-w-3xl mx-auto">
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h2 className="font-display text-3xl font-bold text-primary">Registration Submitted!</h2>
              <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-primary">{submittedAttendee.name}</strong>. Your delegate profile has been successfully received and sent to event managers for inclusion in the directory.
              </p>
            </div>

            {/* Digital Pass Credential Card */}
            <div className="p-6 bg-surface-container-lowest border-2 border-secondary/30 rounded-2xl shadow-md max-w-md mx-auto space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-secondary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                DELEGATE PASS
              </div>

              <div className="flex items-center gap-4">
                <img 
                  referrerPolicy="no-referrer" 
                  src={submittedAttendee.photoUrl} 
                  alt={submittedAttendee.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-secondary shrink-0 shadow-sm" 
                />
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-primary leading-tight">{submittedAttendee.name}</h3>
                  <p className="font-sans text-xs text-on-surface-variant font-semibold">{submittedAttendee.designation}</p>
                  <p className="font-sans text-xs font-bold text-secondary">{submittedAttendee.company}</p>
                  <p className="font-sans text-[10px] text-on-surface-variant/70 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-secondary" /> {submittedAttendee.city}, {submittedAttendee.country}
                  </p>
                </div>
              </div>

              {/* QR Code & Status */}
              <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">Verification Status</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3 h-3" /> Under Review
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[9px] text-on-surface-variant font-bold uppercase block">Pass ID</span>
                    <span className="text-[10px] font-mono font-bold text-primary">{submittedAttendee.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${submittedAttendee.id}`} 
                    alt="QR Code Pass" 
                    className="w-12 h-12 rounded border p-0.5 bg-white shrink-0" 
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-outline-variant/60">
              <button 
                onClick={() => window.print()}
                className="w-full sm:w-auto bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Pass PDF</span>
              </button>

              <button 
                onClick={handleResetForm}
                className="w-full sm:w-auto bg-white border border-outline-variant hover:bg-surface-container text-primary px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-secondary" />
                <span>Submit Another Profile</span>
              </button>
            </div>

          </div>
        ) : (
          /* FORM & LIVE PREVIEW GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-7 bg-white border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              
              <div>
                <h2 className="font-display text-2xl font-bold text-primary">Complete Your Delegate Profile</h2>
                <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Provide your professional designation, contact information, and headshot for inclusion in the directory.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Headshot Photo Selection / Upload */}
                <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-secondary" />
                      <span>1. Headshot Photo</span>
                    </label>
                    <span className="text-[10px] text-on-surface-variant font-medium">JPG or PNG (max 5MB)</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative group w-20 h-20 rounded-full border-2 border-dashed border-secondary hover:border-primary overflow-hidden bg-surface-bright shrink-0 flex items-center justify-center transition-all cursor-pointer">
                      <img referrerPolicy="no-referrer" src={photoUrl} alt="Selected Headshot" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <Upload className="w-4 h-4" />
                        <span className="text-[8px] font-bold uppercase mt-0.5">Upload</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleCustomPhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>

                    <div className="space-y-1 flex-1">
                      <p className="text-xs font-semibold text-primary">Upload Custom Headshot or Select Avatar:</p>
                      <div className="flex gap-2 pt-1">
                        {PRESET_HEADSHOTS.map((url, i) => (
                          <button 
                            type="button" 
                            key={i} 
                            onClick={() => setPhotoUrl(url)}
                            className={`w-7 h-7 rounded-full overflow-hidden border transition-all cursor-pointer ${
                              photoUrl === url ? 'border-secondary ring-2 ring-secondary/50' : 'border-outline-variant hover:border-secondary'
                            }`}
                          >
                            <img referrerPolicy="no-referrer" src={url} alt={`avatar-${i}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Personal & Professional Details */}
                <div className="space-y-4">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/60 pb-2">
                    2. Professional Credentials
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-sans text-xs font-bold text-primary block">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Dr. Julianne Sterling" 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs text-primary focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans text-xs font-bold text-primary block">Designation / Title *</label>
                      <input 
                        type="text" 
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Chief Strategy Officer" 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs text-primary focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans text-xs font-bold text-primary block">Company / Organization *</label>
                      <input 
                        type="text" 
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Global Maritime Group" 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs text-primary focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans text-xs font-bold text-primary block">Industry Sector</label>
                      <select 
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs text-primary focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all cursor-pointer"
                      >
                        <option value="Maritime">Maritime & Ports</option>
                        <option value="Aerospace">Aerospace & Defense</option>
                        <option value="Finance & VC">Finance & Investment</option>
                        <option value="Technology">Technology & AI</option>
                        <option value="Energy">Green Energy & CleanTech</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans text-xs font-bold text-primary block">Email Address (Optional)</label>
                      <input 
                        type="email" 
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="e.g. julianne@gmgportal.com" 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs text-primary focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Location */}
                <div className="space-y-4">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/60 pb-2">
                    3. Regional Location
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-sans text-xs font-bold text-primary block">City</label>
                      <input 
                        type="text" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Dubai" 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs text-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-sans text-xs font-bold text-primary block">State / Province</label>
                      <input 
                        type="text" 
                        value={stateProv}
                        onChange={(e) => setStateProv(e.target.value)}
                        placeholder="Dubai" 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs text-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-sans text-xs font-bold text-primary block">Country</label>
                      <input 
                        type="text" 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="United Arab Emirates" 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs text-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Expertise Chips */}
                <div className="space-y-2">
                  <label className="font-sans text-xs font-bold text-primary block">Key Areas of Expertise</label>
                  <div className="flex flex-wrap gap-2">
                    {EXPERTISE_CHIPS.map((chip) => (
                      <button 
                        type="button"
                        key={chip}
                        onClick={() => handleToggleExpertise(chip)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                          expertise.includes(chip) 
                            ? 'bg-secondary text-white shadow-sm' 
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {expertise.includes(chip) ? `✓ ${chip}` : `+ ${chip}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Company Logo Upload */}
                <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="font-sans text-xs font-bold text-primary block">Company / Brand Logo</label>
                    <p className="text-[10px] text-on-surface-variant">Vector or high-res transparent PNG</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {logoUrl && (
                      <div className="w-12 h-10 border border-outline-variant rounded bg-white p-1 flex items-center justify-center shrink-0">
                        <img referrerPolicy="no-referrer" src={logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <label className="bg-white border border-outline-variant hover:bg-surface-container px-3 py-1.5 rounded text-xs font-bold text-primary cursor-pointer transition-colors shrink-0">
                      Upload Logo
                      <input type="file" accept="image/*" onChange={handleCustomLogoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Submit Profile to Directory</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>

            </div>

            {/* Right Column: Sticky Live Card Preview */}
            <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
              
              <div className="bg-primary text-white p-3.5 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-secondary-light">
                  <Sparkles className="w-4 h-4" /> Live Directory Card Preview
                </span>
                <span className="text-[10px] text-white/70">Updates as you type</span>
              </div>

              {/* Card Container */}
              <div className="bg-white border-2 border-secondary/20 rounded-2xl p-6 shadow-xl space-y-5 relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full border-2 border-secondary overflow-hidden bg-surface-bright shrink-0 shadow-sm">
                      <img referrerPolicy="no-referrer" src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-bold text-primary leading-snug">
                        {fullName.trim() || "Julianne Sterling"}
                      </h4>
                      <p className="font-sans text-xs text-on-surface-variant font-semibold">
                        {designation.trim() || "Chief Strategy Officer"}
                      </p>
                      <p className="font-sans text-xs font-bold text-secondary mt-0.5">
                        {company.trim() || "Global Maritime Group"}
                      </p>
                    </div>
                  </div>

                  {logoUrl && (
                    <div className="w-12 h-10 border border-outline-variant/60 rounded p-1 bg-white flex items-center justify-center shrink-0">
                      <img referrerPolicy="no-referrer" src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="text-xs text-on-surface-variant/80 flex items-center gap-1.5 pt-2 border-t border-outline-variant/50">
                  <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>{city || "Dubai"}, {country || "United Arab Emirates"}</span>
                </div>

                {expertise.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">Areas of Expertise</span>
                    <div className="flex flex-wrap gap-1.5">
                      {expertise.map(exp => (
                        <span key={exp} className="px-2 py-0.5 rounded bg-surface-container text-primary font-semibold text-[10px]">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-[10px] text-on-surface-variant/70 flex items-center justify-between">
                  <span>Directory Roster Status</span>
                  <span className="font-bold text-amber-700">Pending Review</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
