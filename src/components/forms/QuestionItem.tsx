import React from 'react';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import type { Question } from '../../types';
import { QuestionField } from './QuestionField';
import { Button } from '../ui/Button';

interface QuestionItemProps {
  question: Question;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChange: (question: Question) => void;
}

export function QuestionItem({
  question,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
  onChange,
}: QuestionItemProps) {
  return (
    <div className="relative bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onMoveDown}
            disabled={isLast}
            className="p-1"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500"
          title="Remove question"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <QuestionField
        question={question}
        onChange={onChange}
      />
    </div>
  );
}