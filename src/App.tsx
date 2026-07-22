/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  HelpCircle, 
  Search, 
  CheckCircle, 
  Info, 
  X, 
  Calendar, 
  Clock, 
  Sparkles,
  Award,
  BookOpen,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Upload,
  Share2
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AttendeesView from './components/AttendeesView';
import ProfileWizardView from './components/ProfileWizardView';
import SettingsView from './components/SettingsView';
import EBookBuilderView from './components/EBookBuilderView';
import HelpView from './components/HelpView';
import GuestAttendeePortalView from './components/GuestAttendeePortalView';
import ShareLinkModal from './components/ShareLinkModal';

import { Attendee, EventSettings, Activity } from './types';
import { 
  ADMIN_AVATAR, 
  INITIAL_EVENT_SETTINGS, 
  INITIAL_ATTENDEES, 
  INITIAL_ACTIVITIES 
} from './data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info';
}

export default function App() {
  // Tabs: 'dashboard' | 'attendees' | 'wizard' | 'events' | 'settings' | 'help'
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Load state from localStorage or fallback to mockData
  const [attendees, setAttendees] = useState<Attendee[]>(() => {
    const saved = localStorage.getItem('summit_attendees');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDEES;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('summit_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [eventSettings, setEventSettings] = useState<EventSettings>(() => {
    const saved = localStorage.getItem('summit_event_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_EVENT_SETTINGS,
          ...parsed,
          enableDownloads: true,
          enableGuestPhotoSelection: true
        };
      } catch (e) {
        return INITIAL_EVENT_SETTINGS;
      }
    }
    return INITIAL_EVENT_SETTINGS;
  });

  const [editingAttendee, setEditingAttendee] = useState<Attendee | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Dynamic booking calendar modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-07-25');
  const [bookingTime, setBookingTime] = useState('14:00');
  const [bookingTopic, setBookingTopic] = useState('10th Anniversary Badge Design Critique');

  // CSV file uploader dialog
  const [isCsvUploaderOpen, setIsCsvUploaderOpen] = useState(false);

  // Share Attendee Link Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Guest Public Submission View Mode (triggers if ?mode=attendee in URL or toggled by admin)
  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'attendee' || params.get('view') === 'guest' || params.get('role') === 'attendee';
    }
    return false;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('summit_attendees', JSON.stringify(attendees));
  }, [attendees]);

  useEffect(() => {
    localStorage.setItem('summit_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('summit_event_settings', JSON.stringify(eventSettings));
  }, [eventSettings]);

  // Toast Notification triggers
  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Automatically fade out after 3.5s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Actions
  const handleSaveAttendee = (attendee: Attendee) => {
    const isEditing = attendees.some(a => a.id === attendee.id);
    
    if (isEditing) {
      setAttendees(prev => prev.map(a => a.id === attendee.id ? attendee : a));
      
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        user: "Admin",
        action: `updated profile credentials for ${attendee.name}`,
        timestamp: "Just now",
        type: "edit"
      };
      setActivities(prev => [newActivity, ...prev]);
      triggerToast(`Successfully updated ${attendee.name}'s delegate profile!`, "success");
    } else {
      setAttendees(prev => [attendee, ...prev]);
      
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        user: attendee.name,
        action: "submitted their delegate profile",
        timestamp: "Just now",
        type: "add"
      };
      setActivities(prev => [newActivity, ...prev]);
      triggerToast(`Added ${attendee.name} to the directory registry!`, "success");
    }

    setEditingAttendee(null);
    setActiveTab('attendees');
  };

  const handleUpdateStatus = (id: string, newStatus: Attendee['status']) => {
    const target = attendees.find(a => a.id === id);
    if (!target) return;

    setAttendees(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      user: "Admin",
      action: `${newStatus === 'Approved' ? 'approved' : 'rejected'} ${target.name}'s visual credentials`,
      timestamp: "Just now",
      type: "approve"
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleBulkApprove = (ids: string[]) => {
    setAttendees(prev => prev.map(a => ids.includes(a.id) ? { ...a, status: 'Approved' as const } : a));
    
    const count = ids.length;
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      user: "Admin",
      action: `bulk-approved ${count} delegate profile submissions`,
      timestamp: "Just now",
      type: "approve"
    };
    setActivities(prev => [newActivity, ...prev]);
    triggerToast(`Bulk approved ${count} delegate profiles successfully!`, "success");
  };

  const handleSaveSettings = (newSettings: EventSettings) => {
    setEventSettings(newSettings);
    
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      user: "Admin",
      action: `updated global event configuration metadata`,
      timestamp: "Just now",
      type: "edit"
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleEditAttendeeRequest = (attendee: Attendee) => {
    setEditingAttendee(attendee);
    setActiveTab('wizard');
  };

  // Mock parsing parsed CSV file
  const handleCSVUploadSuccess = () => {
    const csvDelegates: Attendee[] = [
      {
        id: `csv-1-${Date.now()}`,
        name: "Clara Dupont",
        designation: "VP of Green Logistics",
        company: "EcoTrans Paris",
        industry: "Maritime",
        status: "Under Review",
        dateSubmitted: "Jul 21, 2026",
        photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVpXwecFt6HDMADhigcR5FEqCve75qo1CGcsG2OJHrBrkPjaPqZnPe6RwQomk49l8QvKgoNVZ5NdnABAU-Rz0GESspS_eqV3HkioOHnry5lA4z5SFzBaseXu1OT2eTYqu-VqhkD_qLRo91PRRDxD4lVUgXzI6sev-cjEZxSk_6PtWKFO1vHE3EzoH5j-cI0VBNSgn1m9XbRWQZaD7O0bCi9izlh07wwrCXLVAasavwKJ7aca1m3ED5",
        logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHGob3oMolEkBqBNyE8tOtmRBPZBB-hongE1W7LLnCdRL8qfsaKBqHFlY6b8Dj-SZsKUzsLNanyTuThOKsoeK8npJmkt2HUBvVH-5bds3gcy4adIVUdf5V11k4h06erW1A5cvCy6LG4WxncFZLLO-R2C-auPKK7YJlu_ei3aARjNZQzjUvXKHlQLftIDC386-pjiJnFqqBAPjqMKB2drn7w-ZsFf55VBo0qczhK2cndweotEthn_s",
        city: "Paris",
        stateProv: "Île-de-France",
        country: "France",
        expertise: ["Supply Chain", "ESG Compliance"],
        isAnniversaryAttendee: true
      },
      {
        id: `csv-2-${Date.now()}`,
        name: "Kenji Tanaka",
        designation: "Principal Quantum Engineer",
        company: "Sora Quantum Labs",
        industry: "Aerospace",
        status: "Under Review",
        dateSubmitted: "Jul 21, 2026",
        photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6lllNO4f4R6OAF4WuvushNXVbgQ34qggRjSiRJhgpTrjG9jaovvWssdVvbFbWB7VXx9nYYppADduKokWgas718R6ZMWTYAOU4_xbc-6Nm9fA8tVOLdyHDDr7OsxKppu-uSx8kD40rm9ab3R1FIvl2DQRxsc7gCCM2L5hzychU-81UceelqwkodMn9nO2OaMEqOqVerEcEoysHXaJ8_hIBIleli6xfIy038l11pYOlM_zjzQPZXghx",
        logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHGob3oMolEkBqBNyE8tOtmRBPZBB-hongE1W7LLnCdRL8qfsaKBqHFlY6b8Dj-SZsKUzsLNanyTuThOKsoeK8npJmkt2HUBvVH-5bds3gcy4adIVUdf5V11k4h06erW1A5cvCy6LG4WxncFZLLO-R2C-auPKK7YJlu_ei3aARjNZQzjUvXKHlQLftIDC386-pjiJnFqqBAPjqMKB2drn7w-ZsFf55VBo0qczhK2cndweotEthn_s",
        city: "Kyoto",
        stateProv: "Kyoto",
        country: "Japan",
        expertise: ["Deep Tech & AI"],
        isAnniversaryAttendee: false
      }
    ];

    setAttendees(prev => [...csvDelegates, ...prev]);

    const newActivity: Activity = {
      id: `act-csv-${Date.now()}`,
      user: "System",
      action: "Bulk parsed and imported 2 new delegates from uploaded CSV list",
      timestamp: "Just now",
      type: "add"
    };
    setActivities(prev => [newActivity, ...prev]);
    setIsCsvUploaderOpen(false);
    triggerToast("Parsed attendee.csv successfully! Added 2 new pending delegates.", "success");
  };

  // Schedule virtual book review meeting
  const handleConfirmMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingOpen(false);
    triggerToast(`Anniversary Consulting Meeting Booked: ${bookingDate} at ${bookingTime}!`, "success");
    
    const newActivity: Activity = {
      id: `act-book-${Date.now()}`,
      user: "Admin",
      action: `scheduled 10th anniversary consulting meeting regarding '${bookingTopic}'`,
      timestamp: "Just now",
      type: "info"
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  if (isGuestMode) {
    return (
      <div className="bg-surface-bright font-sans text-on-surface min-h-screen relative">
        {/* Dynamic Floating Toast System */}
        <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="pointer-events-auto bg-primary text-white border border-secondary shadow-2xl p-4 rounded-xl flex items-start gap-3 w-full"
              >
                <CheckCircle className="w-5 h-5 text-secondary-light shrink-0 mt-0.5" />
                <div className="flex-1 text-xs font-semibold leading-relaxed">
                  {toast.message}
                </div>
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="text-white/60 hover:text-white cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <GuestAttendeePortalView 
          eventSettings={eventSettings}
          onAddAttendee={(newAttendee) => {
            setAttendees(prev => [newAttendee, ...prev]);
            const newActivity: Activity = {
              id: `act-${Date.now()}`,
              user: newAttendee.name,
              action: "submitted profile credentials via guest self-registration portal",
              timestamp: "Just now",
              type: "add"
            };
            setActivities(prev => [newActivity, ...prev]);
          }}
          onExitGuestMode={() => setIsGuestMode(false)}
          onTriggerToast={triggerToast}
        />
      </div>
    );
  }

  return (
    <div className="bg-surface-bright font-sans text-on-surface min-h-screen flex topographic-bg relative">
      
      {/* Dynamic Floating Toast System */}
      <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto bg-primary text-white border border-secondary shadow-2xl p-4 rounded-xl flex items-start gap-3 w-full"
            >
              <CheckCircle className="w-5 h-5 text-secondary-light shrink-0 mt-0.5" />
              <div className="flex-1 text-xs font-semibold leading-relaxed">
                {toast.message}
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-white/60 hover:text-white cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* SideNavBar (Authority: JSON metadata alignment) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'wizard') setEditingAttendee(null);
        }} 
        onBookMeeting={() => setIsBookingOpen(true)}
        onShareLink={() => setIsShareModalOpen(true)}
      />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TopNavBar Header (Authority: Mockups) */}
        <header className="bg-white sticky top-0 w-full z-20 shadow-sm border-b border-outline-variant">
          <div className="flex justify-between items-center w-full px-12 py-4 max-w-7xl mx-auto">
            
            {/* Topbar Left Title context */}
            <div className="flex items-center gap-4">
              <span className="font-display text-2xl font-bold text-primary shrink-0">
                {eventSettings.eventName}
              </span>
              <span className="h-5 w-[1px] bg-outline-variant shrink-0"></span>
              <span className="font-sans text-[10px] font-bold tracking-widest text-on-surface-variant uppercase shrink-0">
                {activeTab === 'dashboard' && "Overview"}
                {activeTab === 'attendees' && "Attendee Management"}
                {activeTab === 'wizard' && "Profile Completion"}
                {activeTab === 'ebook' && "eBook & Roster Booklet"}
                {activeTab === 'events' && "Event Timelines"}
                {activeTab === 'settings' && "Platform Setup"}
                {activeTab === 'help' && "Service Portal"}
              </span>
            </div>

            {/* Topbar Right Icons & Avatar */}
            <div className="flex items-center gap-4">
              
              {/* Share Attendee Form Link button */}
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <Share2 className="w-3.5 h-3.5 text-secondary-light" />
                <span className="hidden sm:inline">Share Attendee Link</span>
              </button>

              {/* Search input helper */}
              <div className="relative hidden lg:block shrink-0">
                <input 
                  type="text" 
                  placeholder="Search delegates..." 
                  onClick={() => {
                    setActiveTab('attendees');
                    triggerToast("Toggled delegates directory for direct real-time searching.", "info");
                  }}
                  className="bg-surface-container-low border border-outline-variant rounded-full pl-10 pr-4 py-2 w-60 text-xs font-medium focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all cursor-pointer"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              </div>

              {/* Notification bell and profile dropdown triggers */}
              <div className="flex items-center gap-4 shrink-0 relative">
                
                {/* Bell */}
                <button 
                  onClick={() => {
                    setShowNotificationsDropdown(!showNotificationsDropdown);
                    setUnreadNotifications(0);
                  }}
                  className="relative p-1 text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotificationsDropdown && (
                  <div className="absolute right-0 mt-3 top-full w-80 bg-white border border-outline-variant rounded-xl shadow-2xl z-30 p-4 space-y-3 animate-fade-in text-xs">
                    <div className="flex justify-between items-center border-b border-outline-variant pb-2 select-none">
                      <span className="font-bold text-primary uppercase tracking-wider text-[10px]">Unread Alert Logs</span>
                      <button onClick={() => setShowNotificationsDropdown(false)} className="text-on-surface-variant hover:text-primary"><X className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="space-y-3 leading-relaxed">
                      <div className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5"></span>
                        <p className="text-on-surface-variant">John Doe submitted their biography asset file for verification.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5"></span>
                        <p className="text-on-surface-variant">120 pending invitations dispatched automatically via cloud relays.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5"></span>
                        <p className="text-on-surface-variant">System completed static backup file generation successfully.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help quick links portal toggler */}
                <button 
                  onClick={() => setActiveTab('help')}
                  className="p-1 text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>

                {/* Main Admin Executive Avatar display */}
                <div 
                  onClick={() => {
                    setActiveTab('settings');
                    triggerToast("Configuring primary executive administration profile.", "info");
                  }}
                  className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant cursor-pointer hover:border-secondary transition-colors"
                >
                  <img 
                    referrerPolicy="no-referrer"
                    src={ADMIN_AVATAR} 
                    alt="Platform Admin Avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Viewport Core content */}
        <main className="p-12 flex-grow max-w-7xl mx-auto w-full relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              
              {/* 1. DASHBOARD OVERVIEW SCREEN */}
              {activeTab === 'dashboard' && (
                <DashboardView 
                  attendees={attendees}
                  activities={activities}
                  eventSettings={eventSettings}
                  onNavigateToTab={(tab) => {
                    setActiveTab(tab);
                    if (tab !== 'wizard') setEditingAttendee(null);
                  }}
                  onUploadCSV={() => setIsCsvUploaderOpen(true)}
                  onTriggerToast={triggerToast}
                  onReviewAttendee={(id) => {
                    setActiveTab('attendees');
                    triggerToast("Loading profile directories for manual approval.", "info");
                  }}
                />
              )}

              {/* 2. ATTENDEES (DELEGATES DIRECTORY) */}
              {activeTab === 'attendees' && (
                <AttendeesView 
                  attendees={attendees}
                  eventSettings={eventSettings}
                  onUpdateStatus={handleUpdateStatus}
                  onBulkApprove={handleBulkApprove}
                  onTriggerToast={triggerToast}
                  onEditAttendee={handleEditAttendeeRequest}
                />
              )}

              {/* 3. PROFILE REGISTRATION WIZARD */}
              {activeTab === 'wizard' && (
                <ProfileWizardView 
                  eventSettings={eventSettings}
                  editingAttendee={editingAttendee}
                  onSave={handleSaveAttendee}
                  onCancelEdit={() => {
                    setEditingAttendee(null);
                    setActiveTab('attendees');
                  }}
                  onTriggerToast={triggerToast}
                />
              )}

              {/* 3.5 COMMEMORATIVE ANNIVERSARY EBOOK BUILDER & PUBLIC PORTAL */}
              {activeTab === 'ebook' && (
                <EBookBuilderView
                  attendees={attendees}
                  eventSettings={eventSettings}
                  onAddAttendee={(newAttendee) => {
                    setAttendees(prev => [newAttendee, ...prev]);
                    const newActivity: Activity = {
                      id: `act-${Date.now()}`,
                      user: newAttendee.name,
                      action: `registered profile via public self-invitation form`,
                      timestamp: "Just now",
                      type: "add"
                    };
                    setActivities(prev => [newActivity, ...prev]);
                  }}
                  onTriggerToast={triggerToast}
                />
              )}

              {/* 4. EVENTS TIMELINE PLACEHOLDER */}
              {activeTab === 'events' && (
                <div className="bg-white rounded-xl border border-outline-variant p-10 text-center space-y-6 max-w-2xl mx-auto ambient-shadow">
                  <div className="w-16 h-16 bg-secondary/15 rounded-full flex items-center justify-center text-secondary mx-auto">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl font-bold text-primary">Summit Elite Timeline</h2>
                    <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-md mx-auto">
                      All timelines synchronize automatically with your custom event dates in Settings.
                    </p>
                  </div>
                  
                  {/* Dynamic Dates Timeline view */}
                  <div className="p-6 bg-surface-bright rounded-lg border border-outline-variant/50 max-w-md mx-auto text-left space-y-4">
                    <div className="flex gap-4 items-start border-l-2 border-secondary pl-4 py-1">
                      <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-primary">Platform Opening Day</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{eventSettings.startDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start border-l-2 border-outline-variant pl-4 py-1">
                      <Award className="w-4 h-4 text-on-surface-variant shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-primary">10th Anniversary Banquet Gala</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">Nov 14, 2024</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start border-l-2 border-secondary pl-4 py-1">
                      <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-primary">Commemorative Closing Banquet</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{eventSettings.endDate}</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="bg-primary text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded hover:bg-secondary transition-colors cursor-pointer active:scale-95 shadow"
                  >
                    Configure Dates
                  </button>
                </div>
              )}

              {/* 5. SETTINGS PAGE (EVENT CONFIGURATION) */}
              {activeTab === 'settings' && (
                <SettingsView 
                  initialSettings={eventSettings}
                  onSaveSettings={handleSaveSettings}
                  onTriggerToast={triggerToast}
                />
              )}

              {/* 6. HELP PORTAL PORTAL */}
              {activeTab === 'help' && (
                <HelpView 
                  onNavigateToTab={setActiveTab}
                  onBookMeeting={() => setIsBookingOpen(true)}
                />
              )}

            </motion.div>
          </AnimatePresence>

        </main>

        {/* Global Footer (Authority: mockups layout) */}
        <footer className="mt-auto bg-white border-t border-outline-variant py-6 w-full shrink-0">
          <div className="flex justify-between items-center px-12 max-w-7xl mx-auto w-full text-xs">
            <span className="font-sans font-bold text-primary tracking-wide">
              Summit Elite Platform
            </span>
            <p className="font-sans text-on-surface-variant opacity-75">
              © 2026 Summit Elite Platform. 10th Anniversary Edition.
            </p>
            <div className="flex gap-6 font-sans font-bold tracking-wider uppercase text-[10px] text-on-surface-variant">
              <a href="#support" onClick={(e) => { e.preventDefault(); setActiveTab('help'); }} className="hover:text-secondary transition-colors">Support</a>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); triggerToast("Privacy Policy compiled under editorial mandates.", "info"); }} className="hover:text-secondary transition-colors">Privacy Policy</a>
              <a href="#terms" onClick={(e) => { e.preventDefault(); triggerToast("Platform Terms of Service synchronized successfully.", "info"); }} className="hover:text-secondary transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>

      </div>

      {/* 1. INTERACTIVE "BOOK MEETING" CALENDAR SCHEDULER */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden border border-outline-variant premium-shadow flex flex-col">
            <div className="h-1.5 bg-secondary w-full"></div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-bold text-primary">Book Consulting Meeting</h3>
                  <p className="font-sans text-xs text-on-surface-variant">Schedule an anniversary review consultation with directors.</p>
                </div>
                <button 
                  onClick={() => setIsBookingOpen(false)}
                  className="p-1 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>

              <form onSubmit={handleConfirmMeeting} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Meeting Agenda Topic</label>
                  <input 
                    type="text"
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary outline-none font-semibold text-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Choose Date</label>
                    <input 
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary outline-none font-semibold text-primary"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Choose Time</label>
                    <input 
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary outline-none font-semibold text-primary"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
                  <button 
                    type="button"
                    onClick={() => setIsBookingOpen(false)}
                    className="px-4 py-2.5 border border-outline-variant hover:bg-surface-container-high text-xs font-bold tracking-wider uppercase rounded transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white text-xs font-bold tracking-wider uppercase rounded hover:bg-secondary transition-all cursor-pointer active:scale-95"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. MOCK CSV FILE PARSE IMPORT OVERLAY */}
      {isCsvUploaderOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden border border-outline-variant premium-shadow">
            <div className="h-1.5 bg-secondary w-full"></div>
            
            <div className="p-6 space-y-6 text-center">
              <div className="flex justify-between items-center border-b border-outline-variant pb-3 select-none">
                <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-wider">CSV Data Import</span>
                <button onClick={() => setIsCsvUploaderOpen(false)} className="text-on-surface-variant hover:text-primary cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <div className="py-4 space-y-3">
                <div className="w-16 h-16 bg-secondary/15 rounded-full flex items-center justify-center text-secondary mx-auto">
                  <Upload className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans font-bold text-sm text-primary uppercase tracking-wide">Import Attendee CSV list</h4>
                  <p className="font-sans text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                    Choose a preset file format simulation to auto-parse new high-level executive profile submissions.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleCSVUploadSuccess}
                  className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <CheckCircle className="w-4 h-4 text-secondary-light" />
                  <span>Parse simulated_attendees.csv</span>
                </button>
                
                <button 
                  type="button"
                  onClick={() => setIsCsvUploaderOpen(false)}
                  className="w-full border border-outline-variant hover:bg-surface-container-high py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SHARE ATTENDEE FORM MODAL */}
      <ShareLinkModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        eventSettings={eventSettings}
        onOpenGuestPortal={() => setIsGuestMode(true)}
        onTriggerToast={triggerToast}
      />

    </div>
  );
}
