import React from 'react';
import type { Question } from '../../types';
import { QuestionItem } from './QuestionItem';

interface QuestionListProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
  onRemoveQuestion: (index: number) => void;
  onQuestionChange: (index: number, question: Question) => void;
}

export function QuestionList({
  questions,
  onQuestionsChange,
  onRemoveQuestion,
  onQuestionChange,
}: QuestionListProps) {
  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...questions];
    const [movedQuestion] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedQuestion);
    onQuestionsChange(newQuestions);
  };

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <QuestionItem
          key={question.id}
          question={question}
          index={index}
          isFirst={index === 0}
          isLast={index === questions.length - 1}
          onMoveUp={() => moveQuestion(index, index - 1)}
          onMoveDown={() => moveQuestion(index, index + 1)}
          onRemove={() => onRemoveQuestion(index)}
          onChange={(q) => onQuestionChange(index, q)}
        />
      ))}
    </div>
  );
}