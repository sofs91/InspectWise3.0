import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Configuration } from '../types';
import * as configurationsApi from '../lib/configurations';

interface ConfigurationStore {
  configurations: Configuration[];
  loading: boolean;
  error: string | null;
  fetchConfigurations: (organizationId: string) => Promise<void>;
  addConfiguration: (configuration: Omit<Configuration, 'id' | 'created_at' | 'updated_at'>) => Promise<Configuration>;
  updateConfiguration: (id: string, configuration: Partial<Omit<Configuration, 'id' | 'created_at' | 'updated_at'>>) => Promise<Configuration>;
  deleteConfiguration: (id: string, organizationId: string) => Promise<void>;
  subscribeToConfigurations: (organizationId: string) => void;
  unsubscribeFromConfigurations: () => void;
}

export const useConfigurationStore = create<ConfigurationStore>((set) => {
  let configurationSubscription: ReturnType<typeof supabase.channel> | null = null;

  return {
    configurations: [],
    loading: false,
    error: null,

    fetchConfigurations: async (organizationId: string) => {
      try {
        set({ loading: true, error: null });
        const configurations = await configurationsApi.getConfigurations(organizationId);
        set({ configurations, loading: false });
      } catch (error) {
        set({ error: 'Failed to fetch configurations', loading: false });
        console.error('Error fetching configurations:', error);
      }
    },

    addConfiguration: async (configuration) => {
      try {
        set({ error: null });
        const newConfiguration = await configurationsApi.createConfiguration(configuration);
        set((state) => ({
          configurations: [newConfiguration, ...state.configurations],
        }));
        return newConfiguration;
      } catch (error) {
        set({ error: 'Failed to create configuration' });
        console.error('Error creating configuration:', error);
        throw error;
      }
    },

    updateConfiguration: async (id, configuration) => {
      try {
        set({ error: null });
        const updatedConfiguration = await configurationsApi.updateConfiguration(id, configuration);
        set((state) => ({
          configurations: state.configurations.map((c) =>
            c.id === id ? updatedConfiguration : c
          ),
        }));
        return updatedConfiguration;
      } catch (error) {
        set({ error: 'Failed to update configuration' });
        console.error('Error updating configuration:', error);
        throw error;
      }
    },

    deleteConfiguration: async (id, organizationId) => {
      try {
        set({ error: null });
        await configurationsApi.deleteConfiguration(id, organizationId);
        set((state) => ({
          configurations: state.configurations.filter((c) => c.id !== id),
        }));
      } catch (error) {
        set({ error: 'Failed to delete configuration' });
        console.error('Error deleting configuration:', error);
        throw error;
      }
    },

    subscribeToConfigurations: (organizationId: string) => {
      if (configurationSubscription) {
        configurationSubscription.unsubscribe();
      }

      configurationSubscription = supabase
        .channel('configurations-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'configurations',
            filter: `organization_id=eq.${organizationId}`,
          },
          (payload) => {
            const newConfiguration = payload.new as Configuration;
            set((state) => ({
              configurations: [newConfiguration, ...state.configurations],
            }));
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'configurations',
            filter: `organization_id=eq.${organizationId}`,
          },
          (payload) => {
            const updatedConfiguration = payload.new as Configuration;
            set((state) => ({
              configurations: state.configurations.map((c) =>
                c.id === updatedConfiguration.id ? updatedConfiguration : c
              ),
            }));
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'configurations',
            filter: `organization_id=eq.${organizationId}`,
          },
          (payload) => {
            const deletedConfiguration = payload.old as Configuration;
            set((state) => ({
              configurations: state.configurations.filter((c) => c.id !== deletedConfiguration.id),
            }));
          }
        )
        .subscribe();
    },

    unsubscribeFromConfigurations: () => {
      if (configurationSubscription) {
        configurationSubscription.unsubscribe();
        configurationSubscription = null;
      }
    },
  };
});