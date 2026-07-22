import { createClient } from '@supabase/supabase-js';

// Production Ready Supabase Credentials with Environment Variable Overrides
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukifvlkrrwxdrskizirj.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Zsbtnrob5c1E9LN2P2EaQw_DnHZsrxE';

export const isSupabaseConfigured = () => true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
