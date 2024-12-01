import React from 'react';
import { nanoid } from 'nanoid';
import { X, Plus, Trash2, Pencil, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useConfigurationStore } from '../../../store/configurationStore';
import { useAuth } from '../../../contexts/AuthContext';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigurationModal({ isOpen, onClose }: ConfigurationModalProps) {
  const { profile } = useAuth();
  const {
    configurations,
    loading,
    error,
    fetchConfigurations,
    addConfiguration,
    updateConfiguration,
    deleteConfiguration,
  } = useConfigurationStore();

  const [name, setName] = React.useState('');
  const [options, setOptions] = React.useState<string[]>([]);
  const [newOption, setNewOption] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && profile?.organization_id) {
      fetchConfigurations(profile.organization_id);
    }
  }, [isOpen, profile?.organization_id]);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile?.organization_id) {
      return;
    }

    if (name && options.length > 0) {
      try {
        setSubmitting(true);
        const configuration = {
          id: editingId || nanoid(),
          name,
          options,
          organization_id: profile.organization_id,
        };

        if (editingId) {
          await updateConfiguration(editingId, configuration);
        } else {
          await addConfiguration(configuration);
        }

        setName('');
        setOptions([]);
        setNewOption('');
        setEditingId(null);
      } catch (err) {
        console.error('Error saving configuration:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEdit = (config: typeof configurations[0]) => {
    setEditingId(config.id);
    setName(config.name);
    setOptions(config.options);
  };

  const handleDelete = async (id: string) => {
    if (!profile?.organization_id) return;
    
    try {
      await deleteConfiguration(id, profile.organization_id);
    } catch (err) {
      console.error('Error deleting configuration:', err);
    }
  };

  const handleCancel = () => {
    setName('');
    setOptions([]);
    setNewOption('');
    setEditingId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6">
          <div className="absolute right-4 top-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {editingId ? 'Edit Configuration' : 'Create Configuration'}
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Configuration Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Add new option"
                />
                <Button type="button" onClick={handleAddOption} disabled={!newOption.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-2"
                  >
                    <span>{option}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={submitting || !name || options.length === 0}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingId ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>{editingId ? 'Update' : 'Save'} Configuration</>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Configurations</h3>
            {loading ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {configurations.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{config.name}</h4>
                      <p className="text-sm text-gray-500">
                        {config.options.length} options
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(config)}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(config.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {configurations.length === 0 && (
                  <p className="text-center text-gray-500">No configurations saved yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}