import React from 'react';
import type { Question } from '../../types';
import { CheckboxOptionsField } from './CheckboxOptionsField';
import { MultipleChoiceField } from './MultipleChoiceField';
import { PhotoUploadField } from './PhotoUploadField';
import { SignatureField } from './SignatureField';
import { useConfigurationStore } from '../../store/configurationStore';

interface QuestionFieldProps {
  question: Question;
  onChange: (question: Question) => void;
}

export function QuestionField({ question, onChange }: QuestionFieldProps) {
  const configurations = useConfigurationStore((state) => state.configurations);
  const [useSavedOptions, setUseSavedOptions] = React.useState(false);

  const handleChange = (field: keyof Question, value: any) => {
    onChange({ ...question, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Question Type</label>
        <select
          value={question.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="text">Text Input</option>
          <option value="checkbox">Checkbox</option>
          <option value="multipleChoice">Multiple Choice</option>
          <option value="photo">Photo Upload</option>
          <option value="signature">Signature</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Question Text</label>
        <input
          type="text"
          value={question.question}
          onChange={(e) => handleChange('question', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      {(question.type === 'checkbox' || question.type === 'multipleChoice') && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`required-${question.id}`}
              checked={question.required}
              onChange={(e) => handleChange('required', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor={`required-${question.id}`}
              className="ml-2 block text-sm text-gray-700"
            >
              Required field
            </label>
          </div>

          {configurations.length > 0 && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`saved-options-${question.id}`}
                checked={useSavedOptions}
                onChange={(e) => setUseSavedOptions(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`saved-options-${question.id}`}
                className="ml-2 block text-sm text-gray-700"
              >
                Use saved options
              </label>
            </div>
          )}
        </div>
      )}

      {question.type === 'checkbox' && (
        <div>
          <CheckboxOptionsField
            options={question.options || []}
            onChange={(options) => handleChange('options', options)}
            useSavedOptions={useSavedOptions}
          />
        </div>
      )}

      {question.type === 'multipleChoice' && (
        <div>
          <MultipleChoiceField
            options={question.options || []}
            onChange={(options) => handleChange('options', options)}
            useSavedOptions={useSavedOptions}
          />
        </div>
      )}

      {question.type === 'photo' && (
        <div>
          <PhotoUploadField
            onChange={(file) => console.log('Photo file:', file)}
          />
        </div>
      )}

      {question.type === 'signature' && (
        <div>
          <SignatureField
            onChange={(signature) => console.log('Signature data:', signature)}
          />
        </div>
      )}

      {!['checkbox', 'multipleChoice'].includes(question.type) && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`required-${question.id}`}
            checked={question.required}
            onChange={(e) => handleChange('required', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor={`required-${question.id}`}
            className="ml-2 block text-sm text-gray-700"
          >
            Required field
          </label>
        </div>
      )}
    </div>
  );
}