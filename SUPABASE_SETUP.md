# Supabase Setup Guide

## Quick Start

This guide will walk you through setting up Supabase for the GMG Delegate Portal.

## 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **Sign Up**
3. Sign in with GitHub (recommended) or email
4. Create a new organization (optional)

## 2. Create a New Project

1. Click **"New Project"** or **Create a new project**
2. Fill in project details:
   - **Name**: `gmg-delegate-portal` (or your preference)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`, `eu-west-1`)
3. Click **"Create new project"** and wait for initialization (2-3 minutes)

## 3. Get Your API Keys

Once your project is ready:

1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (Service URL): `https://your-project.supabase.co`
   - **Anon Public Key** (under `anon` section): `eyJh...`
3. Save these values - you'll need them for `.env.local`

## 4. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor** (on the left sidebar)
2. Click **"New Query"**
3. Copy and paste the SQL below, then click **"Run"**

```sql
-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create attendees table
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

-- Create event_settings table
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

-- Create activities table
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  user TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT,
  timestamp TEXT NOT NULL,
  type TEXT CHECK (type IN ('add', 'approve', 'edit', 'info')) DEFAULT 'info',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default event settings
INSERT INTO event_settings (eventName, startDate, endDate, venueAddress, organizerDetails)
VALUES (
  'GMG Delegate Portal',
  '2026-11-12',
  '2026-11-15',
  'GMG Global Headquarters, Dubai UAE',
  'GMG Events | Contact: events@gmgportal.com | Phone: +971 4 555 0100'
);

-- Create indexes for better performance
CREATE INDEX idx_attendees_status ON attendees(status);
CREATE INDEX idx_attendees_company ON attendees(company);
CREATE INDEX idx_activities_user ON activities(user);
CREATE INDEX idx_activities_created_at ON activities(created_at);
```

## 5. (Optional) Set Up Row Level Security

To add security policies, run in the SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust as needed)
CREATE POLICY "Allow public read" ON attendees FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON event_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON activities FOR SELECT USING (true);
```

## 6. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your Supabase values:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGc..."
```

3. Replace with your actual credentials from Step 3

## 7. Install Dependencies and Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 8. Add Test Data (Optional)

You can insert test attendees via the SQL Editor:

```sql
INSERT INTO attendees (
  id, name, designation, company, industry, status, dateSubmitted,
  photoUrl, city, stateProv, country, expertise, isAnniversaryAttendee,
  sector, bio, emailAddress, phoneNumber
) VALUES (
  'test-1',
  'John Doe',
  'CEO',
  'Tech Corp',
  'Technology',
  'Approved',
  '2026-07-20',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  'San Francisco',
  'CA',
  'USA',
  ARRAY['Leadership', 'Innovation', 'Strategy'],
  true,
  'Service',
  'Experienced technology leader with 15+ years in the industry',
  'john@techcorp.com',
  '+1-555-0100'
);
```

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` exists in the project root
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correctly set
- Restart the dev server after updating `.env.local`

### "Cannot connect to Supabase"
- Verify your project is running in the Supabase dashboard
- Check network connectivity
- Ensure your API key hasn't been revoked

### "Database table not found"
- Make sure you ran all the SQL queries in Step 4
- Verify table names match exactly (case-sensitive)
- Check the Tables section in Supabase dashboard

## Next Steps

1. **Deploy to Production**: See README.md for deployment options
2. **Add Authentication**: Enable Supabase Auth for user management
3. **Setup Real-time**: Enable real-time subscriptions for live updates
4. **Backup Database**: Configure automated backups in project settings

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Guide](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [SQL Best Practices](https://supabase.com/docs/guides/database/overview)

---

**Questions?** Check the [Supabase Community](https://github.com/supabase/supabase/discussions) or create an issue on GitHub.
