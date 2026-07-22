/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  Award, 
  HelpCircle, 
  Info,
  CalendarCheck,
  CalendarDays,
  BookOpen,
  Share2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBookMeeting: () => void;
  onShareLink?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onBookMeeting, onShareLink }: SidebarProps) {
  return (
    <aside id="sidebar-container" className="hidden md:flex flex-col h-screen sticky top-0 w-64 bg-surface-container-low border-r border-outline-variant py-4 px-4 shrink-0 z-30">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3 px-1">
        <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center text-on-secondary-container">
          <Award className="w-6 h-6 text-secondary-light" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold leading-tight text-primary">GMG Portal</h1>
          <p className="font-sans text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase">Admin Console</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-on-secondary-container bg-secondary-container font-bold translate-x-1'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('attendees')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
            activeTab === 'attendees'
              ? 'text-on-secondary-container bg-secondary-container font-bold translate-x-1'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>Attendees</span>
        </button>

        <button
          onClick={() => setActiveTab('wizard')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
            activeTab === 'wizard'
              ? 'text-on-secondary-container bg-secondary-container font-bold translate-x-1'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>Profile Wizard</span>
        </button>

        <button
          onClick={() => setActiveTab('ebook')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
            activeTab === 'ebook'
              ? 'text-on-secondary-container bg-secondary-container font-bold translate-x-1'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0 text-secondary-light" />
          <span>eBook Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
            activeTab === 'events'
              ? 'text-on-secondary-container bg-secondary-container font-bold translate-x-1'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          <CalendarDays className="w-4 h-4 shrink-0" />
          <span>Events</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
            activeTab === 'settings'
              ? 'text-on-secondary-container bg-secondary-container font-bold translate-x-1'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Sidebar Footer & Actions */}
      <div className="mt-auto space-y-2 border-t border-outline-variant pt-4">
        {onShareLink && (
          <button
            onClick={onShareLink}
            className="w-full bg-primary hover:bg-secondary text-white py-2.5 px-4 rounded font-bold text-xs tracking-wider uppercase shadow hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Share2 className="w-3.5 h-3.5 text-secondary-light" />
            <span>Share Attendee Link</span>
          </button>
        )}

        <button
          onClick={onBookMeeting}
          className="w-full bg-secondary hover:bg-secondary/90 text-white py-2 px-4 rounded font-semibold text-xs tracking-wider uppercase shadow hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
        >
          Book Meeting
        </button>
        
        <div className="space-y-1">
          <a
            href="#help"
            onClick={(e) => { e.preventDefault(); setActiveTab('help'); }}
            className="flex items-center gap-3 px-4 py-1.5 text-on-surface-variant/80 hover:text-secondary text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Help Center</span>
          </a>
          
          <div className="flex items-center gap-3 px-4 py-1.5 text-on-surface-variant/40 text-xs font-semibold tracking-wider uppercase">
            <Info className="w-4 h-4 shrink-0" />
            <span>Version 10.4.2</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
