/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';
import { Attendee, EventSettings, Activity } from '../types';

export function useAttendees() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        if (!hasSupabase) {
          setError('Supabase not configured');
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase!
          .from('attendees')
          .select('*')
          .order('dateSubmitted', { ascending: false });

        if (fetchError) throw fetchError;
        setAttendees(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch attendees');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, []);

  return { attendees, loading, error };
}

export function useEventSettings() {
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!hasSupabase) {
          setError('Supabase not configured');
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase!
          .from('event_settings')
          .select('*')
          .single();

        if (fetchError) throw fetchError;
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (!hasSupabase) {
          setError('Supabase not configured');
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase!
          .from('activities')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(20);

        if (fetchError) throw fetchError;
        setActivities(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
}

export async function addAttendee(attendee: Attendee) {
  if (!hasSupabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase!
    .from('attendees')
    .insert([attendee])
    .select();

  if (error) throw error;
  return data;
}

export async function updateAttendee(id: string, updates: Partial<Attendee>) {
  if (!hasSupabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase!
    .from('attendees')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
}

export async function updateEventSettings(settings: Partial<EventSettings>) {
  if (!hasSupabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase!
    .from('event_settings')
    .update(settings)
    .eq('id', 1)
    .select();

  if (error) throw error;
  return data;
}

export async function addActivity(activity: Activity) {
  if (!hasSupabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase!
    .from('activities')
    .insert([{
      ...activity,
      username: activity.user
    }])
    .select();

  if (error) throw error;
  return data;
}
