# Supabase Integration Migration Guide

This guide shows how to update components to use real Supabase data instead of mockData.

## Overview

The project has been set up with Supabase integration. Components currently use `localStorage` with fallback to `mockData`. Follow this guide to migrate them to use the Supabase hooks.

## Custom Hooks Available

Located in `src/hooks/useSupabase.ts`:

- `useAttendees()` - Fetch all attendees
- `useEventSettings()` - Fetch event settings
- `useActivities()` - Fetch activities (last 20)
- `addAttendee(attendee)` - Add new attendee
- `updateAttendee(id, updates)` - Update attendee
- `updateEventSettings(settings)` - Update event settings
- `addActivity(activity)` - Add activity log entry

## Step 1: Update App.tsx

Replace the localStorage/mockData pattern with Supabase hooks:

### Before:
```typescript
import { INITIAL_ATTENDEES, INITIAL_ACTIVITIES, INITIAL_EVENT_SETTINGS } from './data/mockData';

const [attendees, setAttendees] = useState<Attendee[]>(() => {
  const saved = localStorage.getItem('summit_attendees');
  return saved ? JSON.parse(saved) : INITIAL_ATTENDEES;
});
```

### After:
```typescript
import { useAttendees, useEventSettings, useActivities } from './hooks/useSupabase';

export default function App() {
  const { attendees, loading: attendeesLoading } = useAttendees();
  const { settings: eventSettings, loading: settingsLoading } = useEventSettings();
  const { activities, loading: activitiesLoading } = useActivities();
  
  if (attendeesLoading || settingsLoading) {
    return <LoadingSpinner />;
  }
```

## Step 2: Update Attendee Operations

### Adding an Attendee:

```typescript
import { addAttendee, addActivity } from './hooks/useSupabase';

async function handleAddAttendee(attendee: Attendee) {
  try {
    await addAttendee(attendee);
    
    // Log the activity
    await addActivity({
      id: `act-${Date.now()}`,
      user: 'Admin',
      action: `added attendee ${attendee.name}`,
      target: attendee.id,
      timestamp: new Date().toISOString(),
      type: 'add'
    });
    
    showToast('Attendee added successfully', 'success');
  } catch (error) {
    showToast('Failed to add attendee', 'error');
  }
}
```

### Updating an Attendee:

```typescript
import { updateAttendee, addActivity } from './hooks/useSupabase';

async function handleUpdateAttendee(id: string, updates: Partial<Attendee>) {
  try {
    await updateAttendee(id, updates);
    
    await addActivity({
      id: `act-${Date.now()}`,
      user: 'Admin',
      action: `updated attendee status to ${updates.status}`,
      target: id,
      timestamp: new Date().toISOString(),
      type: 'edit'
    });
    
    showToast('Attendee updated successfully', 'success');
  } catch (error) {
    showToast('Failed to update attendee', 'error');
  }
}
```

## Step 3: Update Event Settings

```typescript
import { updateEventSettings } from './hooks/useSupabase';

async function handleUpdateEventSettings(newSettings: Partial<EventSettings>) {
  try {
    await updateEventSettings(newSettings);
    showToast('Event settings updated', 'success');
  } catch (error) {
    showToast('Failed to update settings', 'error');
  }
}
```

## Step 4: Handle Real-time Updates (Optional)

For real-time updates, use Supabase subscriptions:

```typescript
import { supabase } from './lib/supabase';

useEffect(() => {
  const subscription = supabase
    .from('attendees')
    .on('*', (payload) => {
      console.log('Change received!', payload);
      // Refresh attendees list
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## Step 5: Remove MockData Dependencies

Once all components are updated:

1. Remove unused imports of mockData
2. Keep `src/data/mockData.ts` for reference (useful for seeding data)
3. Update localStorage cleanup (optional)

## Common Patterns

### Loading State:
```typescript
const { attendees, loading, error } = useAttendees();

if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
```

### With Filtering:
```typescript
const { attendees } = useAttendees();

const approvedAttendees = attendees.filter(a => a.status === 'Approved');
```

### Refetch After Mutation:
```typescript
const { attendees, loading } = useAttendees();

async function addAttendee(newAttendee) {
  await addAttendee(newAttendee);
  // Hook will automatically refetch data
}
```

## Error Handling

Always handle errors gracefully:

```typescript
try {
  await updateAttendee(id, updates);
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to update:', error.message);
    showToast(error.message, 'error');
  }
}
```

## Testing Locally

1. Start your dev server: `npm run dev`
2. Check browser console for any Supabase connection errors
3. Verify data appears from Supabase in the UI
4. Test add/update/delete operations

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Data not loading
- Check `.env.local` has correct Supabase credentials
- Verify database tables exist in Supabase
- Check browser console for errors

### Stale data
- The hooks don't auto-refresh. After mutations, either:
  - Refresh the page
  - Implement manual refetch
  - Use Supabase real-time subscriptions

## Next Steps

1. Update components one by one
2. Test thoroughly before moving to production
3. Consider implementing real-time subscriptions
4. Add error boundaries for better UX
5. Implement loading states for better UX

## Questions?

- Check `src/hooks/useSupabase.ts` for all available functions
- Review `SUPABASE_SETUP.md` for database setup
- Check Supabase docs: https://supabase.com/docs

---

Happy migrating! 🚀
