-- GMG Delegate Portal - Supabase SQL Schema
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- ============================================
-- 1. Create attendees table
-- ============================================
CREATE TABLE attendees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  company TEXT NOT NULL,
  industry TEXT NOT NULL,
  status TEXT CHECK (status IN ('Approved', 'Under Review', 'Needs Changes', 'Rejected')) DEFAULT 'Under Review',
  dateSubmitted TEXT NOT NULL,
  photoUrl TEXT,
  logoUrl TEXT,
  city TEXT,
  stateProv TEXT,
  country TEXT,
  expertise TEXT[] DEFAULT '{}',
  isAnniversaryAttendee BOOLEAN DEFAULT FALSE,
  sector TEXT CHECK (sector IN ('Service', 'Construction', 'Manufacturing', 'Trading')),
  bio TEXT,
  linkedinUrl TEXT,
  websiteUrl TEXT,
  emailAddress TEXT,
  phoneNumber TEXT,
  lookingFor TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. Create event_settings table
-- ============================================
CREATE TABLE event_settings (
  id SERIAL PRIMARY KEY,
  eventName TEXT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  venueAddress TEXT NOT NULL,
  organizerDetails TEXT,
  logoUrl TEXT,
  themeAccent TEXT DEFAULT '#775a19',
  coverBannerUrl TEXT,
  enableDownloads BOOLEAN DEFAULT TRUE,
  enableGuestPhotoSelection BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. Create activities table
-- ============================================
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT,
  timestamp TEXT NOT NULL,
  type TEXT CHECK (type IN ('add', 'approve', 'edit', 'info')) DEFAULT 'info',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. Insert default event settings
-- ============================================
INSERT INTO event_settings (eventName, startDate, endDate, venueAddress, organizerDetails)
VALUES (
  'GMG Delegate Portal',
  '2026-11-12',
  '2026-11-15',
  'GMG Global Headquarters, Dubai UAE',
  'GMG Events | Contact: events@gmgportal.com | Phone: +971 4 555 0100'
);

-- ============================================
-- 5. Create indexes for performance
-- ============================================
CREATE INDEX idx_attendees_status ON attendees(status);
CREATE INDEX idx_attendees_company ON attendees(company);
CREATE INDEX idx_activities_username ON activities(username);
CREATE INDEX idx_activities_created_at ON activities(created_at);

-- ============================================
-- 6. Enable Row Level Security (optional)
-- ============================================
-- Uncomment these lines if you want to enable RLS
-- ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Allow public read access
-- CREATE POLICY "Allow public read" ON attendees FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON event_settings FOR SELECT USING (true);
-- CREATE POLICY "Allow public read" ON activities FOR SELECT USING (true);

-- ============================================
-- Done! All tables created successfully
-- ============================================
