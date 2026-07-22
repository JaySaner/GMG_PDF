/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Briefcase, 
  HelpCircle, 
  Bell, 
  ArrowRight, 
  ChevronRight,
  QrCode,
  Sparkles,
  Award,
  Upload,
  CheckCircle,
  FileText,
  Trash2,
  Undo2
} from 'lucide-react';
import { Attendee, EventSettings } from '../types';

interface ProfileWizardViewProps {
  eventSettings: EventSettings;
  editingAttendee: Attendee | null;
  onSave: (attendee: Attendee) => void;
  onCancelEdit: () => void;
  onTriggerToast: (message: string, type: 'success' | 'info') => void;
}

// Preset headshots and logos so testing is effortless and beautiful
const PRESET_HEADSHOTS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCVpXwecFt6HDMADhigcR5FEqCve75qo1CGcsG2OJHrBrkPjaPqZnPe6RwQomk49l8QvKgoNVZ5NdnABAU-Rz0GESspS_eqV3HkioOHnry5lA4z5SFzBaseXu1OT2eTYqu-VqhkD_qLRo91PRRDxD4lVUgXzI6sev-cjEZxSk_6PtWKFO1vHE3EzoH5j-cI0VBNSgn1m9XbRWQZaD7O0bCi9izlh07wwrCXLVAasavwKJ7aca1m3ED5", // Businesswoman (Julianne)
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBCH6ENS_WmlRdB2pjWd7LSoLnP0ptIgZttRte8vMUXVIWRM33GYT-gaXG2zqXtHNVIxenxviqoTZMWJsp5O3mhY5LsF3idTtPdzxFLGausUWLd1L9NZTHM9-Roas8ErOQltJVy8QAtiAeSxMb1aonxANgBmIbt0EtYFywGIS51UGXMeVqP7vPK-VNfmVJ1PGpGT2T-MZoy73VCct7ofzxKXepayomaQwaUUCbtbJ2z3JSawKvMOK1K", // South Asian businesswoman (Anika)
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpxBShPgpBgwlfUa0v_hydfLY92isqR6FG-Gie4VCEh7ZRWrnjKQbH9eZ10w1cmhg5JJJCmqczQVXVmTbEgo3LJkgOcuUAVHvgJFEksP6ckg4PtNEhTyqzWnU_S1g_64hzNvEfNx28NiUoVZMnyusaU9Uoyk9enLjyt4XOL_i1UNnKZH2wkPI3QkQMDjEUE14MjC-gd_c-hIQqHNczcYMBPoNNlpPdSFYKfqZm-YPm8q8RtGvs-I0Z", // Senior businessman (Marcus)
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDOhRI0DGCbG913iZi0Uy7ag-kGMH21qPwDkhYJQ8lMdKeVtWRfx0jVCqUhgkL36B0LouFjb01KNsI_H1_dh1oSChdHwz48WbWfPCE3O9LlzXjU6IYSE2GC0MmQUlgRcfkw740OpR-owzmDnlRujxZXRRVeOfD2T_HXUN9fTBBzLsAQxOhK4ftkwZYHP9qdjEsYQfPG5L6HhNHl0sWhhswM4kuMMCo0CbzDe40JbrYSqrmvFhNZ-Sj2"  // Young entrepreneur (Elena)
];

const PRESET_LOGOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBHGob3oMolEkBqBNyE8tOtmRBPZBB-hongE1W7LLnCdRL8qfsaKBqHFlY6b8Dj-SZsKUzsLNanyTuThOKsoeK8npJmkt2HUBvVH-5bds3gcy4adIVUdf5V11k4h06erW1A5cvCy6LG4WxncFZLLO-R2C-auPKK7YJlu_ei3aARjNZQzjUvXKHlQLftIDC386-pjiJnFqqBAPjqMKB2drn7w-ZsFf55VBo0qczhK2cndweotEthn_s",
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

