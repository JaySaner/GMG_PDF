/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GMG Delegate Portal - Main Application
 * Supabase-integrated admin and attendee management system
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
  Share2,
  Loader
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
  useAttendees, 
  useEventSettings, 
  useActivities,
  addAttendee,
  updateAttendee,
  updateEventSettings,
  addActivity
} from './hooks/useSupabase';
import { ADMIN_AVATAR } from './data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Supabase data hooks
  const { attendees: supabaseAttendees, loading: attendeesLoading } = useAttendees();
  const { settings: supabaseSettings, loading: settingsLoading } = useEventSettings();
  const { activities: supabaseActivities, loading: activitiesLoading } = useActivities();

  // Local state for UI
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [eventSettings, setEventSettings] = useState<EventSettings | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingAttendee, setEditingAttendee] = useState<Attendee | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-11-13');
  const [bookingTime, setBookingTime] = useState('14:00');
  const [bookingTopic, setBookingTopic] = useState('Event Planning Discussion');

  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'attendee' || params.get('view') === 'guest';
    }
    return false;
  });

  // Sync Supabase data to local state
  useEffect(() => {
    setAttendees(supabaseAttendees);
  }, [supabaseAttendees]);

  useEffect(() => {
    if (supabaseSettings) {
      setEventSettings(supabaseSettings);
    }
  }, [supabaseSettings]);

  useEffect(() => {
    setActivities(supabaseActivities);
  }, [supabaseActivities]);

  // Set loading state
  useEffect(() => {
    setIsLoading(attendeesLoading || settingsLoading || activitiesLoading);
  }, [attendeesLoading, settingsLoading, activitiesLoading]);

  // Toast notifications
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Handle save attendee
  const handleSaveAttendee = async (attendee: Attendee) => {
    try {
      const isEditing = attendees.some(a => a.id === attendee.id);
      
      if (isEditing) {
        await updateAttendee(attendee.id, attendee);
        
        await addActivity({
          id: `act-${Date.now()}`,
          user: "Admin",
          action: `updated profile for ${attendee.name}`,
          target: attendee.id,
          timestamp: new Date().toISOString(),
          type: 'edit'
        });
        triggerToast(`✓ Updated ${attendee.name}'s profile successfully!`, 'success');
      } else {
        await addAttendee(attendee);
        
        await addActivity({
          id: `act-${Date.now()}`,
          user: attendee.name,
          action: 'submitted delegate profile',
          target: attendee.id,
          timestamp: new Date().toISOString(),
          type: 'add'
        });
        triggerToast(`✓ Added ${attendee.name} to registry!`, 'success');
      }

      setEditingAttendee(null);
      setActiveTab('attendees');
    } catch (error) {
      console.error('Error saving attendee:', error);
      triggerToast('Failed to save attendee', 'error');
    }
  };

  // Handle update status
  const handleUpdateStatus = async (id: string, newStatus: Attendee['status']) => {
    try {
      const target = attendees.find(a => a.id === id);
      if (!target) return;

      await updateAttendee(id, { status: newStatus });

      await addActivity({
        id: `act-${Date.now()}`,
        user: 'Admin',
        action: `${newStatus === 'Approved' ? 'approved' : 'changed'} ${target.name}'s status to ${newStatus}`,
        target: id,
        timestamp: new Date().toISOString(),
        type: 'approve'
      });

      triggerToast(`✓ Status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      triggerToast('Failed to update status', 'error');
    }
  };

  // Handle bulk approve
  const handleBulkApprove = async (ids: string[]) => {
    try {
      const count = ids.length;
      
      for (const id of ids) {
        await updateAttendee(id, { status: 'Approved' });
      }

      await addActivity({
        id: `act-${Date.now()}`,
        user: 'Admin',
        action: `bulk-approved ${count} delegate profiles`,
        timestamp: new Date().toISOString(),
        type: 'approve'
      });

      triggerToast(`✓ Approved ${count} delegates!`, 'success');
    } catch (error) {
      console.error('Error bulk approving:', error);
      triggerToast('Failed to bulk approve', 'error');
    }
  };

  // Handle save settings
  const handleSaveSettings = async (newSettings: Partial<EventSettings>) => {
    try {
      await updateEventSettings(newSettings);

      await addActivity({
        id: `act-${Date.now()}`,
        user: 'Admin',
        action: 'updated event configuration',
        timestamp: new Date().toISOString(),
        type: 'edit'
      });

      triggerToast('✓ Event settings updated!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      triggerToast('Failed to save settings', 'error');
    }
  };

  // Handle confirm meeting
  const handleConfirmMeeting = async () => {
    try {
      await addActivity({
        id: `act-${Date.now()}`,
        user: 'Admin',
        action: `scheduled meeting: ${bookingTopic} on ${bookingDate} at ${bookingTime}`,
        timestamp: new Date().toISOString(),
        type: 'info'
      });

      triggerToast(`✓ Meeting scheduled for ${bookingDate} at ${bookingTime}!`, 'success');
      setIsBookingOpen(false);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      triggerToast('Failed to schedule meeting', 'error');
    }
  };

  // Guest mode
  if (isGuestMode) {
    // Use default settings if not loaded yet
    const defaultSettings: EventSettings = {
      eventName: 'GMG Delegate Portal',
      startDate: '2026-11-12',
      endDate: '2026-11-15',
      venueAddress: 'GMG Global Headquarters, Dubai UAE',
      organizerDetails: 'GMG Events | Contact: events@gmgportal.com | Phone: +971 4 555 0100',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHGob3oMolEkBqBNyE8tOtmRBPZBB-hongE1W7LLnCdRL8qfsaKBqHFlY6b8Dj-SZsKUzsLNanyTuThOKsoeK8npJmkt2HUBvVH-5bds3gcy4adIVUdf5V11k4h06erW1A5cvCy6LG4WxncFZLLO-R2C-auPKK7YJlu_ei3aARjNZQzjUvXKHlQLftIDC386-pjiJnFqqBAPjqMKB2drn7w-ZsFf55VBo0qczhK2cndweotEthn_s',
      themeAccent: '#775a19',
      coverBannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASwjxXcB-Ukn7UT7IPAI91FCA9jrRqevcfzWK9JZ0_e9GE_5akWjMtucOGibgy-7zmFOcAGHDJtTsR4kE_lKtxVBfEy5AFD_Vd-vZO7-MhdUUpkuaKhNPvNwBca-YUubBfCGiCuxuJ0sno7EgVGGi_eZc-gzpbiZbWd1ViyNeHpiAcb6ZmMdh1DlcQdSAghLqTyjfQOE9RyV_3xwpvagjF-BUOa7Vpu16-sDet5Msf0KZcY8ek6Q9h',
      enableDownloads: true,
      enableGuestPhotoSelection: true
    };

    return (
      <div className="bg-surface-bright font-sans text-on-surface min-h-screen relative">
        <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`pointer-events-auto border shadow-2xl p-4 rounded-xl flex items-start gap-3 w-full ${
                  toast.type === 'success' ? 'bg-green-500 text-white border-green-600' :
                  toast.type === 'error' ? 'bg-red-500 text-white border-red-600' :
                  'bg-primary text-white border-secondary'
                }`}
              >
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs font-semibold leading-relaxed">
                  {toast.message}
                </div>
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="opacity-60 hover:opacity-100 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <GuestAttendeePortalView 
          eventSettings={eventSettings || defaultSettings}
          onAddAttendee={async (newAttendee) => {
            try {
              await addAttendee(newAttendee);
              await addActivity({
                id: `act-${Date.now()}`,
                user: newAttendee.name,
                action: 'submitted profile via guest portal',
                target: newAttendee.id,
                timestamp: new Date().toISOString(),
                type: 'add'
              });
              triggerToast('✓ Profile submitted successfully!', 'success');
            } catch (error) {
              console.error('Error adding attendee:', error);
              triggerToast('Failed to submit profile', 'error');
            }
          }}
          onExitGuestMode={() => setIsGuestMode(false)}
          onTriggerToast={triggerToast}
        />
      </div>
    );
  }

  // Error state
  if (isLoading && !eventSettings && !attendees.length) {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-bright">
          <div className="flex flex-col items-center gap-4 max-w-md">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-600">Configuration Required</h2>
            <p className="text-sm text-on-surface-variant text-center">
              Supabase environment variables are not configured. Please add:
            </p>
            <div className="bg-red-50 border border-red-200 rounded p-3 w-full text-xs font-mono">
              <p>VITE_SUPABASE_URL</p>
              <p>VITE_SUPABASE_ANON_KEY</p>
            </div>
            <p className="text-xs text-on-surface-variant text-center">
              See VERCEL_DEPLOYMENT.md for setup instructions
            </p>
          </div>
        </div>
      );
    }

    // Loading
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bright">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-on-surface-variant">Loading your event data...</p>
        </div>
      </div>
    );
  }

  // Admin mode
  return (
    <div className="bg-surface-bright font-sans text-on-surface min-h-screen flex relative">
      
      {/* Toast System */}
      <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto border shadow-2xl p-4 rounded-xl flex items-start gap-3 w-full ${
                toast.type === 'success' ? 'bg-green-500 text-white border-green-600' :
                toast.type === 'error' ? 'bg-red-500 text-white border-red-600' :
                'bg-primary text-white border-secondary'
              }`}
            >
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs font-semibold leading-relaxed">
                {toast.message}
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'wizard') setEditingAttendee(null);
        }} 
        onBookMeeting={() => setIsBookingOpen(true)}
        onShareLink={() => setIsShareModalOpen(true)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="bg-white sticky top-0 w-full z-20 shadow-sm border-b border-outline-variant">
          <div className="flex justify-between items-center w-full px-12 py-4 max-w-7xl mx-auto">
            
            <div className="flex items-center gap-4">
              <span className="font-display text-2xl font-bold text-primary shrink-0">
                {eventSettings?.eventName || 'GMG Delegate Portal'}
              </span>
              <span className="h-5 w-[1px] bg-outline-variant shrink-0"></span>
              <span className="font-sans text-[10px] font-bold tracking-widest text-on-surface-variant uppercase shrink-0">
                {activeTab === 'dashboard' && "Dashboard"}
                {activeTab === 'attendees' && "Attendee Management"}
                {activeTab === 'wizard' && "Profile Editor"}
                {activeTab === 'ebook' && "Resources"}
                {activeTab === 'events' && "Events"}
                {activeTab === 'settings' && "Settings"}
                {activeTab === 'help' && "Support"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share Link</span>
              </button>

              <div className="relative hidden lg:block shrink-0">
                <input 
                  type="text" 
                  placeholder="Search delegates..." 
                  onClick={() => {
                    setActiveTab('attendees');
                    triggerToast('Switched to attendees view', 'info');
                  }}
                  className="bg-surface-container-low border border-outline-variant rounded-full pl-10 pr-4 py-2 w-60 text-xs font-medium focus:ring-1 focus:ring-secondary focus:border-secondary outline-none transition-all cursor-pointer"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              </div>

              <div className="flex items-center gap-4 shrink-0 relative">
                
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

                {showNotificationsDropdown && (
                  <div className="absolute right-0 mt-3 top-full w-80 bg-white border border-outline-variant rounded-xl shadow-2xl z-30 p-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                      <span className="font-bold text-primary uppercase tracking-wider text-[10px]">Recent Activity</span>
                      <button onClick={() => setShowNotificationsDropdown(false)} className="text-on-surface-variant hover:text-primary">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {activities.slice(0, 5).map(activity => (
                        <div key={activity.id} className="flex items-start gap-2.5 p-2 bg-surface-container-low rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5"></span>
                          <p className="text-on-surface-variant text-xs">{activity.action}</p>
                        </div>
                      ))}
                      {activities.length === 0 && (
                        <p className="text-on-surface-variant text-center py-2">No recent activity</p>
                      )}
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setActiveTab('help')}
                  className="p-1 text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>

                <div 
                  onClick={() => {
                    setActiveTab('settings');
                    triggerToast('Navigate to settings', 'info');
                  }}
                  className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant cursor-pointer hover:border-secondary transition-colors"
                >
                  <img 
                    referrerPolicy="no-referrer"
                    src={ADMIN_AVATAR} 
                    alt="Admin Avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-12 flex-grow max-w-7xl mx-auto w-full relative">
          {activeTab === 'dashboard' && <DashboardView attendees={attendees} activities={activities} />}
          {activeTab === 'attendees' && (
            <AttendeesView 
              attendees={attendees}
              onEditAttendee={(attendee) => {
                setEditingAttendee(attendee);
                setActiveTab('wizard');
              }}
              onUpdateStatus={handleUpdateStatus}
              onBulkApprove={handleBulkApprove}
            />
          )}
          {activeTab === 'wizard' && (
            <ProfileWizardView 
              editingAttendee={editingAttendee}
              onSave={handleSaveAttendee}
              eventSettings={eventSettings}
            />
          )}
          {activeTab === 'ebook' && <EBookBuilderView attendees={attendees} eventSettings={eventSettings} />}
          {activeTab === 'events' && (
            <>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Event Timeline</h2>
                {eventSettings && (
                  <div className="bg-white border border-outline-variant rounded-lg p-6 space-y-4">
                    <div>
                      <p className="text-sm text-on-surface-variant">Event</p>
                      <p className="text-lg font-semibold">{eventSettings.eventName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-on-surface-variant">Start Date</p>
                        <p className="font-semibold">{eventSettings.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-on-surface-variant">End Date</p>
                        <p className="font-semibold">{eventSettings.endDate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-on-surface-variant">Venue</p>
                      <p className="font-semibold">{eventSettings.venueAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === 'settings' && (
            <SettingsView 
              eventSettings={eventSettings}
              onSave={handleSaveSettings}
            />
          )}
          {activeTab === 'help' && <HelpView />}
        </main>
      </div>

      {/* Modals */}
      {isShareModalOpen && (
        <ShareLinkModal onClose={() => setIsShareModalOpen(false)} />
      )}

      {isBookingOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-bold mb-4">Schedule Meeting</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Topic</label>
                <input
                  type="text"
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  className="w-full border border-outline-variant rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full border border-outline-variant rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full border border-outline-variant rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="flex-1 px-4 py-2 border border-outline-variant rounded hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmMeeting}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                >
                  Schedule
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
