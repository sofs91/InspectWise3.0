import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { InspectorInfoFields } from './InspectorInfoFields';
import { QuestionResponse } from './QuestionResponse';
import type { Question } from '../../../types';

interface InspectionFormProps {
  templateName: string;
  questions: Question[];
  onSubmit: (data: {
    inspectorName: string;
    location: string;
    responses: Record<string, any>;
  }) => void;
}

export function InspectionForm({ templateName, questions, onSubmit }: InspectionFormProps) {
  const navigate = useNavigate();
  const [inspectorName, setInspectorName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [responses, setResponses] = React.useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ inspectorName, location, responses });
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        New Inspection: {templateName}
      </h1>

      <InspectorInfoFields
        inspectorName={inspectorName}
        location={location}
        onInspectorNameChange={setInspectorName}
        onLocationChange={setLocation}
      />

      <div className="space-y-8">
        {questions.map((question) => (
          <QuestionResponse
            key={question.id}
            question={question}
            value={responses[question.id]}
            onChange={(value) => handleResponseChange(question.id, value)}
          />
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>
        <Button type="submit">Submit Inspection</Button>
      </div>
    </form>
  );
}