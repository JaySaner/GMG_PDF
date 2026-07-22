/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Info, 
  MapPin, 
  Palette, 
  Upload, 
  Pipette, 
  Link as LinkIcon, 
  Copy, 
  FileSpreadsheet, 
  MessageSquare, 
  Brain, 
  Mail, 
  Rocket, 
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Database,
  Sliders,
  Settings,
  RefreshCw
} from 'lucide-react';
import { EventSettings } from '../types';

interface SettingsViewProps {
  initialSettings: EventSettings;
  onSaveSettings: (settings: EventSettings) => void;
  onTriggerToast: (message: string, type: 'success' | 'info') => void;
}

const BRAND_PRESET_COLORS = [
  "#000000", // Midnight Black
  "#131b2e", // Deep Navy
  "#775a19", // Anniversary Gold
  "#213145", // Slate Blue
  "#e9c176", // Soft Gold
];

export default function SettingsView({
  initialSettings,
  onSaveSettings,
  onTriggerToast
}: SettingsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'branding' | 'integrations'>('general');

  // Input states mirroring settings
  const [eventName, setEventName] = useState(initialSettings.eventName);
  const [startDate, setStartDate] = useState(initialSettings.startDate);
  const [endDate, setEndDate] = useState(initialSettings.endDate);
  const [venueAddress, setVenueAddress] = useState(initialSettings.venueAddress);
  const [organizerDetails, setOrganizerDetails] = useState(initialSettings.organizerDetails);
  const [logoUrl, setLogoUrl] = useState(initialSettings.logoUrl);
  const [themeAccent, setThemeAccent] = useState(initialSettings.themeAccent);
  const [coverBannerUrl, setCoverBannerUrl] = useState(initialSettings.coverBannerUrl);
  const [enableDownloads, setEnableDownloads] = useState(initialSettings.enableDownloads ?? true);
  const [enableGuestPhotoSelection, setEnableGuestPhotoSelection] = useState(initialSettings.enableGuestPhotoSelection ?? true);

  // Sync state if initialSettings changes from above
  useEffect(() => {
    setEventName(initialSettings.eventName);
    setStartDate(initialSettings.startDate);
    setEndDate(initialSettings.endDate);
    setVenueAddress(initialSettings.venueAddress);
    setOrganizerDetails(initialSettings.organizerDetails);
    setLogoUrl(initialSettings.logoUrl);
    setThemeAccent(initialSettings.themeAccent);
    setCoverBannerUrl(initialSettings.coverBannerUrl);
    setEnableDownloads(initialSettings.enableDownloads ?? true);
    setEnableGuestPhotoSelection(initialSettings.enableGuestPhotoSelection ?? true);
  }, [initialSettings]);

  // Check if anything has changed vs props
  const hasChanges = 
    eventName !== initialSettings.eventName ||
    startDate !== initialSettings.startDate ||
    endDate !== initialSettings.endDate ||
    venueAddress !== initialSettings.venueAddress ||
    organizerDetails !== initialSettings.organizerDetails ||
    logoUrl !== initialSettings.logoUrl ||
    themeAccent !== initialSettings.themeAccent ||
    coverBannerUrl !== initialSettings.coverBannerUrl ||
    enableDownloads !== (initialSettings.enableDownloads ?? true) ||
    enableGuestPhotoSelection !== (initialSettings.enableGuestPhotoSelection ?? true);

  const handleDiscardChanges = () => {
    setEventName(initialSettings.eventName);
    setStartDate(initialSettings.startDate);
    setEndDate(initialSettings.endDate);
    setVenueAddress(initialSettings.venueAddress);
    setOrganizerDetails(initialSettings.organizerDetails);
    setLogoUrl(initialSettings.logoUrl);
    setThemeAccent(initialSettings.themeAccent);
    setCoverBannerUrl(initialSettings.coverBannerUrl);
    setEnableDownloads(initialSettings.enableDownloads ?? true);
    setEnableGuestPhotoSelection(initialSettings.enableGuestPhotoSelection ?? true);
    onTriggerToast("Configuration changes discarded.", "info");
  };

  const handleSaveAllChanges = () => {
    if (!eventName.trim()) {
      onTriggerToast("Event Name cannot be empty.", "info");
      return;
    }

    const updated: EventSettings = {
      eventName,
      startDate,
      endDate,
      venueAddress,
      organizerDetails,
      logoUrl,
      themeAccent,
      coverBannerUrl,
      enableDownloads,
      enableGuestPhotoSelection
    };

    onSaveSettings(updated);
    onTriggerToast("Event settings synced dynamically!", "success");
  };

  const handleCopyVipLink = () => {
    navigator.clipboard.writeText("summit-elite.com/r/vip-2024");
    onTriggerToast("VIP Registration Link copied to clipboard!", "success");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setLogoUrl(ev.target.result as string);
          onTriggerToast("Brand logo uploaded.", "success");
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCoverBannerUrl(ev.target.result as string);
          onTriggerToast("Commemorative cover banner replaced.", "success");
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Top Header */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h2 className="font-display text-4xl font-bold text-primary tracking-tight">Event Configuration</h2>
          <p className="font-sans text-xs text-on-surface-variant mt-1">
            {eventName} • 10th Anniversary Platform
          </p>
        </div>
      </div>

      {/* Grid Bento-style Settings layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left main tabs controller */}
        <div className="lg:col-span-12">
          <div className="flex border-b border-outline-variant gap-2">
            <button 
              onClick={() => setActiveSubTab('general')}
              className={`px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activeSubTab === 'general' 
                  ? 'border-b-2 border-secondary text-primary font-extrabold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              General
            </button>
            <button 
              onClick={() => setActiveSubTab('branding')}
              className={`px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activeSubTab === 'branding' 
                  ? 'border-b-2 border-secondary text-primary font-extrabold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Branding
            </button>
            <button 
              onClick={() => setActiveSubTab('integrations')}
              className={`px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activeSubTab === 'integrations' 
                  ? 'border-b-2 border-secondary text-primary font-extrabold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Integrations
            </button>
          </div>
        </div>

        {/* Left Column Settings content (tabs switcher) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. GENERAL DETAILS SUB TAB */}
          {activeSubTab === 'general' && (
            <section className="bg-white border border-outline-variant rounded-xl p-6 ambient-shadow space-y-6">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <Sliders className="w-5 h-5 text-secondary" />
                <h3 className="font-sans text-base font-bold uppercase tracking-wider text-primary">Essential Details</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/85 uppercase tracking-wider block mb-2">Event Name</label>
                  <input 
                    type="text" 
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 font-display text-2xl font-bold text-primary placeholder:text-outline-variant outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant/85 uppercase tracking-wider block mb-2">Start Date</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-secondary focus:border-secondary transition-all outline-none font-sans font-semibold text-primary"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant/85 uppercase tracking-wider block mb-2">End Date</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-secondary focus:border-secondary transition-all outline-none font-sans font-semibold text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/85 uppercase tracking-wider block mb-2">Venue Address</label>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-on-surface-variant shrink-0" />
                    <input 
                      type="text" 
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="The Grand Meridian Ballroom, Dubai UAE"
                      className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 font-sans text-sm font-semibold text-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/85 uppercase tracking-wider block mb-2">Organizer Details</label>
                  <textarea 
                    value={organizerDetails}
                    onChange={(e) => setOrganizerDetails(e.target.value)}
                    rows={3}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary transition-all outline-none font-sans leading-relaxed text-on-surface-variant"
                  />
                </div>

                <div className="border-t border-outline-variant/65 pt-6 space-y-4">
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">Interactive & Download Controls</h4>
                  
                  {/* Photo Selection Switch */}
                  <div className="flex items-start justify-between p-3.5 border border-outline-variant/70 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low/30 transition-all">
                    <div className="space-y-1 pr-4">
                      <label className="font-sans text-xs font-bold text-primary block cursor-pointer" htmlFor="enableGuestPhotoSelection">
                        Enable Guest Photo Selection & Crop
                      </label>
                      <p className="font-sans text-[11px] text-on-surface-variant/80 leading-relaxed">
                        Allow roster guests to select preset template test avatars and crop their photo in the commemoration directory form.
                      </p>
                    </div>
                    <div className="flex items-center h-5 shrink-0">
                      <input 
                        id="enableGuestPhotoSelection"
                        type="checkbox"
                        checked={enableGuestPhotoSelection}
                        onChange={(e) => setEnableGuestPhotoSelection(e.target.checked)}
                        className="rounded border-outline-variant text-secondary focus:ring-secondary h-4.5 w-4.5 cursor-pointer accent-secondary"
                      />
                    </div>
                  </div>

                  {/* Download Features Switch */}
                  <div className="flex items-start justify-between p-3.5 border border-outline-variant/70 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low/30 transition-all">
                    <div className="space-y-1 pr-4">
                      <label className="font-sans text-xs font-bold text-primary block cursor-pointer" htmlFor="enableDownloads">
                        Enable PDF & CSV Export Downloads
                      </label>
                      <p className="font-sans text-[11px] text-on-surface-variant/80 leading-relaxed">
                        Activate all download triggers (CSV directories, PDF summary reports, and individual profile sheets) across the dashboard and eBook pages.
                      </p>
                    </div>
                    <div className="flex items-center h-5 shrink-0">
                      <input 
                        id="enableDownloads"
                        type="checkbox"
                        checked={enableDownloads}
                        onChange={(e) => setEnableDownloads(e.target.checked)}
                        className="rounded border-outline-variant text-secondary focus:ring-secondary h-4.5 w-4.5 cursor-pointer accent-secondary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 2. BRANDING / VISUAL ACCENT TAB */}
          {activeSubTab === 'branding' && (
            <section className="bg-white border border-outline-variant rounded-xl p-6 ambient-shadow space-y-6">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <Palette className="w-5 h-5 text-secondary" />
                <h3 className="font-sans text-base font-bold uppercase tracking-wider text-primary">Visual Identity</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Logo & Icon upload preview */}
                <div className="space-y-3">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/85 uppercase tracking-wider block">Logo & Icon</label>
                  <div className="relative border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container-low transition-colors cursor-pointer group h-44">
                    <img referrerPolicy="no-referrer" src={logoUrl} alt="Logo Visual" className="max-h-16 object-contain mb-3" />
                    <p className="font-sans text-xs text-primary font-bold">Replace Logo</p>
                    <p className="font-sans text-[10px] text-on-surface-variant/60">PNG, SVG (max. 2MB)</p>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Accent Theme Selection */}
                <div className="space-y-3">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/85 uppercase tracking-wider block">Theme Accent</label>
                  
                  <div className="flex items-center gap-3 p-3 border border-outline-variant rounded-lg bg-surface-container-low h-20">
                    <div 
                      style={{ backgroundColor: themeAccent }}
                      className="w-12 h-12 rounded flex items-center justify-center text-white shadow-sm transition-colors"
                    >
                      <Pipette className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-sans text-[9px] font-bold text-on-surface-variant/70 uppercase">Brand Tone</p>
                      <p className="font-sans text-xs font-extrabold text-primary uppercase">{themeAccent}</p>
                    </div>
                    
                    {/* Native Color Input */}
                    <input 
                      type="color" 
                      value={themeAccent}
                      onChange={(e) => setThemeAccent(e.target.value)}
                      className="w-8 h-8 rounded-full border-0 p-0 cursor-pointer overflow-hidden outline-none"
                    />
                  </div>

                  {/* Preset Quick Blocks */}
                  <div className="grid grid-cols-5 gap-2 pt-1 select-none">
                    {BRAND_PRESET_COLORS.map((color) => {
                      const isSelected = color.toLowerCase() === themeAccent.toLowerCase();
                      return (
                        <button
                          type="button"
                          key={color}
                          onClick={() => setThemeAccent(color)}
                          style={{ backgroundColor: color }}
                          className={`aspect-square rounded cursor-pointer border border-outline-variant transition-all hover:scale-105 ${
                            isSelected ? 'ring-2 ring-offset-2 ring-secondary scale-105' : ''
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Cover Banner Large banner picker */}
                <div className="md:col-span-2 space-y-3 pt-2">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/85 uppercase tracking-wider block">Cover Banner</label>
                  <div className="relative h-44 w-full rounded-xl overflow-hidden group cursor-pointer border border-outline-variant">
                    <img 
                      referrerPolicy="no-referrer"
                      src={coverBannerUrl} 
                      alt="Banner background" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/95 px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-wider">Change Banner</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* 3. INTEGRATIONS ROADMAP DETAILS */}
          {activeSubTab === 'integrations' && (
            <section className="bg-white border border-outline-variant rounded-xl p-6 ambient-shadow space-y-6">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <Database className="w-5 h-5 text-secondary" />
                <h3 className="font-sans text-base font-bold uppercase tracking-wider text-primary">Connected Services</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-outline-variant rounded-lg bg-surface-bright flex items-center justify-between">
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary uppercase tracking-wider">Attendee Email Relay</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">Send transaction logs and confirmation letters.</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Active</span>
                </div>

                <div className="p-4 border border-outline-variant rounded-lg bg-surface-bright flex items-center justify-between">
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary uppercase tracking-wider">Static Assets Webhook</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">Automated image-generation sync pipeline.</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Active</span>
                </div>

                <div className="p-4 border border-outline-variant rounded-lg bg-surface-bright flex items-center justify-between">
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary uppercase tracking-wider">Zebra Printer Relays</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">Physical card badge printer interfaces.</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Offline</span>
                </div>

                <div className="p-4 border border-outline-variant rounded-lg bg-surface-bright flex items-center justify-between">
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary uppercase tracking-wider">CSV Data Sinks</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">Local CSV export backup databases.</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">Active</span>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Right Column: Links and Future Roadmaps */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Access Links Card */}
          <div className="bg-white border border-outline-variant rounded-xl p-5 ambient-shadow space-y-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-secondary" />
              <h3 className="font-sans text-base font-bold uppercase tracking-wider text-primary">Access Links</h3>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded-lg">
                <p className="font-sans text-[9px] font-bold text-on-surface-variant mb-1 uppercase tracking-wider">VIP register link</p>
                <div className="flex items-center gap-1.5">
                  <code className="text-[11px] font-mono font-bold text-primary bg-white px-2 py-1 border border-outline-variant flex-1 truncate">
                    summit-elite.com/r/vip-2024
                  </code>
                  <button 
                    onClick={handleCopyVipLink}
                    title="Copy to clipboard"
                    className="p-1.5 hover:text-secondary hover:bg-white rounded transition-colors active:scale-95 cursor-pointer shrink-0"
                  >
                    <Copy className="w-4 h-4 text-on-surface-variant" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleCopyVipLink}
                  className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/95 text-white py-2.5 rounded font-sans text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All</span>
                </button>
                <button 
                  onClick={() => onTriggerToast("Exporting VIP access logs...", "info")}
                  className="flex items-center justify-center gap-1.5 border border-outline-variant hover:bg-surface-container-high py-2.5 rounded font-sans text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer active:scale-95"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span>CSV Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Future Ecosystem Bento Roadmap Cards */}
          <div className="space-y-4">
            <h4 className="font-sans text-[10px] font-bold text-on-surface-variant/80 tracking-widest uppercase px-1">Future Ecosystem</h4>
            
            {/* WhatsApp */}
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 relative overflow-hidden group hover:border-secondary transition-all cursor-help opacity-75 hover:opacity-100 hover:grayscale-0 grayscale duration-300">
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-outline-variant/50">
                  <MessageSquare className="w-5 h-5 text-[#25D366]" />
                </div>
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-sans text-[9px] uppercase font-extrabold tracking-tighter">Coming Soon</span>
              </div>
              <h5 className="font-sans text-sm font-bold text-primary mb-1">WhatsApp API</h5>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">Automated personalized delegate alerts and real-time scheduling updates sent straight to mobile.</p>
              
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#25D366]/5 rounded-full blur-2xl group-hover:scale-150 transition-all pointer-events-none" />
            </div>

            {/* AI Bio Rewriter */}
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 relative overflow-hidden group hover:border-secondary transition-all cursor-help opacity-75 hover:opacity-100 hover:grayscale-0 grayscale duration-300">
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-outline-variant/50">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-sans text-[9px] uppercase font-extrabold tracking-tighter">Coming Soon</span>
              </div>
              <h5 className="font-sans text-sm font-bold text-primary mb-1">AI Bio Rewriter</h5>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">Smart natural-language optimization of attendee biography pitches to match the high-end Summit Elite editorial tone.</p>
            </div>

            {/* Bulk Integration */}
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 relative overflow-hidden group hover:border-secondary transition-all cursor-help opacity-75 hover:opacity-100 hover:grayscale-0 grayscale duration-300">
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-outline-variant/50">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-sans text-[9px] uppercase font-extrabold tracking-tighter">Coming Soon</span>
              </div>
              <h5 className="font-sans text-sm font-bold text-primary mb-1">Bulk Integration</h5>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">Launch and deliver thousands of unique commemorative invitational letters with a single cloud-relayed click.</p>
            </div>

          </div>

        </aside>

      </div>

      {/* Floating Action Draft Saving Bar */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 lg:translate-x-0 z-50 animate-fade-in select-none">
          <div className="bg-primary text-on-primary px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 border-b-2 border-secondary border-t border-white/5">
            <div className="hidden sm:block shrink-0">
              <p className="font-sans text-[9px] opacity-75 uppercase tracking-wider font-bold">Status</p>
              <p className="font-sans text-xs font-extrabold text-white">Unsaved Changes</p>
            </div>
            
            <div className="h-8 w-[1px] bg-white/20 hidden sm:block shrink-0"></div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleDiscardChanges}
                className="text-white/70 hover:text-white transition-colors font-sans text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Discard
              </button>
              
              <button 
                onClick={handleSaveAllChanges}
                className="bg-secondary hover:bg-secondary/90 text-white font-sans text-xs font-extrabold uppercase tracking-wider px-5 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-md active:scale-95 flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
