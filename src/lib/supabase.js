import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl && !supabaseUrl.startsWith('YOUR_') &&
  supabaseKey && !supabaseKey.startsWith('YOUR_');

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const supabaseReady = isConfigured;

if (!isConfigured) {
  console.warn(
    '[MM Design] Supabase is not configured.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.\n' +
    'Then restart the dev server (npm run dev).'
  );
}
