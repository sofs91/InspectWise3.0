import React from 'react';

interface InspectorInfoFieldsProps {
  inspectorName: string;
  location: string;
  onInspectorNameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

export function InspectorInfoFields({
  inspectorName,
  location,
  onInspectorNameChange,
  onLocationChange,
}: InspectorInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Inspector Name
        </label>
        <input
          type="text"
          value={inspectorName}
          onChange={(e) => onInspectorNameChange(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}