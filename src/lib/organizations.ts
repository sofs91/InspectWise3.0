import { supabase } from './supabase';
import type { Organization } from '../types/auth';

export async function createOrganization(name: string, userId: string): Promise<Organization> {
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert([{ name }])
    .select()
    .single();

  if (orgError) {
    console.error('❌ [organizations] Error creating organization:', orgError);
    throw orgError;
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      organization_id: org.id,
      role: 'admin',
    })
    .eq('id', userId);

  if (profileError) {
    console.error('❌ [organizations] Error updating user profile:', profileError);
    throw profileError;
  }

  return org;
}

export async function joinOrganization(organizationId: string, userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({
      organization_id: organizationId,
      role: 'user',
    })
    .eq('id', userId);

  if (error) {
    console.error('❌ [organizations] Error joining organization:', error);
    throw error;
  }
}

export async function getOrganization(id: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('❌ [organizations] Error getting organization:', error);
    throw error;
  }

  return data;
}