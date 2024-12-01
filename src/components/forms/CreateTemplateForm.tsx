import React from 'react';
import { nanoid } from 'nanoid';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { QuestionList } from './QuestionList';
import { useTemplateStore } from '../../store/templateStore';
import { useAuth } from '../../contexts/AuthContext';
import type { Question, Template } from '../../types';

interface CreateTemplateFormProps {
  template?: Template;
  onSuccess?: () => void;
}

export function CreateTemplateForm({ template, onSuccess }: CreateTemplateFormProps) {
  const { profile } = useAuth();
  const [name, setName] = React.useState(template?.name || '');
  const [questions, setQuestions] = React.useState<Question[]>(
    template?.questions || []
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { addTemplate, updateTemplate } = useTemplateStore();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: nanoid(),
        type: 'text',
        question: '',
        required: false,
      },
    ]);
  };

  const handleQuestionChange = (index: number, question: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = question;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile?.organization_id) {
      setError('No organization found');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const templateData = {
        name,
        questions,
        organization_id: profile.organization_id,
      };

      if (template) {
        await updateTemplate(template.id, templateData);
      } else {
        await addTemplate(templateData);
      }

      onSuccess?.();
    } catch (err) {
      setError('Failed to save template');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Template Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Questions</h3>
        <QuestionList
          questions={questions}
          onQuestionsChange={setQuestions}
          onRemoveQuestion={handleRemoveQuestion}
          onQuestionChange={handleQuestionChange}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-gray-200 p-4 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button
            type="button"
            onClick={handleAddQuestion}
            variant="secondary"
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
          <Button type="submit" disabled={loading || questions.length === 0}>
            {loading ? 'Saving...' : template ? 'Update' : 'Create'} Template
          </Button>
        </div>
      </div>
    </form>
  );
}