/**
 * config/supabase.js
 * 
 * Supabase client initialization and configuration.
 * Supabase is used for:
 * - User authentication (sign up, sign in, sign out)
 * - Database operations (restaurants, orders, products)
 * - Real-time data updates
 * 
 * Environment variables required:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous key (public key)
 */

import { createClient } from '@supabase/supabase-js';

// ========== ENVIRONMENT VARIABLES ==========
/** Supabase project URL - loaded from .env.local or Vercel environment */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

/** Supabase anonymous key (public key) - safe to expose in frontend */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ========== ERROR HANDLING ==========
/**
 * Validate that required environment variables are set.
 * If missing, the app will still initialize but database operations will fail.
 * Check browser console for these error messages during development.
 */
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "FATAL ERROR: Supabase environment variables are missing! " +
    "Please ensure you have a .env.local file in your project root " +
    "with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY defined."
  );
}

// ========== SUPABASE CLIENT ==========
/**
 * Initialize Supabase client with URL and anonymous key.
 * This client is used throughout the app to interact with Supabase backend.
 * Import this in any file that needs database or auth operations:
 * Example: import { supabase } from '../config/supabase';
 */
export const supabase = createClient(
  supabaseUrl || 'http://missing-url.com', 
  supabaseAnonKey || 'missing-key'
);