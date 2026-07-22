/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Bolt, 
  Search, 
  Link as LinkIcon, 
  Filter, 
  Edit2, 
  Eye, 
  CheckCircle, 
  X, 
  XCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  QrCode,
  UserCheck
} from 'lucide-react';
import { Attendee, EventSettings } from '../types';

interface AttendeesViewProps {
  attendees: Attendee[];
  eventSettings: EventSettings;
  onUpdateStatus: (id: string, newStatus: Attendee['status']) => void;
  onBulkApprove: (ids: string[]) => void;
  onTriggerToast: (message: string, type: 'success' | 'info') => void;
  onEditAttendee: (attendee: Attendee) => void;
}

export default function AttendeesView({
  attendees,
  eventSettings,
  onUpdateStatus,
  onBulkApprove,
  onTriggerToast,
  onEditAttendee
}: AttendeesViewProps) {
  // Local filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Page state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Selected attendee for the Preview Modal
  const [previewAttendee, setPreviewAttendee] = useState<Attendee | null>(null);

  // Derive unique categories dynamically for dropdowns
  const uniqueIndustries = useMemo(() => {
    const ind = new Set(attendees.map(a => a.industry));
    return Array.from(ind);
  }, [attendees]);

  const uniqueCompanies = useMemo(() => {
    const comp = new Set(attendees.map(a => a.company));
    return Array.from(comp);
  }, [attendees]);

  // Filter list
  const filteredAttendees = useMemo(() => {
    return attendees.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === 'All' || a.status === selectedStatus;
      const matchesIndustry = selectedIndustry === 'All' || a.industry === selectedIndustry;
      const matchesCompany = selectedCompany === 'All' || a.company === selectedCompany;

      return matchesSearch && matchesStatus && matchesIndustry && matchesCompany;
    });
  }, [attendees, searchQuery, selectedStatus, selectedIndustry, selectedCompany]);

  // Statistics calculation for the headers
  const totalApplicants = attendees.length + 1280;
  const approvedCount = attendees.filter(a => a.status === 'Approved').length + 838;
  const pendingCount = attendees.filter(a => a.status === 'Under Review').length + 152;

  // Multi-select actions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAttendees.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkApproveClick = () => {
    if (selectedIds.length === 0) {
      onTriggerToast("No delegates selected.", "info");
      return;
    }
    onBulkApprove(selectedIds);
    setSelectedIds([]);
  };

  const handleGenerateVIPLinks = () => {
    onTriggerToast("VIP delegate self-completion links compiled to clipboard!", "success");
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedIndustry('All');
    setSelectedCompany('All');
    setSelectedIds([]);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-sans text-[10px] font-bold text-secondary tracking-widest uppercase block mb-1">Registration Overview</span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-primary">Delegates Directory</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (!eventSettings.enableDownloads) {
                onTriggerToast("Downloading is disabled. Enable it in Settings if needed.", "info");
                return;
              }
              if (attendees.length === 0) {
                onTriggerToast("No delegates to export.", "info");
                return;
              }
              const headers = ["Name", "Designation", "Company", "Industry", "Status", "Date Submitted", "City", "Country", "Expertise", "Is Anniversary"];
              const rows = attendees.map(a => [
                a.name,
                a.designation,
                a.company,
                a.industry,
                a.status,
                a.dateSubmitted,
                a.city || "",
                a.country || "",
                a.expertise.join("; "),
                a.isAnniversaryAttendee ? "Yes" : "No"
              ]);
              const csvContent = [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", `delegates_directory_${new Date().toISOString().slice(0, 10)}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              onTriggerToast("CSV Directory downloaded successfully!", "success");
            }}
            className={`flex items-center gap-2 border px-4 py-2 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-200 shadow-sm ${
              eventSettings.enableDownloads 
                ? 'bg-white border-outline-variant hover:bg-surface-container-low cursor-pointer active:scale-95 text-primary' 
                : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant/40 cursor-not-allowed opacity-60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV {!eventSettings.enableDownloads && "(Inactive)"}</span>
          </button>
          
          <button 
            onClick={handleBulkApproveClick}
            disabled={selectedIds.length === 0}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded text-xs font-semibold tracking-wide uppercase hover:shadow-md transition-all border-b-2 border-secondary cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bolt className="w-4 h-4 text-secondary-light" />
            <span>Approve Selected ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <p className="font-sans text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Total Applicants</p>
          <div className="flex items-end gap-2">
            <span className="font-display text-3xl font-bold text-primary">{totalApplicants.toLocaleString()}</span>
            <span className="text-emerald-600 text-xs font-bold mb-1">+12%</span>
          </div>
        </div>

        <div className="bg-white p-5 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <p className="font-sans text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Approved Delegates</p>
          <div className="flex items-end gap-2">
            <span className="font-display text-3xl font-bold text-primary">{approvedCount.toLocaleString()}</span>
            <span className="text-on-surface-variant text-xs opacity-60 mb-1">Capacity: 1,000</span>
          </div>
        </div>

        <div className="bg-white p-5 border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <p className="font-sans text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Pending Review</p>
          <div className="flex items-end gap-2 w-full">
            <span className="font-display text-3xl font-bold text-primary">{pendingCount}</span>
            <div className="h-1.5 flex-grow bg-surface-container ml-4 rounded-full overflow-hidden self-center max-w-[120px]">
              <div className="bg-secondary h-full w-[70%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-outline-variant p-4 flex flex-wrap items-center gap-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 flex-grow min-w-[280px]">
          <Filter className="w-4 h-4 text-on-surface-variant shrink-0" />
          
          {/* Status Filter */}
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-xs font-bold tracking-wider uppercase text-on-surface-variant cursor-pointer outline-none"
          >
            <option value="All">Status: All</option>
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Needs Changes">Needs Changes</option>
            <option value="Rejected">Rejected</option>
          </select>
          
          <span className="h-4 w-[1px] bg-outline-variant shrink-0"></span>

          {/* Industry Filter */}
          <select 
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-xs font-bold tracking-wider uppercase text-on-surface-variant cursor-pointer outline-none max-w-[140px]"
          >
            <option value="All">Industry: All</option>
            {uniqueIndustries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>

          <span className="h-4 w-[1px] bg-outline-variant shrink-0"></span>

          {/* Company Filter */}
          <select 
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-xs font-bold tracking-wider uppercase text-on-surface-variant cursor-pointer outline-none max-w-[145px]"
          >
            <option value="All">Company: All</option>
            {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Real-time search query */}
        <div className="relative shrink-0 w-full sm:w-64">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search delegates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant pl-10 pr-4 py-2 rounded-full text-xs outline-none focus:ring-1 focus:ring-secondary transition-all"
          />
        </div>

        {/* Right Filter Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={handleGenerateVIPLinks}
            className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5 hover:underline cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Generate Links</span>
          </button>
          
          <button 
            onClick={handleClearFilters}
            className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Delegates Directory Data Table */}
      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant select-none">
            <tr>
              <th className="py-4 px-6 w-12">
                <input 
                  type="checkbox"
                  checked={filteredAttendees.length > 0 && selectedIds.length === filteredAttendees.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-outline-variant text-secondary focus:ring-secondary h-4.5 w-4.5 cursor-pointer accent-secondary"
                />
              </th>
              <th className="py-4 px-4 font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Attendee Name</th>
              <th className="py-4 px-4 font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Company</th>
              <th className="py-4 px-4 font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Industry</th>
              <th className="py-4 px-4 font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
              <th className="py-4 px-4 font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Date Submitted</th>
              <th className="py-4 px-6 text-right font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filteredAttendees.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-on-surface-variant/60 font-sans text-sm">
                  No delegates found matching the filters.
                </td>
              </tr>
            ) : (
              filteredAttendees.map((a) => {
                const isSelected = selectedIds.includes(a.id);
                return (
                  <tr 
                    key={a.id} 
                    className={`hover:bg-secondary/5 transition-colors group ${isSelected ? 'bg-secondary/5' : ''}`}
                  >
                    <td className="py-4.5 px-6">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(a.id, e.target.checked)}
                        className="rounded border-outline-variant text-secondary focus:ring-secondary h-4.5 w-4.5 cursor-pointer accent-secondary"
                      />
                    </td>
                    <td className="py-4.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container shrink-0 border border-outline-variant">
                          <img 
                            referrerPolicy="no-referrer"
                            src={a.photoUrl} 
                            alt={a.name}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <span className="font-sans font-bold text-sm block text-primary">{a.name}</span>
                          {a.isAnniversaryAttendee ? (
                            <span className="text-[9px] text-secondary font-extrabold uppercase tracking-widest mt-0.5 inline-block">10-Year Attendee</span>
                          ) : (
                            <span className="text-[9px] text-on-surface-variant/50 font-bold uppercase tracking-widest mt-0.5 inline-block">Regular Attendee</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-4 font-sans text-xs font-semibold text-on-surface-variant">
                      {a.company}
                    </td>
                    <td className="py-4.5 px-4 font-sans text-xs text-on-surface-variant">
                      {a.industry}
                    </td>
                    <td className="py-4.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        a.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : a.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : a.status === 'Needs Changes'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-4 font-sans text-xs text-on-surface-variant italic opacity-60">
                      {a.dateSubmitted}
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Quick Status Approval/Reject controls if not already done */}
                        {a.status !== 'Approved' && (
                          <button 
                            onClick={() => { onUpdateStatus(a.id, 'Approved'); onTriggerToast(`Approved ${a.name}'s profile.`, 'success'); }}
                            title="Approve Delegate"
                            className="p-1.5 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors cursor-pointer"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {a.status === 'Under Review' && (
                          <button 
                            onClick={() => { onUpdateStatus(a.id, 'Needs Changes'); onTriggerToast(`Requested changes from ${a.name}.`, 'info'); }}
                            title="Request Biography Changes"
                            className="p-1.5 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button 
                          onClick={() => onEditAttendee(a)}
                          title="Edit Profile"
                          className="p-1.5 hover:text-secondary hover:bg-secondary/10 rounded-full transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => setPreviewAttendee(a)}
                          title="View Live Book Card"
                          className="p-1.5 hover:text-secondary hover:bg-secondary/10 rounded-full transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination bar */}
        <div className="bg-surface-container-low px-6 py-4 border-t border-outline-variant flex justify-between items-center select-none">
          <p className="font-sans text-xs text-on-surface-variant">
            Showing <strong>1 to {filteredAttendees.length}</strong> of <strong>{filteredAttendees.length}</strong> delegates
          </p>
          <div className="flex gap-1.5">
            <button 
              disabled 
              className="p-1.5 border border-outline-variant rounded hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-bold text-xs">1</button>
            <button 
              onClick={() => onTriggerToast("Switching page (simulated)...", "info")}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-white border border-transparent hover:border-outline-variant text-xs cursor-pointer font-medium"
            >
              2
            </button>
            <button 
              onClick={() => onTriggerToast("Switching page (simulated)...", "info")}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-white border border-transparent hover:border-outline-variant text-xs cursor-pointer font-medium"
            >
              3
            </button>
            <span className="flex items-center px-1 text-xs">...</span>
            <button 
              onClick={() => onTriggerToast("Switching to page 128 (simulated)...", "info")}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-white border border-transparent hover:border-outline-variant text-xs cursor-pointer font-medium"
            >
              128
            </button>
            <button 
              onClick={() => onTriggerToast("Next page (simulated)...", "info")}
              className="p-1.5 border border-outline-variant rounded hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* HIGH END BOOK PREVIEW DIALOG MODAL */}
      {previewAttendee && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="relative bg-surface-bright rounded-2xl w-full max-w-md overflow-hidden border border-outline-variant premium-shadow flex flex-col max-h-[90vh]">
            {/* Top gold bar */}
            <div className="h-1.5 bg-secondary w-full"></div>
            
            {/* Close trigger */}
            <button 
              onClick={() => setPreviewAttendee(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-surface-container-high hover:text-primary text-on-surface-variant transition-colors cursor-pointer z-10"
            >
              <XCircle className="w-6 h-6 text-on-surface-variant" />
            </button>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
              <span className="font-sans text-[9px] font-bold tracking-widest text-on-surface-variant/70 uppercase mb-4">Live Delegate Book Preview</span>
              
              {/* Card Container */}
              <div className="w-full bg-white border border-outline-variant rounded-xl overflow-hidden ambient-shadow flex flex-col select-none relative">
                {/* Visual thin gold bar */}
                <div className="h-1 bg-secondary w-full"></div>

                <div className="p-6 flex flex-col items-center text-center">
                  {/* Commemorative Badge */}
                  {previewAttendee.isAnniversaryAttendee && (
                    <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded text-[9px] font-bold flex items-center gap-1 border border-secondary/20">
                      <Sparkles className="w-3 h-3 text-secondary" />
                      <span>10 YEAR DELEGATE</span>
                    </div>
                  )}

                  {/* Profile photo */}
                  <div className="w-28 h-28 rounded-full border-4 border-surface-bright shadow-sm mb-4 overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0">
                    <img 
                      referrerPolicy="no-referrer"
                      src={previewAttendee.photoUrl} 
                      alt={previewAttendee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details block */}
                  <h2 className="font-display text-2xl font-bold text-primary tracking-tight leading-snug">{previewAttendee.name}</h2>
                  <p className="text-secondary font-semibold text-sm tracking-wide mt-1">{previewAttendee.designation}</p>

                  <div className="flex items-center gap-2 mt-3 mb-5">
                    <div className="w-7 h-7 flex items-center justify-center border border-outline-variant rounded p-1 bg-surface-bright">
                      <img 
                        referrerPolicy="no-referrer"
                        src={previewAttendee.logoUrl || eventSettings.logoUrl} 
                        alt="Company Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <span className="text-on-surface-variant font-bold text-xs">{previewAttendee.company}</span>
                  </div>

                  {/* Metadata fields */}
                  <div className="w-full border-t border-outline-variant py-4 flex flex-col gap-2.5 text-left">
                    <div className="flex justify-between items-center px-1">
                      <span className="font-sans text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Industry</span>
                      <span className="font-sans text-xs font-bold text-primary">{previewAttendee.industry}</span>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="font-sans text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Location</span>
                      <span className="font-sans text-xs font-bold text-primary">
                        {previewAttendee.city || "London"}, {previewAttendee.country || "UK"}
                      </span>
                    </div>
                  </div>

                  {/* Expertise Chips */}
                  <div className="flex flex-wrap justify-center gap-1.5 mt-2 mb-4">
                    {previewAttendee.expertise.map((exp) => (
                      <span 
                        key={exp}
                        className="px-2.5 py-0.5 bg-surface-container-low text-[9px] font-bold rounded-full text-on-surface-variant uppercase tracking-wider"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>

                  {/* QR Footer Area */}
                  <div className="w-full bg-surface-container-low p-4 flex flex-col items-center gap-2 rounded-lg mt-2 border border-outline-variant/30">
                    <div className="w-16 h-16 bg-white border border-outline-variant/50 p-1.5 flex items-center justify-center">
                      <QrCode className="w-full h-full text-primary" />
                    </div>
                    <p className="font-sans text-[8px] font-bold tracking-widest text-on-surface-variant/70 uppercase">SCAN TO CONNECT AT SUMMIT</p>
                  </div>
                </div>
              </div>

              {/* Commemorative quote */}
              <p className="text-center font-display italic text-xs text-on-surface-variant/70 mt-5 leading-relaxed">
                "Design is a decade in the making." — {eventSettings.eventName}
              </p>
            </div>

            {/* Modal action bar */}
            <div className="bg-surface-container-low border-t border-outline-variant px-6 py-4 flex justify-between items-center">
              <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                previewAttendee.status === 'Approved' ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                <UserCheck className="w-4 h-4" />
                <span>Verification: {previewAttendee.status}</span>
              </span>
              <button 
                onClick={() => setPreviewAttendee(null)}
                className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded hover:bg-secondary-light transition-all cursor-pointer active:scale-95"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
