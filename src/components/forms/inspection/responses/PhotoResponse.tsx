import React from 'react';

interface PhotoResponseProps {
  value: File | null;
  onChange: (value: File | null) => void;
  required: boolean;
}

export function PhotoResponse({ value, onChange, required }: PhotoResponseProps) {
  return (
    <input
      type="file"
      accept="image/*"
      required={required}
      onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  );
}