/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Share2, 
  Upload, 
  Download, 
  CheckCircle, 
  Users, 
  Layers, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  Mail, 
  Phone, 
  Linkedin, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  QrCode, 
  Award,
  Settings,
  Crop,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Calendar,
  Lock,
  Printer,
  Copy,
  Info
} from 'lucide-react';
import { Attendee, EventSettings } from '../types';

interface EBookBuilderViewProps {
  attendees: Attendee[];
  eventSettings: EventSettings;
  onAddAttendee: (attendee: Attendee) => void;
  onTriggerToast: (message: string, type: 'success' | 'info') => void;
}

const PRESET_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCVpXwecFt6HDMADhigcR5FEqCve75qo1CGcsG2OJHrBrkPjaPqZnPe6RwQomk49l8QvKgoNVZ5NdnABAU-Rz0GESspS_eqV3HkioOHnry5lA4z5SFzBaseXu1OT2eTYqu-VqhkD_qLRo91PRRDxD4lVUgXzI6sev-cjEZxSk_6PtWKFO1vHE3EzoH5j-cI0VBNSgn1m9XbRWQZaD7O0bCi9izlh07wwrCXLVAasavwKJ7aca1m3ED5", // Julianne
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBCH6ENS_WmlRdB2pjWd7LSoLnP0ptIgZttRte8vMUXVIWRM33GYT-gaXG2zqXtHNVIxenxviqoTZMWJsp5O3mhY5LsF3idTtPdzxFLGausUWLd1L9NZTHM9-Roas8ErOQltJVy8QAtiAeSxMb1aonxANgBmIbt0EtYFywGIS51UGXMeVqP7vPK-VNfmVJ1PGpGT2T-MZoy73VCct7ofzxKXepayomaQwaUUCbtbJ2z3JSawKvMOK1K", // Anika
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpxBShPgpBgwlfUa0v_hydfLY92isqR6FG-Gie4VCEh7ZRWrnjKQbH9eZ10w1cmhg5JJJCmqczQVXVmTbEgo3LJkgOcuUAVHvgJFEksP6ckg4PtNEhTyqzWnU_S1g_64hzNvEfNx28NiUoVZMnyusaU9Uoyk9enLjyt4XOL_i1UNnKZH2wkPI3QkQMDjEUE14MjC-gd_c-hIQqHNczcYMBPoNNlpPdSFYKfqZm-YPm8q8RtGvs-I0Z", // Marcus
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDOhRI0DGCbG913iZi0Uy7ag-kGMH21qPwDkhYJQ8lMdKeVtWRfx0jVCqUhgkL36B0LouFjb01KNsI_H1_dh1oSChdHwz48WbWfPCE3O9LlzXjU6IYSE2GC0MmQUlgRcfkw740OpR-owzmDnlRujxZXRRVeOfD2T_HXUN9fTBBzLsAQxOhK4ftkwZYHP9qdjEsYQfPG5L6HhNHl0sWhhswM4kuMMCo0CbzDe40JbrYSqrmvFhNZ-Sj2"  // Elena
];

const PRESET_LOGOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBHGob3oMolEkBqBNyE8tOtmRBPZBB-hongE1W7LLnCdRL8qfsaKBqHFlY6b8Dj-SZsKUzsLNanyTuThOKsoeK8npJmkt2HUBvVH-5bds3gcy4adIVUdf5V11k4h06erW1A5cvCy6LG4WxncFZLLO-R2C-auPKK7YJlu_ei3aARjNZQzjUvXKHlQLftIDC386-pjiJnFqqBAPjqMKB2drn7w-ZsFf55VBo0qczhK2cndweotEthn_s"
];

// Color palette configurations matching sectors
const SECTOR_STYLES = {
  Service: {
    border: 'border-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    badgeBg: 'bg-blue-600',
    colorHex: '#2563EB'
  },
  Construction: {
    border: 'border-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    badgeBg: 'bg-amber-500',
    colorHex: '#D97706'
  },
  Manufacturing: {
    border: 'border-orange-500',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    badgeBg: 'bg-orange-500',
    colorHex: '#EA580C'
  },
  Trading: {
    border: 'border-green-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
    badgeBg: 'bg-green-600',
    colorHex: '#16A34A'
  }
};

