import { supabase } from './supabase';
import type { Configuration } from '../types';

export async function getConfigurations(organizationId: string) {
  const { data, error } = await supabase
    .from('configurations')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Configuration[];
}

export async function createConfiguration(configuration: Omit<Configuration, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('configurations')
    .insert([configuration])
    .select()
    .single();

  if (error) throw error;
  return data as Configuration;
}

export async function updateConfiguration(
  id: string,
  configuration: Partial<Omit<Configuration, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('configurations')
    .update(configuration)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Configuration;
}

export async function deleteConfiguration(id: string, organizationId: string) {
  const { error } = await supabase
    .from('configurations')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) throw error;
}