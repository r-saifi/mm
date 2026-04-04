/**
 * Supabase client — used for file storage only.
 * Auth and database stay on Firebase.
 *
 * Required .env vars:
 *   VITE_SUPABASE_URL       → Supabase Dashboard → Settings → API → Project URL
 *   VITE_SUPABASE_ANON_KEY  → Supabase Dashboard → Settings → API → anon / public key
 *
 * Storage setup:
 *   1. Go to Supabase Dashboard → Storage → New Bucket
 *   2. Name it "images", enable "Public bucket"
 *   3. That's it — uploads will be publicly readable via URL
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl  && !supabaseUrl.startsWith('YOUR_') &&
  supabaseKey  && !supabaseKey.startsWith('YOUR_');

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