export default function ProfileWizardView({
  eventSettings,
  editingAttendee,
  onSave,
  onCancelEdit,
  onTriggerToast
}: ProfileWizardViewProps) {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [city, setCity] = useState('');
  const [stateProv, setStateProv] = useState('');
  const [country, setCountry] = useState('');
  const [expertise, setExpertise] = useState<string[]>(["Asset Management"]);
  const [photoUrl, setPhotoUrl] = useState(PRESET_HEADSHOTS[0]);
  const [logoUrl, setLogoUrl] = useState(PRESET_LOGOS[0]);
  const [is10YearBadge, setIs10YearBadge] = useState(true);

  // Synchronize when editing changes
  useEffect(() => {
    if (editingAttendee) {
      setFullName(editingAttendee.name);
      setDesignation(editingAttendee.designation);
      setCompany(editingAttendee.company);
      setIndustry(editingAttendee.industry);
      setCity(editingAttendee.city);
      setStateProv(editingAttendee.stateProv);
      setCountry(editingAttendee.country);
      setExpertise(editingAttendee.expertise);
      setPhotoUrl(editingAttendee.photoUrl);
      setLogoUrl(editingAttendee.logoUrl);
      setIs10YearBadge(editingAttendee.isAnniversaryAttendee);
    } else {
      // Clear form for fresh new creation
      setFullName('');
      setDesignation('');
      setCompany('');
      setIndustry('');
      setCity('London');
      setStateProv('Greater London');
      setCountry('United Kingdom');
      setExpertise(["Asset Management"]);
      setPhotoUrl(PRESET_HEADSHOTS[0]);
      setLogoUrl(PRESET_LOGOS[0]);
      setIs10YearBadge(true);
    }
  }, [editingAttendee]);

  // Handle preset profile photo pick
  const handlePresetPhotoSelect = (url: string) => {
    setPhotoUrl(url);
    onTriggerToast("Headshot selected successfully.", "success");
  };

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoUrl(uploadEvent.target.result as string);
          onTriggerToast("Custom headshot parsed successfully.", "success");
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePresetLogoSelect = (url: string) => {
    setLogoUrl(url);
    onTriggerToast("Corporate logo assigned.", "success");
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setLogoUrl(uploadEvent.target.result as string);
          onTriggerToast("Custom corporate logo parsed.", "success");
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

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict client-side validation
    if (!fullName.trim()) {
      onTriggerToast("Please input a valid Full Name.", "info");
      return;
    }
    if (!designation.trim()) {
      onTriggerToast("Please input their corporate Designation.", "info");
      return;
    }
    if (!company.trim()) {
      onTriggerToast("Please specify their Company.", "info");
      return;
    }

    const savedAttendee: Attendee = {
      id: editingAttendee ? editingAttendee.id : `att-${Date.now()}`,
      name: fullName,
      designation: designation,
      company: company,
      industry: industry || "Maritime",
      status: editingAttendee ? editingAttendee.status : "Approved", // Auto-approved for premium console
      dateSubmitted: editingAttendee ? editingAttendee.dateSubmitted : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      photoUrl: photoUrl,
      logoUrl: logoUrl,
      city: city || "London",
      stateProv: stateProv || "Greater London",
      country: country || "United Kingdom",
      expertise: expertise,
      isAnniversaryAttendee: is10YearBadge
    };

    onSave(savedAttendee);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Wizard Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-on-primary font-bold text-sm">
            {editingAttendee ? <Award className="w-5 h-5 text-secondary-light" /> : "1"}
          </div>
          <h1 className="font-display text-3xl font-bold text-primary">
            {editingAttendee ? `Edit Profile: ${editingAttendee.name}` : "Personal Details"}
          </h1>
        </div>
        
        {editingAttendee && (
          <button 
            onClick={onCancelEdit}
            className="flex items-center gap-2 border border-outline-variant hover:bg-surface-container-high px-4 py-2 rounded text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
          >
            <Undo2 className="w-4 h-4 text-on-surface-variant" />
            <span>Cancel Edit</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Form Details */}
        <section className="w-full md:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant premium-shadow">
            <form onSubmit={handleSaveForm} className="space-y-6">
              
              {/* Photo Upload Rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                
                 {/* Profile Photo Upload */}
                <div className="space-y-2">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Profile Photo</label>
                  <div className="flex items-center gap-3">
                    <div className={`relative group w-20 h-20 rounded-full border-2 border-dashed transition-all flex items-center justify-center overflow-hidden bg-surface-bright shrink-0 ${
                      eventSettings.enableGuestPhotoSelection 
                        ? 'border-outline-variant hover:border-secondary cursor-pointer' 
                        : 'border-outline-variant/30 opacity-70 cursor-not-allowed'
                    }`}>
                      <img referrerPolicy="no-referrer" src={photoUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                      {eventSettings.enableGuestPhotoSelection && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        disabled={!eventSettings.enableGuestPhotoSelection}
                        onChange={handleCustomPhotoUpload}
                        className={`absolute inset-0 opacity-0 ${eventSettings.enableGuestPhotoSelection ? 'cursor-pointer' : 'cursor-not-allowed'}`} 
                      />
                    </div>
                    <div className="text-xs text-on-surface-variant leading-normal">
                      <p className="font-bold text-primary">Upload headshot</p>
                      {eventSettings.enableGuestPhotoSelection ? (
                        <>
                          <p>JPG or PNG, max 2MB</p>
                          {/* Pick preset trigger */}
                          <div className="flex gap-1.5 mt-2">
                            {PRESET_HEADSHOTS.map((url, i) => (
                              <button
                                type="button"
                                key={i}
                                onClick={() => handlePresetPhotoSelect(url)}
                                className="w-5 h-5 rounded-full overflow-hidden border border-outline-variant hover:border-secondary transition-all cursor-pointer"
                              >
                                <img referrerPolicy="no-referrer" src={url} alt="preset headshot" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-amber-700 font-medium mt-1">⚠️ Photo selection disabled by administrator.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company Logo Upload */}
                <div className="space-y-2">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Company Logo</label>
                  <div className="flex items-center gap-3">
                    <div className="relative group cursor-pointer w-20 h-20 rounded border-2 border-dashed border-outline-variant hover:border-secondary transition-all flex items-center justify-center overflow-hidden bg-surface-bright shrink-0">
                      <img referrerPolicy="no-referrer" src={logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleCustomLogoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                    <div className="text-xs text-on-surface-variant leading-normal">
                      <p className="font-bold text-primary">Upload logo</p>
                      <p>Vector or high-res PNG</p>
                      <div className="flex gap-1.5 mt-2">
                        {PRESET_LOGOS.map((url, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => handlePresetLogoSelect(url)}
                            className="w-5 h-5 rounded overflow-hidden border border-outline-variant hover:border-secondary transition-all bg-white flex items-center justify-center p-0.5"
                          >
                            <img referrerPolicy="no-referrer" src={url} alt="preset logo" className="w-full h-full object-contain" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Designation Flushed Input style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block" htmlFor="fullName">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Julianne Sterling"
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-1.5 focus:border-secondary focus:ring-0 transition-all font-sans font-bold text-base text-primary outline-none"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block" htmlFor="designation">Designation</label>
                  <input 
                    type="text" 
                    id="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Chief Strategy Officer"
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-1.5 focus:border-secondary focus:ring-0 transition-all font-sans text-sm text-primary outline-none"
                    required
                  />
                </div>
              </div>

              {/* Company & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block" htmlFor="company">Company</label>
                  <input 
                    type="text" 
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Global Maritime Group"
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-1.5 focus:border-secondary focus:ring-0 transition-all font-sans text-sm text-primary outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block" htmlFor="industry">Industry</label>
                  <select 
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-1.5 focus:border-secondary focus:ring-0 transition-all font-sans text-sm text-primary outline-none cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Select Industry</option>
                    <option value="Maritime">Maritime & Logistics</option>
                    <option value="Aerospace">Aerospace & Aeronautics</option>
                    <option value="Venture Capital">Venture Capital</option>
                    <option value="Green Tech">Green Energy & Tech</option>
                    <option value="Global Finance">Global Finance</option>
                  </select>
                </div>
              </div>

              {/* Location Cluster */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block" htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="London"
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-1.5 focus:border-secondary focus:ring-0 transition-all font-sans text-sm text-primary outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block" htmlFor="stateProv">State/Prov</label>
                  <input 
                    type="text" 
                    id="stateProv"
                    value={stateProv}
                    onChange={(e) => setStateProv(e.target.value)}
                    placeholder="Greater London"
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-1.5 focus:border-secondary focus:ring-0 transition-all font-sans text-sm text-primary outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block" htmlFor="country">Country</label>
                  <input 
                    type="text" 
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United Kingdom"
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-1.5 focus:border-secondary focus:ring-0 transition-all font-sans text-sm text-primary outline-none"
                  />
                </div>
              </div>

              {/* Toggle Anniversary Status */}
              <div className="flex items-center gap-3 py-1">
                <input 
                  type="checkbox"
                  id="badge10yr"
                  checked={is10YearBadge}
                  onChange={(e) => setIs10YearBadge(e.target.checked)}
                  className="rounded border-outline-variant text-secondary focus:ring-secondary h-4.5 w-4.5 cursor-pointer accent-secondary"
                />
                <label htmlFor="badge10yr" className="font-sans text-xs font-semibold text-on-surface-variant cursor-pointer">
                  Eligible for commemorative <span className="text-secondary font-bold">10-Year Delegate</span> visual badge markers.
                </label>
              </div>

              {/* Expertise Tags selection */}
              <div className="space-y-2 pt-2">
                <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Expertise Areas</label>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_CHIPS.map((chip) => {
                    const isActive = expertise.includes(chip);
                    return (
                      <button
                        type="button"
                        key={chip}
                        onClick={() => handleToggleExpertise(chip)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                          isActive 
                            ? 'bg-secondary text-white shadow-sm border border-secondary' 
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary/15 hover:text-secondary'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Button form submission */}
              <button type="submit" className="hidden" id="wizard-submit-btn" />
            </form>
          </div>
        </section>

        {/* Right Column: Live Preview Card */}
        <aside className="w-full md:col-span-5 flex flex-col gap-6">
          <div className="sticky top-24">
            <h3 className="font-sans text-[10px] font-bold text-on-surface-variant/70 tracking-widest text-center uppercase mb-4">Live Delegate Book Preview</h3>
            
            {/* Live Card Container */}
            <div className="relative max-w-sm mx-auto bg-white border border-outline-variant rounded-xl overflow-hidden premium-shadow flex flex-col">
              {/* Gold Top Accented Bar */}
              <div className="h-1 bg-secondary w-full"></div>

              <div className="p-6 flex flex-col items-center text-center">
                
                {/* 10 Year Commemorative Badge */}
                {is10YearBadge && (
                  <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 border border-secondary/20">
                    <Sparkles className="w-3 h-3 text-secondary" />
                    <span>10 YEAR DELEGATE</span>
                  </div>
                )}

                {/* Profile Photo Preview */}
                <div className="w-28 h-28 rounded-full border-4 border-surface-bright shadow-sm mb-4 overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0">
                  <img 
                    referrerPolicy="no-referrer"
                    src={photoUrl} 
                    alt="Avatar Live Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name designation company logo display */}
                <h2 className="font-display text-2xl font-bold text-primary tracking-tight leading-snug">
                  {fullName.trim() || "Julianne Sterling"}
                </h2>
                <p className="text-secondary font-semibold text-sm tracking-wide mt-1">
                  {designation.trim() || "Chief Strategy Officer"}
                </p>

                <div className="flex items-center gap-2 mt-3 mb-5">
                  <div className="w-7 h-7 flex items-center justify-center border border-outline-variant rounded p-1 bg-surface-bright shrink-0">
                    <img 
                      referrerPolicy="no-referrer"
                      src={logoUrl} 
                      alt="Logo Preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <span className="text-on-surface-variant font-bold text-xs">
                    {company.trim() || "Global Maritime Group"}
                  </span>
                </div>

                {/* Metadata Fields */}
                <div className="w-full border-t border-outline-variant py-4 flex flex-col gap-2.5 text-left">
                  <div className="flex justify-between items-center px-1">
                    <span className="font-sans text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Industry</span>
                    <span className="font-sans text-xs font-bold text-primary">{industry || "Maritime"}</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="font-sans text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Location</span>
                    <span className="font-sans text-xs font-bold text-primary">
                      {city.trim() || "London"}{city.trim() && country.trim() ? ", " : ""}{country.trim() || "UK"}
                    </span>
                  </div>
                </div>

                {/* Expertise selection preview tags */}
                <div className="flex flex-wrap justify-center gap-1 mt-2 mb-4">
                  {expertise.length === 0 ? (
                    <span className="text-[9px] text-on-surface-variant/50 italic font-sans font-bold uppercase tracking-wider">No tags chosen</span>
                  ) : (
                    expertise.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2.5 py-0.5 bg-surface-container-low text-[9px] font-bold rounded-full text-on-surface-variant uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))
                  )}
                </div>

                {/* QR Code mockup card footer */}
                <div className="w-full bg-surface-container-low p-4 flex flex-col items-center gap-2 rounded-lg border border-outline-variant/30">
                  <div className="w-16 h-16 bg-white border border-outline-variant/50 p-1.5 flex items-center justify-center">
                    <QrCode className="w-full h-full text-primary" />
                  </div>
                  <p className="font-sans text-[8px] font-bold tracking-widest text-on-surface-variant/70 uppercase">SCAN TO CONNECT AT SUMMIT</p>
                </div>
              </div>
            </div>

            <p className="text-center font-display italic text-xs text-on-surface-variant/70 mt-6 leading-relaxed max-w-sm mx-auto">
              "Design is a decade in the making." — {eventSettings.eventName}
            </p>
          </div>
        </aside>
      </div>

      {/* Footer Navigation wizard actions */}
      <footer className="bg-white border border-outline-variant rounded-xl p-4 flex justify-between items-center select-none shadow-sm mt-8">
        <p className="font-sans text-xs text-on-surface-variant">
          Confirm details in the preview before persisting.
        </p>
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => {
              const btn = document.getElementById('wizard-submit-btn');
              if (btn) btn.click();
            }}
            className="bg-primary text-white hover:bg-secondary hover:text-white px-6 py-3 rounded-lg font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{editingAttendee ? "Update Profile" : "Save & Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
