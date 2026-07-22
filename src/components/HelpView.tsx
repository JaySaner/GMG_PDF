/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  FileSpreadsheet, 
  Layers, 
  Clock, 
  Calendar,
  User,
  ShieldAlert,
  ArrowRight,
  ClipboardList
} from 'lucide-react';

interface HelpViewProps {
  onNavigateToTab: (tab: string) => void;
  onBookMeeting: () => void;
}

export default function HelpView({ onNavigateToTab, onBookMeeting }: HelpViewProps) {
  const [activeWorkflow, setActiveWorkflow] = useState<'admin' | 'user'>('admin');

  const adminFeatures = [
    {
      icon: <Settings className="w-5 h-5 text-secondary" />,
      title: "Global Customization",
      desc: "Customize event branding, year markers, anniversary banners, and scheduled deadlines in Platform Setup."
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5 text-secondary" />,
      title: "CSV Bulk Parsing & Import",
      desc: "Ingest hundreds of invitees in seconds. Parse roster CSV tables into individual editable delegate records."
    },
    {
      icon: <ClipboardList className="w-5 h-5 text-secondary" />,
      title: "Live Action Moderation",
      desc: "Quickly screen entries. Move records between Approved, Needs Changes, Under Review, or Rejected with real-time stat recalculations."
    },
    {
      icon: <Layers className="w-5 h-5 text-secondary" />,
      title: "eBook Compiling & Indexing",
      desc: "Order pages using fluid drag-and-drop lists, customize covers, render indexes automatically, and simulate print-ready PDF generation."
    }
  ];

  const userFeatures = [
    {
      icon: <User className="w-5 h-5 text-primary" />,
      title: "Delegate Profile Wizard",
      desc: "Fill in full names, designations, corporate affiliations, and exact industry sectors."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-primary" />,
      title: "Circle Photo & Logo Alignment",
      desc: "Upload a personal headshot automatically cropped into a high-end circle, and pair it with a corporate brand mark."
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      title: "10-Year Milestone Badge",
      desc: "Apply commemorative visual markers recognizing decade-long association with the Global Maritime Group."
    },
    {
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      title: "Print-Ready Validation",
      desc: "Observe dynamic typographic rendering on standard double-column layout grids prior to final ebook generation."
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header section */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-4xl font-bold text-primary tracking-tight">Interactive Workflow & Support Portal</h2>
        <p className="font-sans text-sm text-on-surface-variant max-w-xl mx-auto">
          Explore complete step-by-step delegate workflows, check integrated platform capabilities, or book direct anniversary alignment consulting.
        </p>
      </div>

      {/* Tabs to select Admin vs User workflow */}
      <div className="flex justify-center border-b border-outline-variant max-w-md mx-auto">
        <button
          onClick={() => setActiveWorkflow('admin')}
          className={`flex-1 pb-3 text-sm font-bold tracking-wider uppercase transition-all border-b-2 cursor-pointer ${
            activeWorkflow === 'admin' 
              ? 'border-secondary text-secondary' 
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Admin Console Workflow
        </button>
        <button
          onClick={() => setActiveWorkflow('user')}
          className={`flex-1 pb-3 text-sm font-bold tracking-wider uppercase transition-all border-b-2 cursor-pointer ${
            activeWorkflow === 'user' 
              ? 'border-secondary text-secondary' 
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Delegate Portal Workflow
        </button>
      </div>

      {/* Workflow content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left column: Steps flow */}
        <div className="md:col-span-7 space-y-6">
          {activeWorkflow === 'admin' ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-5 h-5 text-secondary" />
                <h3 className="font-sans text-base font-bold text-primary uppercase tracking-wide">Admin Role: Directory & Book Management</h3>
              </div>

              <div className="relative pl-8 border-l border-outline-variant/50 space-y-8 text-left">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-primary">Setup Event Settings</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Configure the official 10-Year event title, set key timelines, opening and closing dates, and template parameters under the <strong>Platform Setup</strong> tab.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-primary">Ingest Delegate Roster</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Upload your invitation lists. Use the <strong>Attendees Directory CSV Import</strong> feature on the Dashboard to bulk populate pending delegate profiles.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-primary">Review & Moderate Submissions</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Review bios, images, and corporate logos in the directory. Transition statuses seamlessly. Approved entries are fast-tracked to the ebook pool, while those marked <i>Needs Changes</i> are flagged for revisions.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-primary">Compile, Index, and Build the E-Book</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Navigate to <strong>eBook Builder</strong>. Define editorial layouts, customize covers, drag-and-drop records to sort the Index, and generate the finished commemorative delegate directory.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-sans text-base font-bold text-primary uppercase tracking-wide">Delegate Role: Self-Service Submission</h3>
              </div>

              <div className="relative pl-8 border-l border-outline-variant/50 space-y-8 text-left">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-primary">Access Profile Submission Link</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Delegates receive a custom invitation link directing them to the secure Profile Completion Wizard.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-primary">Fill Personal & Affiliation Details</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Enter corporate designation, company details, select target expertise areas (e.g. Asset Management, Supply Chain), and toggles anniversary milestone badges.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-primary">Upload Circular Headshot & Logo</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Upload personal headshots which the portal automatically fits into a clean, modern geometric circular mask. Add corporate logos to accompany professional profiles.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-primary">Validate & Instant PDF Export</h4>
                    <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Validate visual alignments on the high-fidelity card preview. Submit the details directly to the admin moderation queue for publishing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Integrated Features Grid */}
        <div className="md:col-span-5 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant premium-shadow text-left space-y-6">
          <div>
            <h3 className="font-sans text-base font-bold text-primary uppercase tracking-wide">Integrated Feature Suite</h3>
            <p className="font-sans text-xs text-on-surface-variant mt-1">
              Active tools integrated to manage your 10-Year Anniversary Book.
            </p>
          </div>

          <div className="space-y-4">
            {(activeWorkflow === 'admin' ? adminFeatures : userFeatures).map((feature, idx) => (
              <div key={idx} className="flex gap-3.5 items-start">
                <div className="p-2 bg-surface-container rounded-lg shrink-0 mt-0.5">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold text-primary uppercase tracking-wider">{feature.title}</h4>
                  <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-outline-variant flex flex-col gap-3">
            <button 
              onClick={() => onNavigateToTab('dashboard')}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded text-xs font-bold tracking-wider uppercase hover:bg-secondary transition-colors cursor-pointer shadow active:scale-95"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onBookMeeting}
              className="w-full bg-surface-container-high text-on-surface text-xs font-bold tracking-wider uppercase py-2.5 rounded hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-95 text-center"
            >
              Book Alignment Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
