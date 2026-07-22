# 🔧 Troubleshooting: Both Portals Not Working

## ✅ Quick Diagnostic

Your app is now deployed but may need configuration. If you see a "Configuration Required" error, follow these steps:

---

## 🎯 Step 1: Verify Vercel Environment Variables

This is the **#1 most common issue**!

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Find your "gmg-pdf" project
   - Click on it

2. **Go to Settings**
   - Click "Settings" tab (top right)
   - Click "Environment Variables" (left menu)

3. **Check if variables exist:**
   - Look for `VITE_SUPABASE_URL`
   - Look for `VITE_SUPABASE_ANON_KEY`

4. **If they DON'T exist:**
   - Click "Add New"
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** Your Supabase URL from Step 2
   - Click "Save"
   
   - Click "Add New" again
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase Anon Key from Step 2
   - Click "Save"

5. **Redeploy:**
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Wait 2-3 minutes for new deployment

---

## 🎯 Step 2: Get Supabase Credentials

1. **Go to Supabase Dashboard**
   - https://app.supabase.com

2. **Select your project**

3. **Go to Settings**
   - Click gear icon (⚙️) bottom left
   - Click "API"

4. **Copy these:**

   ```
   Project URL: https://your-project.supabase.co
   Anon Public Key: eyJhbGciOiJIUzI1NiIs...
   ```

5. **Add to Vercel** (from Step 1 above)

---

## 🎯 Step 3: Test the App

After adding variables and redeploying:

1. **Wait 2-3 minutes** for Vercel to redeploy
2. **Visit:** https://gmg-pdf.vercel.app/
3. Should see the admin portal ✅
4. **Visit:** https://gmg-pdf.vercel.app/?mode=attendee
5. Should see the attendee form ✅

---

## 🚨 If Still Not Working

### Check 1: Are variables actually saved?
```
In Vercel Settings → Environment Variables:
✅ VITE_SUPABASE_URL exists
✅ VITE_SUPABASE_ANON_KEY exists
✅ Both have correct values
```

### Check 2: Did you redeploy?
```
After adding variables:
1. Go to Deployments tab
2. Click "Redeploy" on latest
3. Wait for it to say "Ready"
```

### Check 3: Are Supabase credentials correct?
```
✅ URL starts with https://
✅ URL ends with .supabase.co
✅ Anon Key is 100+ characters
✅ Both copied exactly (no extra spaces)
```

### Check 4: Do database tables exist?
```
In Supabase:
1. Go to Tables (left menu)
2. You should see:
   ✅ attendees
   ✅ event_settings
   ✅ activities

If not, run SQL from SQL_SETUP.sql
```

---

## 📱 Accessing Both Portals

### Admin Portal (Full Access)
```
URL: https://gmg-pdf.vercel.app/
Features:
✅ Dashboard with metrics
✅ Attendee management
✅ Event settings
✅ Activity log
✅ Admin functions
```

### Attendee Portal (Form Only)
```
URL: https://gmg-pdf.vercel.app/?mode=attendee
Features:
✅ Self-registration form
✅ Profile submission
✅ Limited access (no admin features)
✅ Data saved to Supabase
```

---

## ✨ What Should Happen

### Admin Portal (`/`)
```
✅ You see the dashboard
✅ Shows attendee list (empty initially)
✅ Shows activity log (empty initially)
✅ All menu items work
✅ Can add attendees
```

### Attendee Portal (`?mode=attendee`)
```
✅ You see a form
✅ Can fill in profile
✅ Can select photo
✅ Can select expertise
✅ Submit button works
✅ Data saved to Supabase
```

---

## 🎯 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Configuration Required" error | Add env vars to Vercel (see Step 1) |
| Blank page | Refresh page, wait 30 seconds |
| Page loads but no data | Check Supabase tables exist |
| Can't switch between portals | Check URL: needs `?mode=attendee` |
| Form won't submit | Check browser console for errors |

---

## 📞 Need Help?

1. **Check browser console** (F12 → Console)
   - Look for red error messages
   - Copy the error
   - Share it for help

2. **Verify Supabase connection**
   - Go to Supabase Dashboard
   - Run a simple SQL query
   - Should work fine

3. **Check Vercel logs**
   - Go to Vercel Dashboard
   - Deployments → Click latest
   - Scroll to see logs
   - Look for errors

---

## 🎉 Once Working

Both should be fully functional:

✅ **Admin can:**
- View all attendees
- Add new attendees
- Edit attendee info
- Change approval status
- See activity log
- Configure event settings

✅ **Attendees can:**
- Access form via `?mode=attendee` URL
- Fill in their profile
- Submit to database
- See success message
- Can't access admin panel

---

## Quick Verification Checklist

Before considering it "working":

```
☐ Visit admin portal (/)
☐ See dashboard (no errors)
☐ Visit attendee portal (?mode=attendee)
☐ See registration form (no errors)
☐ Fill form and submit
☐ Data appears in Supabase
☐ Both portals work smoothly
```

If all checked, **you're done!** 🎉

---

**Status:** Deployed and Ready  
**Next:** Verify environment variables in Vercel  
**Time:** 5 minutes

Go to Vercel → Settings → Environment Variables and check/add your Supabase credentials! 🚀
