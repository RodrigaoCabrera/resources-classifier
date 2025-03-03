// services/authService.js
import { supabase } from '@/app/db/client'
import { User, UserProfile } from '../types';

interface SignUpParams {
  email: string;
  password: string;
  userData?: Partial<UserProfile>;
}

interface SignInParams {
  email: string;
  password: string;
}

export const authService = {
  // Get the current logged in user
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (!session) return null;

    // Get additional user profile data
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') throw profileError;

    return {
      ...session.user,
      profile: profile as UserProfile || null
    };
  },

  // Sign up a new user
  signUp: async ({ email, password, userData = {} }: SignUpParams) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    // Create user profile if sign up was successful
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{ id: data.user.id, role: 'user', ...userData }]);

      if (profileError) throw profileError;
    }

    return data;
  },

  // Sign in an existing user
  signIn: async ({ email, password }: SignInParams) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  // Sign out the current user
  signOut: async (): Promise<boolean> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  // Check if the current user has admin role
  isAdmin: async (): Promise<boolean> => {
    const user = await authService.getCurrentUser();
    return user?.profile?.role === 'admin';
  },

  // Check if the current user has editor or admin role
  isEditorOrAdmin: async (): Promise<boolean> => {
    const user = await authService.getCurrentUser();
    return user?.profile?.role === 'admin' || user?.profile?.role === 'editor';
  }
};