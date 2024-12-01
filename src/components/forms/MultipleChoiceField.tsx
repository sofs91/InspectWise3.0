import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useConfigurationStore } from '../../store/configurationStore';

interface MultipleChoiceFieldProps {
  options: string[];
  onChange: (options: string[]) => void;
  useSavedOptions?: boolean;
}

export function MultipleChoiceField({ 
  options, 
  onChange,
  useSavedOptions = false,
}: MultipleChoiceFieldProps) {
  const [newOption, setNewOption] = React.useState('');
  const configurations = useConfigurationStore((state) => state.configurations);

  const handleAddOption = () => {
    if (newOption.trim()) {
      onChange([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  const handleConfigurationSelect = (configId: string) => {
    const config = configurations.find((c) => c.id === configId);
    if (config) {
      onChange(config.options);
    }
  };

  if (useSavedOptions) {
    return (
      <div>
        <select
          onChange={(e) => handleConfigurationSelect(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select a configuration</option>
          {configurations.map((config) => (
            <option key={config.id} value={config.id}>
              {config.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add new option"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <Button type="button" onClick={handleAddOption} disabled={!newOption.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 rounded-md border border-gray-200 bg-gray-50 p-2"
          >
            <input
              type="radio"
              name="preview"
              className="h-4 w-4"
              disabled
            />
            <span className="flex-1">{option}</span>
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
  );
}