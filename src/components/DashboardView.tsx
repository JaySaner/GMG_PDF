/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Zap, 
  BookOpen, 
  Upload, 
  UserPlus, 
  CheckCircle2, 
  FileEdit, 
  Mail,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Attendee, Activity, EventSettings } from '../types';

interface DashboardViewProps {
  attendees: Attendee[];
  activities: Activity[];
  eventSettings: EventSettings;
  onNavigateToTab: (tab: string) => void;
  onUploadCSV: () => void;
  onTriggerToast: (message: string, type: 'success' | 'info') => void;
  onReviewAttendee: (attendeeId: string) => void;
}

export default function DashboardView({
  attendees,
  activities,
  eventSettings,
  onNavigateToTab,
  onUploadCSV,
  onTriggerToast,
  onReviewAttendee
}: DashboardViewProps) {
  const [chartRange, setChartRange] = useState<'7' | '30'>('7');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [isGeneratingBook, setIsGeneratingBook] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  // Dynamic calculations based on current attendee state
  const totalApproved = attendees.filter(a => a.status === 'Approved').length;
  const totalPending = attendees.filter(a => a.status === 'Under Review').length;
  const totalNeedsChanges = attendees.filter(a => a.status === 'Needs Changes').length;
  const totalRejected = attendees.filter(a => a.status === 'Rejected').length;
  
  // Real-time statistics based entirely on actual attendees
  const displayTotalApplicants = attendees.length; 
  const displayApproved = totalApproved;
  const displayPending = totalPending + totalNeedsChanges;
  const displayRejected = totalRejected;
  const displayTotalInvitations = displayTotalApplicants;

  // Percentage calculations
  const approvedRate = displayTotalApplicants > 0 
    ? Math.round((displayApproved / displayTotalApplicants) * 100) 
    : 0;
  const completionPercentage = approvedRate;

  // Dynamic weeklyActivity flow
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdayCounts: { [key: string]: number } = {
    'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
  };
  
  attendees.forEach(a => {
    try {
      const date = new Date(a.dateSubmitted);
      if (!isNaN(date.getTime())) {
        const dayName = weekdayNames[date.getDay()];
        if (dayName && dayName in weekdayCounts) {
          weekdayCounts[dayName]++;
        }
      }
    } catch (e) {
      // Ignore parsing errors
    }
  });

  const weeklyActivity = [
    { day: 'Mon', count: weekdayCounts['Mon'], highlight: false },
    { day: 'Tue', count: weekdayCounts['Tue'], highlight: false },
    { day: 'Wed', count: weekdayCounts['Wed'], highlight: false },
    { day: 'Thu', count: weekdayCounts['Thu'], highlight: false },
    { day: 'Fri', count: weekdayCounts['Fri'], highlight: false },
    { day: 'Sat', count: weekdayCounts['Sat'], highlight: false },
    { day: 'Sun', count: weekdayCounts['Sun'], highlight: false },
  ];

  // Dynamically highlight peak day
  let peakIdx = -1;
  let maxCount = 0;
  weeklyActivity.forEach((act, idx) => {
    if (act.count > maxCount) {
      maxCount = act.count;
      peakIdx = idx;
    }
  });
  if (peakIdx !== -1) {
    weeklyActivity[peakIdx].highlight = true;
  }

  const handleGenerateBook = () => {
    if (isGeneratingBook) return;
    setIsGeneratingBook(true);
    
    const steps = [
      "Aggregating approved delegate credentials...",
      "Normalizing biography formatting...",
      "Generating high-resolution security QR codes...",
      "Compiling commemorative layout...",
      "Double-checking visual asset compatibility...",
      "Finalizing high-end editorial PDF book!"
    ];

    let currentStepIndex = 0;
    setGenerationStep(steps[0]);

    const interval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setGenerationStep(steps[currentStepIndex]);
      } else {
        clearInterval(interval);
        setIsGeneratingBook(false);
        setGenerationStep('');
        onTriggerToast("Commemorative Summit Book Generated Successfully!", "success");
      }
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-primary">Dashboard Overview</h2>
          <p className="font-sans text-base text-on-surface-variant mt-1.5">
            Welcome back, Admin. Here is the latest <span className="font-semibold text-secondary">{eventSettings.eventName}</span> status.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (!eventSettings.enableDownloads) {
                onTriggerToast("Downloading is disabled. Enable it in Settings if needed.", "info");
                return;
              }
              // Generate standard mock JSON data sheet and prompt print
              onTriggerToast("Assembling comprehensive report PDF... ready for download!", "success");
              window.print();
            }}
            className={`flex items-center gap-2 border px-4 py-2 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-200 shadow-sm ${
              eventSettings.enableDownloads 
                ? 'bg-white border-outline-variant hover:bg-surface-container-low cursor-pointer active:scale-95 text-primary' 
                : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant/40 cursor-not-allowed opacity-60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Report {!eventSettings.enableDownloads && "(Inactive)"}</span>
          </button>
          
          <button 
            onClick={() => onNavigateToTab('wizard')}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded text-xs font-semibold tracking-wide uppercase hover:shadow-lg transition-all duration-200 border-b-2 border-secondary cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>New Invitation</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Invitations */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant ambient-shadow group hover:border-secondary transition-all duration-300">
          <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Total Invitations</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-3xl font-bold text-primary">{displayTotalInvitations.toLocaleString()}</span>
            <span className="text-secondary text-xs font-bold flex items-center shrink-0">
              Active
            </span>
          </div>
          <div className="w-full h-1 bg-surface-container mt-4 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-full rounded-full"></div>
          </div>
        </div>

        {/* Total Submitted */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant ambient-shadow group hover:border-secondary transition-all duration-300">
          <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Total Submitted</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-3xl font-bold text-primary">{displayTotalApplicants.toLocaleString()}</span>
            <span className="text-on-surface-variant text-xs font-medium opacity-80">{displayTotalApplicants > 0 ? "100" : "0"}% rate</span>
          </div>
          <div className="w-full h-1 bg-surface-container mt-4 rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-full rounded-full"></div>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant ambient-shadow group hover:border-secondary transition-all duration-300">
          <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Pending Review</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-3xl font-bold text-primary">{displayPending}</span>
            <span className="text-secondary text-xs font-bold flex items-center uppercase tracking-wider">Action Req.</span>
          </div>
          <div className="w-full h-1 bg-surface-container mt-4 rounded-full overflow-hidden">
            <div 
              style={{ width: `${displayTotalApplicants > 0 ? Math.round((displayPending / displayTotalApplicants) * 100) : 0}%` }}
              className="h-full bg-secondary-light rounded-full"
            ></div>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant ambient-shadow group hover:border-secondary transition-all duration-300">
          <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Approved</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-3xl font-bold text-primary">{displayApproved}</span>
            <span className="text-green-600 text-xs font-bold flex items-center shrink-0">{approvedRate}%</span>
          </div>
          <div className="w-full h-1 bg-surface-container mt-4 rounded-full overflow-hidden">
            <div 
              style={{ width: `${approvedRate}%` }}
              className="h-full bg-green-500 rounded-full"
            ></div>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant ambient-shadow group hover:border-secondary transition-all duration-300">
          <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant opacity-75">Rejected</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-3xl font-bold text-primary">{displayRejected}</span>
            <span className="text-red-600 text-xs font-bold">
              {displayTotalApplicants > 0 ? Math.round((displayRejected / displayTotalApplicants) * 100) : 0}%
            </span>
          </div>
          <div className="w-full h-1 bg-surface-container mt-4 rounded-full overflow-hidden">
            <div 
              style={{ width: `${displayTotalApplicants > 0 ? Math.round((displayRejected / displayTotalApplicants) * 100) : 0}%` }}
              className="h-full bg-red-600 rounded-full"
            ></div>
          </div>
        </div>
      </div>

      {/* Middle Section: Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Chart (Large) */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ambient-shadow">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-sans text-lg font-bold text-primary">Daily Activity Flow</h3>
              <p className="font-sans text-xs text-on-surface-variant">Real-time profile submission trends</p>
            </div>
            
            <select 
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value as '7' | '30')}
              className="bg-white border border-outline-variant rounded px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase outline-none focus:ring-1 focus:ring-secondary cursor-pointer"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>

          {/* Interactive Custom SVG Chart */}
          <div className="h-64 w-full bg-surface-bright rounded-lg relative flex flex-col justify-end px-6 pb-4 pt-8">
            {/* Tooltip Hover Overlay */}
            {hoveredBar !== null && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] px-3 py-1.5 rounded shadow-lg flex items-center gap-1.5 z-20 border border-secondary transition-all animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-secondary-light" />
                <span>{weeklyActivity[hoveredBar].day}: <strong>{weeklyActivity[hoveredBar].count} profiles</strong> submitted</span>
              </div>
            )}

            {/* Grid background lines */}
            <div className="absolute inset-x-6 bottom-11 top-8 flex flex-col justify-between pointer-events-none opacity-[0.06]">
              <div className="border-b border-on-surface w-full"></div>
              <div className="border-b border-on-surface w-full"></div>
              <div className="border-b border-on-surface w-full"></div>
              <div className="border-b border-on-surface w-full"></div>
            </div>

            {/* Bars container */}
            <div className="flex items-end h-40 gap-4 md:gap-6 z-10 select-none px-2">
              {weeklyActivity.map((act, idx) => {
                // Calculate height dynamically based on max value to always keep it proportioned
                const heightPercent = `${(act.count / Math.max(10, maxCount)) * 100}%`;
                return (
                  <div 
                    key={act.day} 
                    className="flex-1 flex flex-col items-center group cursor-pointer"
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div 
                      style={{ height: heightPercent }}
                      className={`w-full rounded-t transition-all duration-300 ${
                        hoveredBar === idx 
                          ? 'bg-secondary' 
                          : act.highlight 
                            ? 'bg-secondary' 
                            : 'bg-primary-container/30 hover:bg-primary-container/50'
                      }`}
                    ></div>
                    <span className="font-sans text-[10px] font-bold tracking-wide uppercase text-on-surface-variant/75 mt-2.5">
                      {act.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions (Small) */}
        <div className="lg:col-span-4 bg-primary-container text-on-primary p-6 rounded-xl shadow-xl relative overflow-hidden group flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="font-sans text-lg font-bold text-white mb-6">Quick Actions</h3>
            
            <div className="space-y-4">
              <button 
                onClick={() => onNavigateToTab('settings')}
                className="w-full flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/15 rounded-lg transition-all border border-white/5 group/btn cursor-pointer active:scale-98"
              >
                <span className="flex items-center gap-3 font-sans text-xs font-bold tracking-wider uppercase">
                  <Clock className="w-4 h-4 text-secondary-light" />
                  <span>Configure Settings</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-all text-secondary-light" />
              </button>
              
              <button 
                onClick={onUploadCSV}
                className="w-full flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/15 rounded-lg transition-all border border-white/5 group/btn cursor-pointer active:scale-98"
              >
                <span className="flex items-center gap-3 font-sans text-xs font-bold tracking-wider uppercase">
                  <Upload className="w-4 h-4 text-secondary-light" />
                  <span>Upload Attendee CSV</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-all text-secondary-light" />
              </button>
              
              <button 
                onClick={handleGenerateBook}
                disabled={isGeneratingBook}
                className="w-full flex items-center justify-between p-3.5 bg-secondary text-primary rounded-lg transition-all border border-secondary-light font-bold hover:bg-secondary/95 hover:shadow-md cursor-pointer active:scale-98 disabled:opacity-80"
              >
                <span className="flex items-center gap-3 font-sans text-xs font-bold tracking-wider uppercase text-white">
                  {isGeneratingBook ? (
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-white" />
                  )}
                  <span>{isGeneratingBook ? "Generating..." : "Generate Book"}</span>
                </span>
                <Zap className="w-4 h-4 text-white fill-white" />
              </button>
            </div>
          </div>

          {/* Dynamic Generator Step UI */}
          {isGeneratingBook && (
            <div className="relative z-10 mt-6 bg-white/5 border border-white/10 rounded-lg p-3 text-[11px] animate-pulse">
              <p className="font-semibold text-secondary-light uppercase tracking-wider">AI Engine Status:</p>
              <p className="text-white/90 mt-1">{generationStep}</p>
            </div>
          )}

          {/* Decorative Background Element */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary opacity-15 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700 pointer-events-none"></div>
        </div>
      </div>

      {/* Bottom Section: Feed and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Submission Progress (Donut/Radial Style) */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ambient-shadow">
          <h3 className="font-sans text-lg font-bold text-primary mb-6">Submission Progress</h3>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background track circle */}
                <circle 
                  className="text-surface-container-low" 
                  cx="96" 
                  cy="96" 
                  fill="transparent" 
                  r="80" 
                  stroke="currentColor" 
                  strokeWidth="12"
                />
                {/* Dynamic finished circle */}
                <circle 
                  className="text-secondary transition-all duration-1000 ease-out" 
                  cx="96" 
                  cy="96" 
                  fill="transparent" 
                  r="80" 
                  stroke="currentColor" 
                  strokeDasharray="502.4" 
                  // 502.4 is 2 * PI * r (80)
                  // dashoffset of 165 matches roughly 67%
                  strokeDashoffset={502.4 - (502.4 * completionPercentage) / 100} 
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-bold text-primary">{completionPercentage}%</span>
                <span className="font-sans text-[10px] font-bold tracking-wider uppercase text-on-surface-variant/70">Completed</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-surface-container-low rounded-lg text-center">
                <span className="block font-display text-xl font-bold text-secondary">{displayApproved}</span>
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">Finished</span>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-lg text-center">
                <span className="block font-display text-xl font-bold text-primary">{displayPending}</span>
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow flex flex-col overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-sans text-lg font-bold text-primary">Recent Activity</h3>
            <button 
              onClick={() => onNavigateToTab('attendees')}
              className="text-secondary font-sans text-xs font-bold uppercase tracking-wider hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-outline-variant flex-1 flex flex-col justify-center">
            {activities.length === 0 ? (
              <div className="p-12 text-center text-on-surface-variant/60">No recent activity logs available.</div>
            ) : (
              activities.slice(0, 4).map((act) => (
                <div key={act.id} className="p-4 hover:bg-surface-bright/70 transition-colors flex items-center gap-4 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    act.type === 'add' 
                      ? 'bg-blue-100 text-blue-600' 
                      : act.type === 'approve' 
                        ? 'bg-green-100 text-green-600' 
                        : act.type === 'edit' 
                          ? 'bg-amber-100 text-amber-600' 
                          : 'bg-primary-container text-white'
                  }`}>
                    {act.type === 'add' && <UserPlus className="w-5 h-5" />}
                    {act.type === 'approve' && <CheckCircle2 className="w-5 h-5" />}
                    {act.type === 'edit' && <FileEdit className="w-5 h-5" />}
                    {act.type === 'info' && <Mail className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-on-surface text-ellipsis overflow-hidden">
                      <span className="font-bold text-primary">{act.user}</span> {act.action}
                    </p>
                    <p className="font-sans text-[10px] text-on-surface-variant/60 mt-0.5">{act.timestamp}</p>
                  </div>

                  {/* Contextual Action Button if relevant */}
                  {act.type === 'add' && (
                    <button 
                      onClick={() => onNavigateToTab('attendees')}
                      className="opacity-0 group-hover:opacity-100 bg-white hover:bg-secondary hover:text-white border border-outline-variant hover:border-secondary px-3.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer shadow-sm active:scale-95 shrink-0"
                    >
                      Review
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
