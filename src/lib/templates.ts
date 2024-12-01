import { supabase } from './supabase';
import type { Template } from '../types';

export async function getTemplates(organizationId: string) {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Template[];
}

export async function getTemplate(id: string, organizationId: string) {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organizationId)
    .single();

  if (error) throw error;
  return data as Template;
}

export async function createTemplate(template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('templates')
    .insert([template])
    .select()
    .single();

  if (error) throw error;
  return data as Template;
}

export async function updateTemplate(
  id: string,
  template: Partial<Omit<Template, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('templates')
    .update(template)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Template;
}

export async function deleteTemplate(id: string, organizationId: string) {
  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId);

  if (error) throw error;
}