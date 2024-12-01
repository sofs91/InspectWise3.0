import React from 'react';
import type { Question } from '../../../types';
import { TextResponse } from './responses/TextResponse';
import { MultipleChoiceResponse } from './responses/MultipleChoiceResponse';
import { CheckboxResponse } from './responses/CheckboxResponse';
import { PhotoResponse } from './responses/PhotoResponse';
import { SignatureResponse } from './responses/SignatureResponse';

interface QuestionResponseProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
}

export function QuestionResponse({ question, value, onChange }: QuestionResponseProps) {
  const renderResponse = () => {
    switch (question.type) {
      case 'text':
        return (
          <TextResponse
            value={value || ''}
            onChange={onChange}
            required={question.required}
          />
        );
      case 'multipleChoice':
        return (
          <MultipleChoiceResponse
            options={question.options || []}
            value={value || ''}
            onChange={onChange}
            name={question.id}
            required={question.required}
          />
        );
      case 'checkbox':
        return (
          <CheckboxResponse
            options={question.options || []}
            value={value || []}
            onChange={onChange}
          />
        );
      case 'photo':
        return (
          <PhotoResponse
            value={value}
            onChange={onChange}
            required={question.required}
          />
        );
      case 'signature':
        return (
          <SignatureResponse
            value={value || ''}
            onChange={onChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {question.question}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderResponse()}
    </div>
  );
}