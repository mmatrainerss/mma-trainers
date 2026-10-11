import { createClient } from '@supabase/supabase-js';

// User's provided Supabase Credentials
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://nlyyigqctanvdginzwrj.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_CDWtdlIo3j9wjHePktxWjg_1S4_Z41R';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};
