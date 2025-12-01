/**
 * hooks/useSupabase.js
 * 
 * Custom React hook for authentication state management.
 * This hook handles:
 * - User authentication state (logged in or logged out)
 * - Auth state readiness (loading complete)
 * - Real-time auth state changes (user logs in/out in another tab)
 * 
 * Usage in components:
 * const { user, authReady, supabase } = useSupabase();
 * 
 * The hook automatically subscribes to auth changes and cleans up on unmount.
 */

import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

/**
 * useSupabase Hook
 * 
 * Returns:
 * - user: Current authenticated user object (or null if not logged in)
 * - authReady: Boolean indicating if auth check is complete (prevents flickering)
 * - supabase: Supabase client instance for database operations
 */
export const useSupabase = () => {
  // ========== STATE VARIABLES ==========
  /** Current authenticated user or null */
  const [user, setUser] = useState(null);

  /** Flag indicating whether auth initialization is complete */
  const [authReady, setAuthReady] = useState(false);

  // ========== EFFECT: AUTH STATE LISTENER ==========
  /**
   * Sets up authentication state listener on component mount.
   * This effect:
   * 1. Listens for real-time auth changes (login/logout in any tab)
   * 2. Gets the current session on mount
   * 3. Cleans up the subscription on component unmount
   */
  useEffect(() => {
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Update user state when auth event occurs
        setUser(session?.user ?? null);
        // Mark auth as ready after first check
        setAuthReady(true);
      }
    );

    // Also check current session on mount (in case already logged in)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    // Cleanup: Unsubscribe from auth changes when component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  // ========== RETURN ==========
  return { supabase, user, authReady };
};