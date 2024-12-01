import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Template } from '../types';
import * as templatesApi from '../lib/templates';

interface TemplateStore {
  templates: Template[];
  loading: boolean;
  error: string | null;
  fetchTemplates: (organizationId: string) => Promise<void>;
  addTemplate: (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => Promise<Template>;
  updateTemplate: (id: string, template: Partial<Omit<Template, 'id' | 'created_at' | 'updated_at'>>) => Promise<Template>;
  deleteTemplate: (id: string, organizationId: string) => Promise<void>;
  subscribeToTemplates: (organizationId: string) => void;
  unsubscribeFromTemplates: () => void;
}

export const useTemplateStore = create<TemplateStore>((set, get) => {
  let templateSubscription: ReturnType<typeof supabase.channel> | null = null;

  return {
    templates: [],
    loading: false,
    error: null,

    fetchTemplates: async (organizationId: string) => {
      try {
        set({ loading: true, error: null });
        const templates = await templatesApi.getTemplates(organizationId);
        set({ templates, loading: false });
      } catch (error) {
        set({ error: 'Failed to fetch templates', loading: false });
        console.error('Error fetching templates:', error);
      }
    },

    addTemplate: async (template) => {
      try {
        set({ error: null });
        const newTemplate = await templatesApi.createTemplate(template);
        set((state) => ({
          templates: [newTemplate, ...state.templates],
        }));
        return newTemplate;
      } catch (error) {
        set({ error: 'Failed to create template' });
        console.error('Error creating template:', error);
        throw error;
      }
    },

    updateTemplate: async (id, template) => {
      try {
        set({ error: null });
        const updatedTemplate = await templatesApi.updateTemplate(id, template);
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? updatedTemplate : t
          ),
        }));
        return updatedTemplate;
      } catch (error) {
        set({ error: 'Failed to update template' });
        console.error('Error updating template:', error);
        throw error;
      }
    },

    deleteTemplate: async (id, organizationId) => {
      try {
        set({ error: null });
        await templatesApi.deleteTemplate(id, organizationId);
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        }));
      } catch (error) {
        set({ error: 'Failed to delete template' });
        console.error('Error deleting template:', error);
        throw error;
      }
    },

    subscribeToTemplates: (organizationId: string) => {
      if (templateSubscription) {
        templateSubscription.unsubscribe();
      }

      templateSubscription = supabase
        .channel('templates-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'templates',
            filter: `organization_id=eq.${organizationId}`,
          },
          (payload) => {
            const newTemplate = payload.new as Template;
            set((state) => ({
              templates: [newTemplate, ...state.templates],
            }));
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'templates',
            filter: `organization_id=eq.${organizationId}`,
          },
          (payload) => {
            const updatedTemplate = payload.new as Template;
            set((state) => ({
              templates: state.templates.map((t) =>
                t.id === updatedTemplate.id ? updatedTemplate : t
              ),
            }));
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'templates',
            filter: `organization_id=eq.${organizationId}`,
          },
          (payload) => {
            const deletedTemplate = payload.old as Template;
            set((state) => ({
              templates: state.templates.filter((t) => t.id !== deletedTemplate.id),
            }));
          }
        )
        .subscribe();
    },

    unsubscribeFromTemplates: () => {
      if (templateSubscription) {
        templateSubscription.unsubscribe();
        templateSubscription = null;
      }
    },
  };
});