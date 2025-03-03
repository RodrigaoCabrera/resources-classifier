import { useEffect, useState } from 'react';
import { User } from '@/app/types';
import { authService } from '@/app/services/authService';
import { supabase } from '@/app/db/client';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check for the current auth state
    const checkAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      checkAuth();
    });

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error, isAdmin: !!(user?.profile?.role === 'admin') };
}