import React from 'react';
import { User } from '@supabase/supabase-js';
import type { UserProfile } from '../types/auth';
import * as authService from '../lib/auth';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadUserProfile = React.useCallback(async (userId: string) => {
    try {
      const userProfile = await authService.getUserProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      setError(error as Error);
    }
  }, []);

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await authService.getCurrentSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = authService.subscribeToAuthChanges(
      async (newUser) => {
        setUser(newUser);
        if (newUser) {
          await loadUserProfile(newUser.id);
        } else {
          setProfile(null);
        }
      }
    );

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await authService.signInWithPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      await authService.signUpWithPassword(email, password, fullName);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.signOut();
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await authService.resetPasswordForEmail(email);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}