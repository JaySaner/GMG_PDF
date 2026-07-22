# Deploy to Vercel - Step-by-Step Guide

## ✅ Prerequisites

- ✅ GitHub repository created: `https://github.com/JaySaner/GMG_PDF.git`
- ✅ Code pushed to GitHub main branch
- ✅ Supabase project created with tables
- ✅ Supabase credentials ready
- ✅ Build tested locally (successful)

## 🚀 Step 1: Connect to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub repositories

## 🔗 Step 2: Import Your Project

1. Click **"New Project"** on Vercel dashboard
2. Search for **"GMG_PDF"** repository
3. Click **"Import"**

## 🔑 Step 3: Set Environment Variables

1. In the import screen, click **"Environment Variables"**
2. Add these two variables:

   **Name:** `VITE_SUPABASE_URL`
   **Value:** `https://your-project.supabase.co`
   
   **Name:** `VITE_SUPABASE_ANON_KEY`
   **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your anon key)

3. Get these values from Supabase:
   - Go to Supabase Dashboard
   - Click your project
   - Go to **Settings** → **API**
   - Copy **Project URL** and **Anon Public Key**

## 🎯 Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for deployment (usually 2-3 minutes)
3. You'll see a success screen with your live URL

## ✨ Step 5: Verify

1. Click the **"Visit"** button or copy your new URL
2. You should see your app live! 🎉
3. Test a feature to verify Supabase is connected

## 🔄 Future Updates

Every time you push to GitHub `main` branch:
1. Vercel automatically redeploys
2. No additional steps needed
3. Your changes are live in minutes

## 📝 Environment Variables Location

If you need to update environment variables later:
1. Go to your Vercel project dashboard
2. Click **"Settings"**
3. Click **"Environment Variables"**
4. Edit or add variables
5. Redeploy will happen automatically

## ✅ Your Live App

Once deployed, you'll get a URL like:
`https://gmg-pdf.vercel.app`

Share this with your team!

## 🆘 Troubleshooting

### Build fails on Vercel but works locally?
- Check environment variables are correct
- Ensure Supabase URL doesn't have trailing slash
- Verify both VITE_ variables are set

### App loads but data doesn't show?
- Check browser console for errors
- Verify Supabase tables exist
- Make sure env variables match exactly

### Need to see logs?
1. Go to project dashboard
2. Click **"Deployments"**
3. Click on a deployment
4. View build and runtime logs

## 🎉 Done!

Your app is now live on Vercel!

**Share with team:**
- App URL: `https://your-vercel-url.vercel.app`
- GitHub: `https://github.com/JaySaner/GMG_PDF`
- Admin can access at: Your app URL

Enjoy! 🚀
