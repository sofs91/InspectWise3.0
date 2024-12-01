import React from 'react';

interface CheckboxResponseProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function CheckboxResponse({ options, value = [], onChange }: CheckboxResponseProps) {
  const handleChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...(value || []), option]);
    } else {
      onChange((value || []).filter((v) => v !== option));
    }
  };

  return (
    <fieldset className="space-y-2" role="group">
      <div className="space-y-2">
        {options.map((option) => {
          const id = `checkbox-${option.toLowerCase().replace(/\s+/g, '-')}`;
          
          return (
            <div key={id} className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id={id}
                  type="checkbox"
                  checked={value?.includes(option)}
                  onChange={(e) => handleChange(option, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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