export default function EBookBuilderView({ 
  attendees, 
  eventSettings, 
  onAddAttendee, 
  onTriggerToast 
}: EBookBuilderViewProps) {
  // Navigation: 'admin' (Template/Index/eBook Compiler) OR 'guest' (Self-Registration Invitation View)
  const [activeMode, setActiveMode] = useState<'admin' | 'guest'>('admin');
  const [adminTab, setAdminTab] = useState<'template' | 'ebook'>('ebook');
  
  // --- TEMPLATE DESIGN STATE (ADMIN) ---
  const [bookTitle, setBookTitle] = useState("GMG 10 Year Anniversary Commemorative Book");
  const [bookSubTitle, setBookSubTitle] = useState("Official Roster of Business Leaders & Delegates");
  const [photoBorderSize, setPhotoBorderSize] = useState(4); // thickness of photo ring
  const [fontSizeTheme, setFontSizeTheme] = useState<'serif' | 'sans' | 'classic'>('serif');
  const [showQrCode, setShowQrCode] = useState(true);
  const [showSocialIcons, setShowSocialIcons] = useState(true);
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false);

  // --- GUEST FORM REGISTRATION STATE (GUEST SIMULATOR) ---
  const [guestName, setGuestName] = useState("");
  const [guestTitle, setGuestTitle] = useState("");
  const [guestCompany, setGuestCompany] = useState("");
  const [guestIndustry, setGuestIndustry] = useState("Logistics");
  const [guestSector, setGuestSector] = useState<'Service' | 'Construction' | 'Manufacturing' | 'Trading'>('Service');
  const [guestBio, setGuestBio] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestLinkedIn, setGuestLinkedIn] = useState("");
  const [guestWebsite, setGuestWebsite] = useState("");
  const [guestLookingFor, setGuestLookingFor] = useState("");
  const [guestExpertise, setGuestExpertise] = useState<string[]>(["Asset Management"]);
  const [guestPhoto, setGuestPhoto] = useState(PRESET_AVATARS[0]);
  const [guestLogo, setGuestLogo] = useState(PRESET_LOGOS[0]);
  
  // Circular crop slider state simulation
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoRotate, setPhotoRotate] = useState(0);
  const [isPhotoSubmitted, setIsPhotoSubmitted] = useState(false);

  // --- EBOOK VIEWER COMPILER STATE ---
  const [ebookPage, setEbookPage] = useState(0); // 0 = Cover, 1 = Club Intro, 2 = Trustees, 3 = Index, 4+ = Attendees
  const [ebookSearch, setEbookSearch] = useState("");
  const [ebookFilterSector, setEbookFilterSector] = useState<'All' | 'Service' | 'Construction' | 'Manufacturing' | 'Trading'>('All');
  const [isCompilingBook, setIsCompilingBook] = useState(false);
  const [compilingStep, setCompilingStep] = useState("");

  // Print single profile card simulation
  const [printCardActive, setPrintCardActive] = useState<Attendee | null>(null);

  // Only approved/anniversary attendees go into the official commemorative directory
  const approvedAttendees = attendees.filter(a => a.status === 'Approved');
  
  // Filter attendee directory based on book viewer controls
  const filteredEbookAttendees = approvedAttendees.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(ebookSearch.toLowerCase()) || 
                          a.company.toLowerCase().includes(ebookSearch.toLowerCase()) ||
                          (a.designation && a.designation.toLowerCase().includes(ebookSearch.toLowerCase()));
    const matchesSector = ebookFilterSector === 'All' || a.sector === ebookFilterSector;
    return matchesSearch && matchesSector;
  });

  // Calculate pages
  // Page 0: Cover
  // Page 1: Club Overview / Saturday Club Global Trust Intro
  // Page 2: Trustees & Executive Committee
  // Page 3: The Alphabetical Index (Table of Contents)
  // Page 4+: Individual attendee profiles
  const totalIntroPages = 4;
  const totalEbookPages = totalIntroPages + filteredEbookAttendees.length;

  const activeAttendee = ebookPage >= totalIntroPages ? filteredEbookAttendees[ebookPage - totalIntroPages] : null;

  // Copy share link helper
  const handleCopyLink = () => {
    setInviteLinkCopied(true);
    onTriggerToast("Guest Invitation template link copied to clipboard!", "success");
    setTimeout(() => setInviteLinkCopied(false), 3000);
  };

  // Submit profile helper (Guest Simulation)
  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      onTriggerToast("Please enter your full name.", "info");
      return;
    }
    if (!guestCompany.trim()) {
      onTriggerToast("Please enter your company name.", "info");
      return;
    }

    const newAttendee: Attendee = {
      id: `att-${Date.now()}`,
      name: guestName,
      designation: guestTitle || "Director",
      company: guestCompany,
      industry: guestIndustry || "Business Services",
      status: 'Approved', // Auto-approved for frictionless demo
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      photoUrl: guestPhoto,
      logoUrl: guestLogo,
      city: "Mumbai",
      stateProv: "Maharashtra",
      country: "India",
      expertise: guestExpertise,
      isAnniversaryAttendee: true,
      sector: guestSector,
      bio: guestBio || "Highly focused industry professional dedicated to scaling enterprise operations.",
      linkedinUrl: guestLinkedIn || "https://linkedin.com",
      websiteUrl: guestWebsite || "https://example.com",
      emailAddress: guestEmail || "contact@example.com",
      phoneNumber: guestPhone || "+91 22 4912 3902",
      lookingFor: guestLookingFor || "Strategic business alliances and digital technology integration partners."
    };

    onAddAttendee(newAttendee);
    setIsPhotoSubmitted(true);
    onTriggerToast("Profile details submitted & approved! Added to the interactive eBook.", "success");
  };

  // Compile entire eBook mock trigger
  const handleCompileEBook = () => {
    setIsCompilingBook(true);
    const steps = [
      "Gathering all 500 attendee data nodes...",
      "Generating high-resolution vector circle-mask photos...",
      "Generating individual custom networking QR codes...",
      "Organizing business sectors & applying Saturday Club color boundaries...",
      "Compiling Alphabetical Index (Table of Contents)...",
      "Assembling print-ready commemorative PDF package!"
    ];

    let step = 0;
    setCompilingStep(steps[0]);

    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setCompilingStep(steps[step]);
      } else {
        clearInterval(interval);
        setIsCompilingBook(false);
        setCompilingStep("");
        onTriggerToast("Commemorative Anniversary eBook successfully compiled for printing!", "success");
        // Open PDF mockup download
        window.open('#download-ebook-demo', '_blank');
      }
    }, 1000);
  };

  // Clear guest form
  const handleResetGuestForm = () => {
    setGuestName("");
    setGuestTitle("");
    setGuestCompany("");
    setGuestBio("");
    setGuestEmail("");
    setGuestPhone("");
    setGuestLinkedIn("");
    setGuestWebsite("");
    setGuestLookingFor("");
    setGuestPhoto(PRESET_AVATARS[0]);
    setIsPhotoSubmitted(false);
  };

  const handleCustomGuestPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setGuestPhoto(uploadEvent.target.result as string);
          onTriggerToast("Custom headshot parsed successfully.", "success");
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Banner */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col md:flex-row items-center justify-between gap-4 ambient-shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-primary">Attendee Book & Roster Portal</h2>
            <p className="font-sans text-xs text-on-surface-variant">Create templates, share invitation forms, and compile the 10-year Anniversary ebook.</p>
          </div>
        </div>

        {/* Toggle between Admin Console and Public Guest Simulator */}
        <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant">
          <button
            onClick={() => setActiveMode('admin')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === 'admin' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Admin Console
          </button>
          <button
            onClick={() => setActiveMode('guest')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'guest' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-secondary-light" />
            <span>Guest Form Portal</span>
          </button>
        </div>
      </div>

      {/* ADMIN CONSOLE VIEW */}
      {activeMode === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Admin Sidebar Navigation / Info */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex flex-col gap-4">
              <h3 className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Book Milestones</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary">1. Create Template</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant leading-tight">Configured 4-sector layouts (Service, Construction, Manufacturing, Trading).</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary">2. Share Invitation Link</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant leading-tight">Send unique registration links directly to all 500 attendees.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary-container text-secondary flex items-center justify-center text-xs font-bold shrink-0 animate-pulse">3</div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary">3. Circle Photo Upload</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant leading-tight">Attendees crop headshot photos directly inside circular template boundaries.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant/60 flex items-center justify-center text-xs font-bold shrink-0">4</div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary">4. Export Individual PDF</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant leading-tight">Each attendee downloads their formatted page as print-ready PDF sheets.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant/60 flex items-center justify-center text-xs font-bold shrink-0">5</div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-primary">5. Index & E-Book Compiler</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant leading-tight">Compile directory instantly, sorted alphabetically with interactive TOC.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Share Link Widget */}
            <div className="bg-primary-container text-on-primary p-5 rounded-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="w-4 h-4 text-secondary-light" />
                  <span className="font-sans text-[10px] font-bold tracking-widest text-secondary-light uppercase">PUBLIC INVITATION LINK</span>
                </div>
                <p className="font-sans text-xs text-white/90 leading-relaxed mb-4">
                  Send this template link to your attendees. They can submit their information and crop their profile photo into a perfect circle.
                </p>
                
                <div className="bg-white/15 border border-white/10 rounded p-2 text-[11px] font-mono select-all truncate mb-4 text-white/80">
                  https://summit.gmg10.com/invite
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 bg-white hover:bg-white/95 text-primary py-2 px-3 rounded font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {inviteLinkCopied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setActiveMode('guest')}
                  className="bg-secondary text-white hover:bg-secondary/90 p-2 rounded transition-all cursor-pointer"
                  title="Test Invitation Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary opacity-10 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Admin Main Interactive Panel */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Nav within Admin Mode */}
            <div className="flex border-b border-outline-variant gap-6">
              <button
                onClick={() => setAdminTab('ebook')}
                className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  adminTab === 'ebook' 
                    ? 'border-secondary text-primary' 
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Commemorative E-Book Viewer
              </button>
              <button
                onClick={() => setAdminTab('template')}
                className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  adminTab === 'template' 
                    ? 'border-secondary text-primary' 
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Book Template Configurator
              </button>
            </div>

            {/* TAB 1: E-BOOK VIEWER COMPILER */}
            {adminTab === 'ebook' && (
              <div className="space-y-6">
                
                {/* Book Header Controls */}
                <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {/* Sector Filters */}
                    <select
                      value={ebookFilterSector}
                      onChange={(e) => {
                        setEbookFilterSector(e.target.value as any);
                        setEbookPage(0); // Reset to cover
                      }}
                      className="bg-white border border-outline-variant rounded px-3 py-1.5 text-xs font-bold uppercase outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
                    >
                      <option value="All">All Sectors</option>
                      <option value="Service">Service Sector</option>
                      <option value="Construction">Construction Sector</option>
                      <option value="Manufacturing">Manufacturing Sector</option>
                      <option value="Trading">Trading Sector</option>
                    </select>

                    <div className="relative flex-1 sm:w-60">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
                      <input
                        type="text"
                        placeholder="Search roster book..."
                        value={ebookSearch}
                        onChange={(e) => {
                          setEbookSearch(e.target.value);
                          setEbookPage(0); // Reset to cover
                        }}
                        className="w-full pl-9 pr-4 py-1.5 bg-white border border-outline-variant rounded text-xs outline-none focus:border-secondary transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!eventSettings.enableDownloads) {
                        onTriggerToast("Downloading is disabled. Enable it in Settings if needed.", "info");
                        return;
                      }
                      handleCompileEBook();
                    }}
                    disabled={isCompilingBook}
                    className={`w-full sm:w-auto py-2 px-5 rounded text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow transition-all ${
                      eventSettings.enableDownloads 
                        ? 'bg-primary text-white hover:bg-secondary cursor-pointer active:scale-95' 
                        : 'bg-surface-container-low text-on-surface-variant/40 border border-outline-variant/50 cursor-not-allowed opacity-65'
                    }`}
                  >
                    {isCompilingBook ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{isCompilingBook ? "Compiling..." : `Compile Complete eBook PDF${!eventSettings.enableDownloads ? " (Inactive)" : ""}`}</span>
                  </button>
                </div>

                {isCompilingBook && (
                  <div className="bg-secondary-container text-on-secondary-container border border-secondary/20 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                    <Sliders className="w-5 h-5 text-secondary animate-spin" />
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wide">Compiling Anniversary Volume...</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{compilingStep}</p>
                    </div>
                  </div>
                )}

                {/* DIGITALLY SIMULATED FLIPPING BOOK STAGE */}
                <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-12 relative flex flex-col items-center justify-center min-h-[580px] overflow-hidden">
                  
                  {/* Current Page Overlay Indicator */}
                  <div className="absolute top-4 right-6 bg-white/80 border border-outline-variant/50 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-on-surface-variant shadow-sm">
                    PAGE {ebookPage + 1} / {totalEbookPages}
                  </div>

                  {/* DIGITAL PAGE BODY CONTAINER */}
                  <div className="w-full max-w-2xl bg-white border border-outline-variant/70 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 transform hover:scale-[1.005] flex flex-col min-h-[460px]">
                    
                    {/* Dynamic Page Rendering */}
                    {ebookPage === 0 ? (
                      /* PAGE 0: BOOK COVER */
                      <div className="flex-1 bg-primary text-on-primary p-8 md:p-16 flex flex-col justify-between text-center relative overflow-hidden min-h-[440px]">
                        {/* Elegant Border Overlay */}
                        <div className="absolute inset-4 border border-secondary/35 pointer-events-none rounded"></div>
                        
                        <div className="flex flex-col items-center mt-6">
                          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-secondary mb-4 p-2">
                            <Award className="w-10 h-10 text-secondary-light" />
                          </div>
                          <span className="font-sans text-[11px] font-bold tracking-widest text-secondary-light uppercase">DECADE COMMEMORATION VOLUME</span>
                        </div>

                        <div className="my-8">
                          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                            {bookTitle}
                          </h1>
                          <p className="font-sans text-xs md:text-sm text-white/80 mt-3 font-semibold uppercase tracking-wider">
                            {bookSubTitle}
                          </p>
                        </div>

                        <div className="mb-6 flex flex-col items-center">
                          <div className="h-[2px] bg-secondary w-20 mb-4"></div>
                          <p className="font-display text-sm tracking-wider font-semibold text-white/90">SATURDAY CLUB GLOBAL TRUST</p>
                          <p className="font-sans text-[10px] text-white/60 tracking-wider mt-1 uppercase">10th Anniversary Directory (500+ Attendees)</p>
                        </div>

                        {/* Decorative golden accent circles */}
                        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border border-secondary/15"></div>
                        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-secondary/15"></div>
                      </div>
                    ) : ebookPage === 1 ? (
                      /* PAGE 1: CLUB BACKGROUND / INTRO */
                      <div className="flex-1 p-8 md:p-12 flex flex-col justify-between bg-surface-bright">
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                            <span className="text-[10px] font-bold tracking-widest text-secondary uppercase">INTRODUCTION</span>
                            <span className="text-on-surface-variant/40 text-xs">|</span>
                            <span className="text-xs font-bold text-on-surface-variant">Saturday Club Global Trust</span>
                          </div>

                          <h2 className="font-display text-2xl font-bold text-primary">A Decade of Empowering Entrepreneurs</h2>
                          
                          <div className="font-sans text-xs text-on-surface-variant space-y-4 leading-relaxed">
                            <p>
                              Founded ten years ago, the **Saturday Club Global Trust** has stood as an elite ecosystem designed to foster mutual growth, strategic business collaborations, and community upliftment for pioneering industrialists.
                            </p>
                            <p>
                              By grouping members into structured commerce clusters—namely <strong>Service, Construction, Manufacturing, and Trading</strong>—the club ensures highly specialized referral tracks, inter-sector trading alliances, and professional mentorship networks.
                            </p>
                            <p>
                              This 10th Anniversary Commemorative Book serves as a pristine registry of all registered attendees, directors, and trustees who have participated in building a robust economic pillar for global commerce.
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-outline-variant pt-4 flex justify-between items-center text-[10px] text-on-surface-variant/60 font-bold tracking-wider">
                          <span>SATURDAY CLUB GLOBAL TRUST</span>
                          <span>EST. 2014</span>
                        </div>
                      </div>
                    ) : ebookPage === 2 ? (
                      /* PAGE 2: RESPECTED TRUSTEES MESSAGE */
                      <div className="flex-1 p-8 md:p-12 flex flex-col justify-between bg-surface-bright">
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                            <span className="text-[10px] font-bold tracking-widest text-secondary uppercase">MESSAGE</span>
                            <span className="text-on-surface-variant/40 text-xs">|</span>
                            <span className="text-xs font-bold text-on-surface-variant">From the President's Desk</span>
                          </div>

                          <h2 className="font-display text-2xl font-bold text-primary">Bridging Business Boundaries</h2>

                          <div className="font-sans text-[11px] text-on-surface-variant leading-relaxed italic space-y-3">
                            <p>
                              "It is our distinct privilege to present this roster book detailing the profiles of 500+ esteemed business leaders at our 10-year Milestone Celebration. In this booklet, we have color-coded each delegate's company sector so you can effortlessly find potential partners to spark networking synergy."
                            </p>
                            <p>
                              "We wish you fruitful connections, prosperous alliances, and an inspiring experience during this historic Anniversary Summit."
                            </p>
                          </div>

                          {/* Trustees Signature Block */}
                          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-dashed border-outline-variant">
                            <div>
                              <p className="font-sans text-[11px] font-bold text-primary">Shri. Ramesh V. Kothari</p>
                              <p className="font-sans text-[9px] text-on-surface-variant">Founder President, SCGT</p>
                            </div>
                            <div>
                              <p className="font-sans text-[11px] font-bold text-primary">Dr. Anand S. Deshmukh</p>
                              <p className="font-sans text-[9px] text-on-surface-variant">National General Secretary</p>
                            </div>
                          </div>
                        </div>

                        <div className="text-[10px] text-on-surface-variant/60 font-bold tracking-wider text-right">
                          DECADE SUMMIT COMMEMORATIVE COMMITTEE
                        </div>
                      </div>
                    ) : ebookPage === 3 ? (
                      /* PAGE 3: ALPHABETICAL INDEX (TABLE OF CONTENTS) */
                      <div className="flex-1 p-8 md:p-12 flex flex-col bg-surface-bright">
                        <div className="flex items-center gap-2 border-b border-outline-variant pb-3 mb-4">
                          <span className="text-[10px] font-bold tracking-widest text-secondary uppercase">INDEX & REGISTER</span>
                          <span className="text-on-surface-variant/40 text-xs">|</span>
                          <span className="text-xs font-bold text-on-surface-variant">Alphabetical Directory Map</span>
                        </div>

                        <h3 className="font-sans text-xs font-bold text-primary mb-3">CLICK TO NAVIGATE TO DELEGATE SLIDE:</h3>

                        {filteredEbookAttendees.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-on-surface-variant/60">
                            <Users className="w-8 h-8 text-on-surface-variant/30 mb-2" />
                            <p className="font-semibold text-xs">No approved attendees found</p>
                            <p className="text-[10px] mt-1">Submit profiles in the wizard or import dummy data to populate the index.</p>
                          </div>
                        ) : (
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 overflow-y-auto max-h-[260px] pr-2 scrollbar-thin">
                            {filteredEbookAttendees.map((att, idx) => {
                              const sectorStyle = SECTOR_STYLES[att.sector || 'Service'];
                              return (
                                <button
                                  key={att.id}
                                  onClick={() => setEbookPage(totalIntroPages + idx)}
                                  className="text-left py-1 px-2 hover:bg-surface-container rounded transition-all text-[11px] flex items-center justify-between group cursor-pointer border border-transparent hover:border-outline-variant/30"
                                >
                                  <div className="truncate pr-1">
                                    <span className="font-semibold text-primary group-hover:text-secondary truncate">{att.name}</span>
                                    <p className="text-[9px] text-on-surface-variant truncate">{att.company}</p>
                                  </div>
                                  <span className={`w-1.5 h-1.5 rounded-full ${sectorStyle.badgeBg}`} title={att.sector}></span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <div className="mt-auto pt-4 border-t border-outline-variant flex items-center justify-between text-[10px] text-on-surface-variant/50 font-bold">
                          <span>Total Directory Listings: {filteredEbookAttendees.length}</span>
                          <span className="flex items-center gap-1.5 text-secondary">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> Service 
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Construction 
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span> Mfg 
                            <span className="w-2 h-2 rounded-full bg-green-600"></span> Trade
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* PAGE 4+: INDIVIDUAL DELEGATE PAGES */
                      activeAttendee && (
                        <div className="flex-1 flex flex-col justify-between bg-surface-bright relative">
                          
                          {/* Sector Accent Top/Side Colored Strip */}
                          <div className={`h-2 w-full ${SECTOR_STYLES[activeAttendee.sector || 'Service'].badgeBg}`}></div>

                          <div className="p-6 md:p-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            
                            {/* Left: Picture (Perfect circle with thick border), company logo, connect info */}
                            <div className="md:col-span-5 flex flex-col items-center text-center gap-4">
                              
                              {/* Circle Photo with custom border width */}
                              <div 
                                style={{ borderWidth: `${photoBorderSize}px` }}
                                className={`w-32 h-32 rounded-full overflow-hidden ${SECTOR_STYLES[activeAttendee.sector || 'Service'].border} shadow-lg bg-surface-container-high shrink-0`}
                              >
                                <img 
                                  referrerPolicy="no-referrer"
                                  src={activeAttendee.photoUrl} 
                                  alt={activeAttendee.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Sector Badge */}
                              <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider ${SECTOR_STYLES[activeAttendee.sector || 'Service'].badgeBg}`}>
                                {activeAttendee.sector || "Service"} Sector
                              </span>

                              {/* Company Logo and Title */}
                              <div className="flex items-center gap-2 mt-1">
                                {activeAttendee.logoUrl && (
                                  <div className="w-6 h-6 border border-outline-variant/50 rounded p-0.5 bg-white shrink-0">
                                    <img referrerPolicy="no-referrer" src={activeAttendee.logoUrl} className="w-full h-full object-contain" alt="Logo" />
                                  </div>
                                )}
                                <span className="font-sans text-xs font-bold text-primary truncate max-w-[120px]" title={activeAttendee.company}>
                                  {activeAttendee.company}
                                </span>
                              </div>

                              {/* QR Code mockup */}
                              {showQrCode && (
                                <div className="mt-1 p-2 bg-white border border-outline-variant/40 rounded shadow-sm flex flex-col items-center gap-1">
                                  <QrCode className="w-12 h-12 text-primary" />
                                  <span className="font-sans text-[7px] text-on-surface-variant font-bold tracking-widest uppercase">SCAN TO CONNECT</span>
                                </div>
                              )}
                            </div>

                            {/* Right: Detailed biography fields */}
                            <div className="md:col-span-7 space-y-4">
                              <div>
                                <h3 className={`font-display text-2xl font-black text-primary leading-none ${fontSizeTheme === 'serif' ? 'font-serif' : fontSizeTheme === 'classic' ? 'font-sans' : 'font-mono'}`}>
                                  {activeAttendee.name}
                                </h3>
                                <p className="text-secondary font-semibold text-xs tracking-wider mt-1.5 uppercase">
                                  {activeAttendee.designation}
                                </p>
                              </div>

                              {/* Biography */}
                              <div className="space-y-1">
                                <span className="font-sans text-[9px] font-bold text-on-surface-variant/70 uppercase tracking-widest">Biography</span>
                                <p className="font-sans text-xs text-on-surface-variant leading-relaxed text-justify">
                                  {activeAttendee.bio || `${activeAttendee.name} is the respected ${activeAttendee.designation} of ${activeAttendee.company}, contributing extensively to the sector through innovative operations and commerce networks.`}
                                </p>
                              </div>

                              {/* Looking to Connect For (From the User's PDF Instructions) */}
                              <div className={`p-3 rounded border-l-4 ${SECTOR_STYLES[activeAttendee.sector || 'Service'].bg} ${SECTOR_STYLES[activeAttendee.sector || 'Service'].border}`}>
                                <span className="font-sans text-[9px] font-bold text-primary uppercase tracking-widest block mb-0.5">Looking to Connect For</span>
                                <p className="font-sans text-xs text-on-surface-variant italic leading-normal">
                                  {activeAttendee.lookingFor || "Seeking supply chain optimizations and B2B joint venture partnerships."}
                                </p>
                              </div>

                              {/* Contact Icons Footer */}
                              {showSocialIcons && (
                                <div className="pt-2 border-t border-outline-variant flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-on-surface-variant font-medium">
                                  {activeAttendee.emailAddress && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="w-3.5 h-3.5 text-on-surface-variant/70" />
                                      <span className="truncate max-w-[120px]">{activeAttendee.emailAddress}</span>
                                    </div>
                                  )}
                                  {activeAttendee.phoneNumber && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3.5 h-3.5 text-on-surface-variant/70" />
                                      <span>{activeAttendee.phoneNumber}</span>
                                    </div>
                                  )}
                                  {activeAttendee.linkedinUrl && (
                                    <a href={activeAttendee.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                      <Linkedin className="w-3.5 h-3.5" />
                                      <span>LinkedIn</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Footer with page details */}
                          <div className="bg-surface-container-low p-3 border-t border-outline-variant/40 flex items-center justify-between text-[9px] text-on-surface-variant/60 font-bold px-6">
                            <span>GMG 10th Anniversary Commemorative Book</span>
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3 text-secondary" />
                              <span>SATURDAY CLUB GLOBAL TRUST</span>
                            </span>
                          </div>
                        </div>
                      )
                    )}

                  </div>

                  {/* BOTTOM BOOK CONTROLLERS */}
                  <div className="flex items-center gap-6 mt-8">
                    <button
                      onClick={() => setEbookPage(prev => Math.max(0, prev - 1))}
                      disabled={ebookPage === 0}
                      className="w-10 h-10 bg-white border border-outline-variant rounded-full flex items-center justify-center hover:bg-surface-container transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-5 h-5 text-primary" />
                    </button>

                    <span className="font-mono text-xs font-bold text-on-surface-variant">
                      Page {ebookPage + 1} of {totalEbookPages}
                    </span>

                    <button
                      onClick={() => setEbookPage(prev => Math.min(totalEbookPages - 1, prev + 1))}
                      disabled={ebookPage === totalEbookPages - 1}
                      className="w-10 h-10 bg-white border border-outline-variant rounded-full flex items-center justify-center hover:bg-surface-container transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-40"
                    >
                      <ChevronRight className="w-5 h-5 text-primary" />
                    </button>
                  </div>

                  {/* Table of Contents jump panel quick link */}
                  {ebookPage !== 3 && (
                    <button
                      onClick={() => setEbookPage(3)}
                      className="mt-4 font-sans text-xs font-semibold text-secondary hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Jump to Alphabetical Table of Contents Index</span>
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: BOOK TEMPLATE CONFIGURATOR */}
            {adminTab === 'template' && (
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant space-y-6">
                <div className="flex items-center gap-2 border-b border-outline-variant pb-4">
                  <Settings className="w-5 h-5 text-secondary" />
                  <h3 className="font-sans text-lg font-bold text-primary">Master Directory Template Customizer</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Form config options */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Anniversary Volume Title</label>
                      <input
                        type="text"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        className="w-full bg-white border border-outline-variant rounded px-3 py-2 text-xs text-primary focus:border-secondary outline-none font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Subtitle Description</label>
                      <input
                        type="text"
                        value={bookSubTitle}
                        onChange={(e) => setBookSubTitle(e.target.value)}
                        className="w-full bg-white border border-outline-variant rounded px-3 py-2 text-xs text-primary focus:border-secondary outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Photo Frame Border</label>
                        <select
                          value={photoBorderSize}
                          onChange={(e) => setPhotoBorderSize(Number(e.target.value))}
                          className="w-full bg-white border border-outline-variant rounded px-3 py-2 text-xs focus:border-secondary outline-none cursor-pointer"
                        >
                          <option value={0}>0px (No Border)</option>
                          <option value={2}>2px (Thin)</option>
                          <option value={4}>4px (Medium Gold)</option>
                          <option value={6}>6px (Thick Ring)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Typography Theme</label>
                        <select
                          value={fontSizeTheme}
                          onChange={(e) => setFontSizeTheme(e.target.value as any)}
                          className="w-full bg-white border border-outline-variant rounded px-3 py-2 text-xs focus:border-secondary outline-none cursor-pointer"
                        >
                          <option value="serif">Serif (Editorial / Premium)</option>
                          <option value="sans">Sans-serif (Modern Minimalist)</option>
                          <option value="classic">Mono (Technical Grid)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Page Component Inclusions</label>
                      
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2.5 text-xs text-on-surface-variant cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showQrCode}
                            onChange={(e) => setShowQrCode(e.target.checked)}
                            className="rounded border-outline-variant text-secondary focus:ring-secondary accent-secondary cursor-pointer"
                          />
                          <span>Render custom contact networking QR code for each guest</span>
                        </label>

                        <label className="flex items-center gap-2.5 text-xs text-on-surface-variant cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showSocialIcons}
                            onChange={(e) => setShowSocialIcons(e.target.checked)}
                            className="rounded border-outline-variant text-secondary focus:ring-secondary accent-secondary cursor-pointer"
                          />
                          <span>Show interactive contact elements (LinkedIn, Web, Phone)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right: Graphic mockup explanatory guide of Friday / Saturday Club roster layout */}
                  <div className="bg-surface-container rounded-lg p-5 border border-outline-variant/60 flex flex-col justify-center text-center space-y-4">
                    <Award className="w-10 h-10 text-secondary mx-auto animate-pulse" />
                    <h4 className="font-sans text-xs font-bold text-primary uppercase">Saturday Club Roster Grid Compliance</h4>
                    <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                      Our system generates standardized vector-rendered container slides that strictly maintain the color-coded borders matching the user's industry sector. This ensures zero visual overlapping and yields high-fidelity printable pages when compiled.
                    </p>
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      <div className="p-1 border border-blue-600 bg-blue-50 text-[9px] font-bold text-blue-700 rounded">Service</div>
                      <div className="p-1 border border-amber-500 bg-amber-50 text-[9px] font-bold text-amber-700 rounded">Construction</div>
                      <div className="p-1 border border-orange-500 bg-orange-50 text-[9px] font-bold text-orange-700 rounded">Manufacturing</div>
                      <div className="p-1 border border-green-600 bg-green-50 text-[9px] font-bold text-green-700 rounded">Trading</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant flex justify-end">
                  <button
                    onClick={() => {
                      onTriggerToast("Master Book template configuration saved and synced!", "success");
                      setAdminTab('ebook');
                    }}
                    className="bg-primary text-white hover:bg-secondary py-2 px-5 rounded text-xs font-bold tracking-wider uppercase transition-all cursor-pointer active:scale-95"
                  >
                    Save & Apply Config
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* GUEST SELF-REGISTRATION SIMULATION VIEW */}
      {activeMode === 'guest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Input Form for Guest */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant premium-shadow space-y-6">
              
              <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-secondary" />
                  <div>
                    <h3 className="font-sans text-base font-bold text-primary">Decade Commemoration Directory Registration</h3>
                    <p className="font-sans text-[10px] text-on-surface-variant">Submit your professional details & circle cropped photo to the compiled volume.</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleResetGuestForm}
                  className="text-on-surface-variant hover:text-red-600 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  Clear Form
                </button>
              </div>

              {/* Photo Circular Crop Tool Section */}
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Crop className="w-3.5 h-3.5 text-secondary" />
                    <span>Circle Crop Alignment Tool</span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-medium">Drag-zoom to center headshot inside the circle</span>
                </div>

                {!eventSettings.enableGuestPhotoSelection && (
                  <div className="bg-amber-50/85 border border-amber-200/50 p-2.5 rounded-lg flex items-center gap-2 text-amber-800 text-[11px] font-sans">
                    <span>⚠️ Photo selection and adjustments have been deactivated for this guest form by the administrator.</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  
                  {/* Circle Mask Container */}
                  <div className={`relative group w-32 h-32 rounded-full border-2 overflow-hidden bg-surface-bright shadow-inner shrink-0 flex items-center justify-center transition-all ${
                    eventSettings.enableGuestPhotoSelection 
                      ? 'border-secondary hover:border-primary cursor-pointer' 
                      : 'border-outline-variant/30 opacity-75'
                  }`}>
                    <img 
                      referrerPolicy="no-referrer"
                      src={guestPhoto} 
                      alt="Crop Preview" 
                      style={{
                        transform: `scale(${photoZoom}) rotate(${photoRotate}deg)`,
                        transition: 'transform 0.1s ease-out'
                      }}
                      className="w-full h-full object-cover origin-center"
                    />
                    
                    {/* Circle Framing Ring Guide overlay */}
                    <div className="absolute inset-0 border-2 border-white/50 rounded-full pointer-events-none"></div>

                    {eventSettings.enableGuestPhotoSelection && (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-5 h-5 text-white" />
                        <span className="text-[9px] text-white font-bold uppercase mt-1">Upload Photo</span>
                      </div>
                    )}

                    <input 
                      type="file" 
                      accept="image/*"
                      disabled={!eventSettings.enableGuestPhotoSelection}
                      onChange={handleCustomGuestPhotoUpload}
                      className={`absolute inset-0 opacity-0 ${eventSettings.enableGuestPhotoSelection ? 'cursor-pointer' : 'cursor-not-allowed'}`} 
                    />
                  </div>

                  {/* Sliders for Simulation */}
                  <div className={`flex-1 w-full space-y-3 ${!eventSettings.enableGuestPhotoSelection ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant">
                        <span>Zoom Alignment</span>
                        <span>{Math.round(photoZoom * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={photoZoom}
                        disabled={!eventSettings.enableGuestPhotoSelection}
                        onChange={(e) => setPhotoZoom(Number(e.target.value))}
                        className="w-full accent-secondary h-1 bg-surface-container rounded-lg cursor-pointer disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant">
                        <span>Rotation</span>
                        <span>{photoRotate}°</span>
                      </div>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={photoRotate}
                        disabled={!eventSettings.enableGuestPhotoSelection}
                        onChange={(e) => setPhotoRotate(Number(e.target.value))}
                        className="w-full accent-secondary h-1 bg-surface-container rounded-lg cursor-pointer disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Pre-set Avatars Picker */}
                    <div className="space-y-1 pt-1">
                      <span className="font-sans text-[9px] font-bold uppercase text-on-surface-variant/70 tracking-wider block">Or select template test avatar:</span>
                      <div className="flex gap-2">
                        {PRESET_AVATARS.map((url, i) => (
                          <button
                            type="button"
                            key={i}
                            disabled={!eventSettings.enableGuestPhotoSelection}
                            onClick={() => {
                              setGuestPhoto(url);
                              onTriggerToast("Template avatar selected.", "success");
                            }}
                            className={`w-7 h-7 rounded-full overflow-hidden border transition-all ${
                              !eventSettings.enableGuestPhotoSelection
                                ? 'border-outline-variant/30 cursor-not-allowed opacity-50'
                                : guestPhoto === url ? 'border-secondary ring-1 ring-secondary' : 'border-outline-variant hover:border-secondary cursor-pointer'
                            }`}
                          >
                            <img referrerPolicy="no-referrer" src={url} alt="avatar option" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Form Input Grid */}
              <form onSubmit={handleGuestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh K. Patel"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded px-3 py-1.5 text-xs text-primary focus:border-secondary outline-none font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Founder & Chairman"
                      value={guestTitle}
                      onChange={(e) => setGuestTitle(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded px-3 py-1.5 text-xs text-primary focus:border-secondary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patel Industries Ltd"
                      value={guestCompany}
                      onChange={(e) => setGuestCompany(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded px-3 py-1.5 text-xs text-primary focus:border-secondary outline-none font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Commerce Sector (Color Coded)</label>
                    <select
                      value={guestSector}
                      onChange={(e) => setGuestSector(e.target.value as any)}
                      className="w-full bg-white border border-outline-variant rounded px-3 py-1.5 text-xs text-primary focus:border-secondary outline-none cursor-pointer font-semibold"
                    >
                      <option value="Service">Service Sector (Blue Border)</option>
                      <option value="Construction">Construction Sector (Yellow Border)</option>
                      <option value="Manufacturing">Manufacturing Sector (Orange Border)</option>
                      <option value="Trading">Trading Sector (Green Border)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Short Biography</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your business background, operations, and legacy..."
                    value={guestBio}
                    onChange={(e) => setGuestBio(e.target.value)}
                    className="w-full bg-white border border-outline-variant rounded px-3 py-1.5 text-xs text-primary focus:border-secondary outline-none font-sans"
                  />
                </div>

                {/* Looking To Connect For - Friday Club PDF Special Field */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] font-bold text-secondary uppercase tracking-widest block">What are you looking to connect for?</label>
                  <input
                    type="text"
                    placeholder="e.g. Seeking bulk buyers for sustainable packaging, looking for financial audits..."
                    value={guestLookingFor}
                    onChange={(e) => setGuestLookingFor(e.target.value)}
                    className="w-full bg-white border border-secondary/40 rounded px-3 py-2 text-xs text-primary focus:border-secondary outline-none italic font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@patelind.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded px-3 py-1.5 text-xs text-primary focus:border-secondary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98200 12345"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded px-3 py-1.5 text-xs text-primary focus:border-secondary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">LinkedIn URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/rameshpatel"
                      value={guestLinkedIn}
                      onChange={(e) => setGuestLinkedIn(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded px-3 py-1.5 text-xs text-primary focus:border-secondary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Company Website</label>
                    <input
                      type="url"
                      placeholder="https://patelindustries.com"
                      value={guestWebsite}
                      onChange={(e) => setGuestWebsite(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded px-3 py-1.5 text-xs text-primary focus:border-secondary outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                    <Info className="w-4 h-4 text-secondary shrink-0" />
                    <span>Auto-saves to commemorative list after submission</span>
                  </div>

                  <div className="flex gap-3">
                    {/* STEP 4: DOWNLOAD INDIVIDUAL PDF PROFILE */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!eventSettings.enableDownloads) {
                          onTriggerToast("Downloading is disabled. Enable it in Settings if needed.", "info");
                          return;
                        }
                        onTriggerToast("Rendering single-page profile sheet... Print document successfully compiled!", "success");
                        setPrintCardActive({
                          id: "att-guest-mock",
                          name: guestName || "Attendee Name Placeholder",
                          designation: guestTitle || "Your Title",
                          company: guestCompany || "Your Company",
                          industry: guestIndustry,
                          status: 'Approved',
                          dateSubmitted: "Today",
                          photoUrl: guestPhoto,
                          logoUrl: guestLogo,
                          city: "Mumbai",
                          stateProv: "Maharashtra",
                          country: "India",
                          expertise: guestExpertise,
                          isAnniversaryAttendee: true,
                          sector: guestSector,
                          bio: guestBio || "Your professional biography.",
                          linkedinUrl: guestLinkedIn,
                          websiteUrl: guestWebsite,
                          emailAddress: guestEmail,
                          phoneNumber: guestPhone,
                          lookingFor: guestLookingFor
                        });
                      }}
                      className={`py-2.5 px-4 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all ${
                        eventSettings.enableDownloads 
                          ? 'bg-white border border-outline-variant hover:bg-surface-container cursor-pointer active:scale-95 text-primary' 
                          : 'bg-surface-container-low border border-outline-variant/50 text-on-surface-variant/40 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Printer className="w-4 h-4" />
                      <span>Download PDF Profile Sheet {!eventSettings.enableDownloads && "(Inactive)"}</span>
                    </button>

                    <button
                      type="submit"
                      className="bg-primary text-white hover:bg-secondary py-2.5 px-5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4 text-secondary-light" />
                      <span>Submit Profile</span>
                    </button>
                  </div>
                </div>
              </form>

            </div>

          </div>

          {/* Right: Live Dynamic Template Rendering Card preview */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="font-sans text-[10px] font-bold text-on-surface-variant/70 tracking-widest text-center uppercase">LIVE COMPLETED TEMPLATE VIEW</h4>

            <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden premium-shadow max-w-sm mx-auto flex flex-col">
              
              {/* Sector Border Ring Indicator */}
              <div className={`h-2.5 w-full ${SECTOR_STYLES[guestSector].badgeBg}`}></div>

              <div className="p-6 flex flex-col items-center text-center">
                
                {/* Badge Indicator */}
                <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 border border-secondary/20">
                  <Sparkles className="w-3 h-3 text-secondary" />
                  <span>10th ANNIVERSARY</span>
                </div>

                {/* Circle photo crop alignment simulator preview */}
                <div className={`w-28 h-28 rounded-full border-4 ${SECTOR_STYLES[guestSector].border} overflow-hidden bg-surface-container shadow-md shrink-0 flex items-center justify-center relative mb-4`}>
                  <img 
                    referrerPolicy="no-referrer"
                    src={guestPhoto} 
                    alt="Live crop preview" 
                    style={{
                      transform: `scale(${photoZoom}) rotate(${photoRotate}deg)`,
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider mb-2 ${SECTOR_STYLES[guestSector].badgeBg}`}>
                  {guestSector} Sector
                </span>

                <h3 className="font-display text-2xl font-black text-primary leading-tight tracking-tight">
                  {guestName || "Ramesh K. Patel"}
                </h3>
                
                <p className="text-secondary font-semibold text-xs tracking-wide uppercase mt-1">
                  {guestTitle || "Founder & Chairman"}
                </p>

                <div className="flex items-center gap-2 mt-3 mb-4">
                  <div className="w-7 h-7 flex items-center justify-center border border-outline-variant rounded p-1 bg-white shrink-0">
                    <img referrerPolicy="no-referrer" src={guestLogo} className="w-full h-full object-contain" alt="Logo" />
                  </div>
                  <span className="text-on-surface font-bold text-xs">
                    {guestCompany || "Patel Industries Ltd"}
                  </span>
                </div>

                {/* Biography Section */}
                <div className="w-full text-left py-3 border-t border-dashed border-outline-variant">
                  <span className="font-sans text-[9px] font-bold text-on-surface-variant/70 uppercase tracking-widest block mb-1">BIOGRAPHY</span>
                  <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed text-justify">
                    {guestBio || "Enter your short profile biography on the left. It will be dynamically rendered here in the final 10-Year commemorative directory book."}
                  </p>
                </div>

                {/* Connect special request */}
                <div className={`w-full text-left p-3 rounded border-l-4 ${SECTOR_STYLES[guestSector].bg} ${SECTOR_STYLES[guestSector].border} mb-4`}>
                  <span className="font-sans text-[8px] font-bold text-primary uppercase tracking-widest block mb-0.5">LOOKING TO CONNECT FOR</span>
                  <p className="font-sans text-[11px] text-on-surface-variant italic leading-normal">
                    {guestLookingFor || "Strategic referral alliances and trade collaborations across sectors."}
                  </p>
                </div>

                {/* Social icons */}
                <div className="w-full flex items-center justify-center gap-4 py-2 border-t border-outline-variant/50 text-on-surface-variant">
                  <div className="flex items-center gap-1 text-[10px]">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{guestEmail ? "Provided" : "No Email"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{guestLinkedIn ? "Provided" : "No LinkedIn"}</span>
                  </div>
                </div>

                {/* Print confirmation check */}
                {isPhotoSubmitted && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-left flex items-center gap-2 w-full animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <p className="font-sans text-[10px] text-green-700 leading-normal">
                      <strong>Profile Locked & Approved:</strong> Your card has been successfully compiled into the Saturday Club Global Trust digital database.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* INDIVIDUAL PROFILE SHEET PRINT DIALOG SIMULATOR */}
      {printCardActive && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-fade-in">
          <div className="bg-white border border-outline-variant rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col">
            
            {/* Header Dialog Controls */}
            <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
              <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-secondary" />
                <span>Standard PDF Page Layout Compiler (Print Preview)</span>
              </span>
              <button
                onClick={() => setPrintCardActive(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center font-bold text-primary text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* HIGH FIDELITY PRINT RENDER STAGE */}
            <div className="p-8 bg-white flex flex-col justify-center items-center overflow-y-auto max-h-[460px]">
              
              <div className="w-full max-w-sm bg-white border border-outline-variant/60 rounded p-6 shadow-md relative flex flex-col text-center">
                
                {/* Saturday Club Global Trust official top banner */}
                <div className="border-b border-outline-variant pb-2.5 mb-4 flex items-center justify-between text-left">
                  <div>
                    <h5 className="font-sans text-[9px] font-bold text-primary tracking-wider uppercase">SATURDAY CLUB GLOBAL TRUST</h5>
                    <p className="font-sans text-[7px] text-on-surface-variant uppercase tracking-widest mt-0.5">10th Anniversary Commemorative Volume</p>
                  </div>
                  <Award className="w-5 h-5 text-secondary shrink-0" />
                </div>

                {/* Circle photo crop preview */}
                <div className={`w-24 h-24 rounded-full border-4 ${SECTOR_STYLES[printCardActive.sector || 'Service'].border} overflow-hidden bg-surface-container shadow-md shrink-0 mx-auto mb-4`}>
                  <img referrerPolicy="no-referrer" src={printCardActive.photoUrl} className="w-full h-full object-cover" alt="Avatar Print Preview" />
                </div>

                <span className={`px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-wider mx-auto mb-2 ${SECTOR_STYLES[printCardActive.sector || 'Service'].badgeBg}`}>
                  {printCardActive.sector} Sector
                </span>

                <h3 className="font-display text-xl font-bold text-primary">
                  {printCardActive.name}
                </h3>
                
                <p className="text-secondary font-semibold text-[11px] tracking-wide uppercase mt-0.5">
                  {printCardActive.designation}
                </p>

                <p className="text-on-surface-variant font-bold text-xs mt-2 mb-4">
                  {printCardActive.company}
                </p>

                <div className="text-left space-y-3 py-3 border-t border-outline-variant/50">
                  <div>
                    <span className="font-sans text-[8px] font-bold text-on-surface-variant/70 uppercase tracking-widest block">Biography</span>
                    <p className="font-sans text-[10px] text-on-surface-variant leading-relaxed text-justify">
                      {printCardActive.bio || "No biography provided. Standard text placeholder for directory sheet."}
                    </p>
                  </div>

                  <div className={`p-2.5 rounded border-l-4 ${SECTOR_STYLES[printCardActive.sector || 'Service'].bg} ${SECTOR_STYLES[printCardActive.sector || 'Service'].border}`}>
                    <span className="font-sans text-[8px] font-bold text-primary uppercase tracking-widest block mb-0.5">Looking to Connect For</span>
                    <p className="font-sans text-[10px] text-on-surface-variant italic leading-normal">
                      {printCardActive.lookingFor || "Seeking supply chain logistics, trading alliances, or investment opportunities."}
                    </p>
                  </div>
                </div>

                {/* Footer details */}
                <div className="pt-3 border-t border-outline-variant flex items-center justify-between text-[8px] text-on-surface-variant/60 font-bold">
                  <span>Page Code: #SCGT-{(printCardActive.sector || 'SVC').slice(0, 3)}-102</span>
                  <span>Contact: {printCardActive.phoneNumber || 'Anniversary Registry'}</span>
                </div>

              </div>

              <div className="mt-6 flex gap-3 text-center">
                <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-normal">
                  Our system generates native Vector-SVG buffers, compatible with Canva Bulk Create and PDF standard printers.
                </p>
              </div>

            </div>

            {/* Dialog Footer */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-end gap-3">
              <button
                onClick={() => setPrintCardActive(null)}
                className="bg-white border border-outline-variant px-4 py-2 rounded text-xs font-bold uppercase cursor-pointer transition-all hover:bg-surface-container"
              >
                Close Preview
              </button>
              
              <button
                onClick={() => {
                  if (!eventSettings.enableDownloads) {
                    onTriggerToast("Downloading is disabled. Enable it in Settings if needed.", "info");
                    return;
                  }
                  onTriggerToast("Downloading high-definition PDF print asset...", "success");
                  window.print();
                  setPrintCardActive(null);
                }}
                className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-all ${
                  eventSettings.enableDownloads 
                    ? 'bg-primary text-white hover:bg-secondary cursor-pointer active:scale-95' 
                    : 'bg-surface-container-low text-on-surface-variant/40 border border-outline-variant/50 cursor-not-allowed opacity-60'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Save PDF Asset {!eventSettings.enableDownloads && "(Inactive)"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
