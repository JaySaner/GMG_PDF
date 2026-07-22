<div align="center">
<h1>GMG Delegate Portal</h1>
<p>Premium admin console and delegate profile management platform with real-time analytics, attendee registration, and event management</p>
</div>

## Overview

The **GMG Delegate Portal** is a professional event management application designed to streamline delegate registration, profile management, and event administration. Built with **React**, **TypeScript**, and **Supabase**, it provides a secure, scalable solution for managing corporate events.

### Key Features

- 👥 **Attendee Management**: Register, approve, and manage delegate profiles
- 📊 **Real-time Analytics**: Track registration status and event metrics
- 🎯 **Event Configuration**: Customize event settings, dates, and venue details
- 📋 **Profile Wizard**: Guided profile creation for new delegates
- 📈 **Activity Tracking**: Monitor all actions and changes in real-time
- 🔐 **Secure Authentication**: Built-in user authentication via Supabase
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **UI Components**: Lucide Icons, Motion animations
- **Build Tool**: Vite

## Prerequisites

- Node.js 16+ and npm
- Supabase account (free tier available at https://supabase.com)
- Git for version control

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/gmg-delegate-portal.git
cd gmg-delegate-portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to **Project Settings** → **API**
4. Copy your **Project URL** and **Anon Key**

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

### 5. Initialize Supabase Database

Run the following SQL queries in the Supabase SQL Editor:

```sql
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
```

### 6. Run Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Project Structure

```
src/
├── components/          # React components
│   ├── DashboardView.tsx
│   ├── AttendeesView.tsx
│   ├── SettingsView.tsx
│   └── ...
├── hooks/               # Custom React hooks
│   └── useSupabase.ts  # Supabase data fetching
├── lib/                 # Utilities and configurations
│   └── supabase.ts     # Supabase client setup
├── data/               # Static data (deprecated - use Supabase)
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main app component
└── index.css           # Global styles
```

## Building for Production

```bash
npm run build
npm run preview
```

The production build will be created in the `dist` directory.

## Deployment

### Option 1: Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Option 2: Deploy to Netlify

```bash
npm run build
# Deploy the dist folder to Netlify
```

### Option 3: Deploy to Your Own Server

```bash
npm run build
# Copy dist folder to your server
# Configure your web server to serve index.html for all routes
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking

## Database Schema

### attendees
- **id**: Unique identifier
- **name**: Full name of delegate
- **designation**: Job title
- **company**: Organization name
- **status**: Registration status (Approved, Under Review, etc.)
- **expertise**: Array of expertise areas
- **isAnniversaryAttendee**: Boolean flag for special attendees

### event_settings
- **eventName**: Name of the event
- **startDate/endDate**: Event dates
- **venueAddress**: Event location
- **logoUrl/coverBannerUrl**: Event branding
- **themeAccent**: Primary color for UI

### activities
- **id**: Activity identifier
- **user**: User who performed action
- **action**: Description of action
- **type**: Activity type (add, approve, edit, info)
- **timestamp**: When action occurred

## Security

- Supabase handles authentication and authorization
- All API calls use row-level security policies
- Environment variables are never exposed to the client
- CORS is configured at the Supabase level

## Troubleshooting

### Missing Environment Variables
Make sure `.env.local` exists and contains valid Supabase credentials.

### Database Connection Errors
Verify your Supabase URL and key are correct. Check network connectivity.

### Build Errors
Run `npm install` again and ensure all dependencies are installed.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

SPDX-License-Identifier: Apache-2.0

## Support

For issues and questions, please open an issue on the GitHub repository.
