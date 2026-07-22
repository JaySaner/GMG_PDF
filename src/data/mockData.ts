/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DEPRECATED: This file is maintained for backward compatibility only.
 * For new development, use the Supabase integration instead.
 * 
 * See MIGRATION_GUIDE.md for instructions on migrating to Supabase.
 * See SUPABASE_SETUP.md for Supabase database setup.
 * 
 * This data is useful for:
 * - Seeding initial database values
 * - Understanding the data structure
 * - Local testing without Supabase
 */

import { Attendee, EventSettings, Activity } from '../types';

export const ADMIN_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBvCT6JYskipPVFJo5D2yq0lgxQLRvGTPbSl5r3_UXjTUc8Nn2dqcECJ6EQ1ecTR0iNS3IqPdb5qkbmdenL1Qqi0Ft2KUx6u_wtBY17okJis8V1e4oSLucNB0xp5Scp29ujWNNNepP-VZUsMZSB57-oQsOBE0sK0i3s6DyxjJU-ACIby18pbMca-8lSG2EOfXsNFcZdAkgSE91f4YAq_vQpTXpmzwtMVDBUVPvfY5llK5vz8Spzds6Z";

export const INITIAL_EVENT_SETTINGS: EventSettings = {
  eventName: "GMG Delegate Portal",
  startDate: "2026-11-12",
  endDate: "2026-11-15",
  venueAddress: "GMG Global Headquarters, Dubai UAE",
  organizerDetails: "GMG Events | Contact: events@gmgportal.com | Phone: +971 4 555 0100",
  logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHGob3oMolEkBqBNyE8tOtmRBPZBB-hongE1W7LLnCdRL8qfsaKBqHFlY6b8Dj-SZsKUzsLNanyTuThOKsoeK8npJmkt2HUBvVH-5bds3gcy4adIVUdf5V11k4h06erW1A5cvCy6LG4WxncFZLLO-R2C-auPKK7YJlu_ei3aARjNZQzjUvXKHlQLftIDC386-pjiJnFqqBAPjqMKB2drn7w-ZsFf55VBo0qczhK2cndweotEthn_s",
  themeAccent: "#775a19",
  coverBannerUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASwjxXcB-Ukn7UT7IPAI91FCA9jrRqevcfzWK9JZ0_e9GE_5akWjMtucOGibgy-7zmFOcAGHDJtTsR4kE_lKtxVBfEy5AFD_Vd-vZO7-MhdUUpkuaKhNPvNwBca-YUubBfCGiCuxuJ0sno7EgVGGi_eZc-gzpbiZbWd1ViyNeHpiAcb6ZmMdh1DlcQdSAghLqTyjfQOE9RyV_3xwpvagjF-BUOa7Vpu16-sDet5Msf0KZcY8ek6Q9h",
  enableDownloads: true,
  enableGuestPhotoSelection: true
};

