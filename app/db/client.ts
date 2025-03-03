import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { config } from 'dotenv';
config();

// You would generate the Database type using Supabase CLI:
// npx supabase gen types typescript --project-id mlsduicorsuueeowkqwl > types/supabase.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create regular client (for browser usage)
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Create admin client (for server-side operations)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin: SupabaseClient<Database> | null = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey)
  : null;