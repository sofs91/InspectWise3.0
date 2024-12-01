import React from 'react';

interface TextResponseProps {
  value: string;
  onChange: (value: string) => void;
  required: boolean;
}

export function TextResponse({ value, onChange, required }: TextResponseProps) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  );
}