import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { UserProfile } from '../types/auth';

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('❌ [auth] Error getting session:', error);
    throw error;
  }
  return session;
}

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error('❌ [auth] Sign in error:', error);
    throw error;
  }
}

export async function signUpWithPassword(email: string, password: string, fullName: string) {
  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('❌ [auth] Sign up error:', error);
    throw error;
  }

  if (!user) {
    throw new Error('No user returned after signup');
  }

  await createUserProfile({
    id: user.id,
    email,
    full_name: fullName,
    organization_id: null,
    role: 'user',
  });

  return user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('❌ [auth] Sign out error:', error);
    throw error;
  }
}

export async function resetPasswordForEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    console.error('❌ [auth] Password reset error:', error);
    throw error;
  }
}

export async function createUserProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single();

  if (error) {
    console.error('❌ [auth] Error creating user profile:', error);
    throw error;
  }

  return data;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('❌ [auth] Error getting user profile:', error);
    throw error;
  }

  return data;
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}