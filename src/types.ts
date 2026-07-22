/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Attendee {
  id: string;
  name: string;
  designation: string;
  company: string;
  industry: string;
  status: 'Approved' | 'Under Review' | 'Needs Changes' | 'Rejected';
  dateSubmitted: string;
  photoUrl: string;
  logoUrl: string;
  city: string;
  stateProv: string;
  country: string;
  expertise: string[];
  isAnniversaryAttendee: boolean;
  // Commemorative eBook / Roster specific fields
  sector?: 'Service' | 'Construction' | 'Manufacturing' | 'Trading';
  bio?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  emailAddress?: string;
  phoneNumber?: string;
  lookingFor?: string; // "Looking to connect for..." from the PDF
}

export interface EventSettings {
  eventName: string;
  startDate: string;
  endDate: string;
  venueAddress: string;
  organizerDetails: string;
  logoUrl: string;
  themeAccent: string;
  coverBannerUrl: string;
  enableDownloads?: boolean;
  enableGuestPhotoSelection?: boolean;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target?: string;
  timestamp: string;
  type: 'add' | 'approve' | 'edit' | 'info';
}
