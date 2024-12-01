import React from 'react';

interface MultipleChoiceResponseProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  required: boolean;
}

export function MultipleChoiceResponse({
  options,
  value,
  onChange,
  name,
  required,
}: MultipleChoiceResponseProps) {
  return (
    <fieldset className="space-y-2" role="radiogroup">
      <div className="space-y-2">
        {options.map((option) => {
          const id = `radio-${name}-${option.toLowerCase().replace(/\s+/g, '-')}`;
          
          return (
            <div key={id} className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id={id}
                  type="radio"
                  name={`radio-group-${name}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  required={required && !value}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={id} className="text-gray-700">
                  {option}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}