export const INITIAL_ATTENDEES: Attendee[] = [
  {
    id: "att-gmg-1",
    name: "Mohammad A. Baker",
    designation: "Deputy Chairman & CEO",
    company: "GMG",
    industry: "Retail & Conglomerate",
    status: "Approved",
    dateSubmitted: "Jul 12, 2026",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHGob3oMolEkBqBNyE8tOtmRBPZBB-hongE1W7LLnCdRL8qfsaKBqHFlY6b8Dj-SZsKUzsLNanyTuThOKsoeK8npJmkt2HUBvVH-5bds3gcy4adIVUdf5V11k4h06erW1A5cvCy6LG4WxncFZLLO-R2C-auPKK7YJlu_ei3aARjNZQzjUvXKHlQLftIDC386-pjiJnFqqBAPjqMKB2drn7w-ZsFf55VBo0qczhK2cndweotEthn_s",
    city: "Dubai",
    stateProv: "Dubai",
    country: "United Arab Emirates",
    expertise: ["Strategic Expansion", "Conglomerate Operations", "Global Partnerships"],
    isAnniversaryAttendee: true,
    sector: "Trading",
    bio: "Mohammad A. Baker has led GMG as Deputy Chairman and CEO since 2016, spearheading its transformation into a global well-diversified business. Under his leadership, GMG has scaled across Sports, Food, Health, and Consumer Goods, entering major international markets in Europe and Southeast Asia.",
    linkedinUrl: "https://www.linkedin.com/in/mohammad-a-baker-gmg",
    websiteUrl: "https://gmg.com",
    emailAddress: "m.baker@gmg.com",
    phoneNumber: "+971 4 555 0101",
    lookingFor: "Synergy in retail technology and clean, sustainable supply chain ecosystems."
  },
  {
    id: "att-gmg-2",
    name: "Bilal Fares",
    designation: "Senior Vice President - Sports",
    company: "GMG Sports",
    industry: "Sports Retail & Distribution",
    status: "Approved",
    dateSubmitted: "Jul 14, 2026",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHGob3oMolEkBqBNyE8tOtmRBPZBB-hongE1W7LLnCdRL8qfsaKBqHFlY6b8Dj-SZsKUzsLNanyTuThOKsoeK8npJmkt2HUBvVH-5bds3gcy4adIVUdf5V11k4h06erW1A5cvCy6LG4WxncFZLLO-R2C-auPKK7YJlu_ei3aARjNZQzjUvXKHlQLftIDC386-pjiJnFqqBAPjqMKB2drn7w-ZsFf55VBo0qczhK2cndweotEthn_s",
    city: "Dubai",
    stateProv: "Dubai",
    country: "United Arab Emirates",
    expertise: ["Retail Distribution", "Brand Management", "Athleisure Strategy"],
    isAnniversaryAttendee: true,
    sector: "Trading",
    bio: "Bilal Fares is the Senior Vice President of GMG Sports, directing retail operations for Sun & Sand Sports and partner brands like Nike, Columbia, and Under Armour. Previously, Bilal held leadership roles at Adidas Middle East.",
    linkedinUrl: "https://www.linkedin.com/in/bilal-fares",
    websiteUrl: "https://gmg.com/sports",
    emailAddress: "bilal.fares@gmg.com",
    phoneNumber: "+971 4 555 0122",
    lookingFor: "International sports brand distributors and smart retail experience tech vendors."
  },
  {
    id: "att-gmg-3",
    name: "Amin Baker",
    designation: "Chief Executive Officer - Food",
    company: "GMG Food Division",
    industry: "Food Processing & Distribution",
    status: "Under Review",
    dateSubmitted: "Jul 15, 2026",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHGob3oMolEkBqBNyE8tOtmRBPZBB-hongE1W7LLnCdRL8qfsaKBqHFlY6b8Dj-SZsKUzsLNanyTuThOKsoeK8npJmkt2HUBvVH-5bds3gcy4adIVUdf5V11k4h06erW1A5cvCy6LG4WxncFZLLO-R2C-auPKK7YJlu_ei3aARjNZQzjUvXKHlQLftIDC386-pjiJnFqqBAPjqMKB2drn7w-ZsFf55VBo0qczhK2cndweotEthn_s",
    city: "Dubai",
    stateProv: "Dubai",
    country: "United Arab Emirates",
    expertise: ["FMCG Supply Chain", "Food Processing", "Brand Expansion"],
    isAnniversaryAttendee: true,
    sector: "Manufacturing",
    bio: "Amin Baker leads GMG's food processing and distribution business. He oversees prominent brands like Farm Fresh, Chef's Choice, and Klassic, driving state-of-the-art food manufacturing facilities in Dubai and regional markets.",
    linkedinUrl: "https://www.linkedin.com/in/amin-baker-gmg",
    websiteUrl: "https://gmg.com/food",
    emailAddress: "amin.baker@gmg.com",
    phoneNumber: "+971 4 555 0144",
    lookingFor: "Smart automated food processing machinery and sustainable agricultural suppliers."
  },
  {
    id: "att-gmg-4",
    name: "Roy Gomez",
    designation: "Chief Financial Officer",
    company: "GMG",
    industry: "Financial Strategy & M&A",
    status: "Approved",
    dateSubmitted: "Jul 16, 2026",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHGob3oMolEkBqBNyE8tOtmRBPZBB-hongE1W7LLnCdRL8qfsaKBqHFlY6b8Dj-SZsKUzsLNanyTuThOKsoeK8npJmkt2HUBvVH-5bds3gcy4adIVUdf5V11k4h06erW1A5cvCy6LG4WxncFZLLO-R2C-auPKK7YJlu_ei3aARjNZQzjUvXKHlQLftIDC386-pjiJnFqqBAPjqMKB2drn7w-ZsFf55VBo0qczhK2cndweotEthn_s",
    city: "Dubai",
    stateProv: "Dubai",
    country: "United Arab Emirates",
    expertise: ["Corporate Finance", "Mergers & Acquisitions", "Governance Strategy"],
    isAnniversaryAttendee: true,
    sector: "Service",
    bio: "Roy Gomez is the Chief Financial Officer of GMG, driving financial strategy, governance, and business investments for all business divisions. He is specialized in M&A activities and cross-border financial structures.",
    linkedinUrl: "https://www.linkedin.com/in/roy-gomez-gmg",
    websiteUrl: "https://gmg.com",
    emailAddress: "roy.gomez@gmg.com",
    phoneNumber: "+971 4 555 0105",
    lookingFor: "FinTech partners, treasury optimization engines, and regional venture opportunities."
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "act-gmg-1",
    user: "Mohammad A. Baker",
    action: "registered profile as delegate",
    timestamp: "2 hours ago",
    type: "add"
  },
  {
    id: "act-gmg-2",
    user: "System",
    action: "Automatically verified corporate email domain @gmg.com",
    timestamp: "1 hour ago",
    type: "info"
  },
  {
    id: "act-gmg-3",
    user: "Bilal Fares",
    action: "updated athletic wear biography details",
    timestamp: "45 minutes ago",
    type: "edit"
  },
  {
    id: "act-gmg-4",
    user: "Admin",
    action: "Approved delegation badge for Roy Gomez",
    timestamp: "15 minutes ago",
    type: "approve"
  }
];

