import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '../components/ui/Button';
import { useTemplateStore } from '../store/templateStore';
import { useInspectionStore } from '../store/inspectionStore';
import { InspectionForm } from '../components/forms/inspection/InspectionForm';

export function StartInspectionPage() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const template = useTemplateStore((state) =>
    state.templates.find((t) => t.id === templateId)
  );
  const addInspection = useInspectionStore((state) => state.addInspection);

  if (!template) {
    return <div>Template not found</div>;
  }

  const handleSubmit = ({
    inspectorName,
    location,
    responses,
  }: {
    inspectorName: string;
    location: string;
    responses: Record<string, any>;
  }) => {
    const inspection = {
      id: nanoid(),
      templateId: template.id,
      inspectorName,
      location,
      status: 'incomplete' as const,
      date: new Date(),
      responses,
    };

    addInspection(inspection);
    navigate('/inspections');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Templates
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <InspectionForm
          templateName={template.name}
          questions={template.questions}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}