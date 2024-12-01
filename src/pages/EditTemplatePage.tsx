import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CreateTemplateForm } from '../components/forms/CreateTemplateForm';
import { ConfigurationModal } from '../components/forms/configuration/ConfigurationModal';
import { useTemplateStore } from '../store/templateStore';

export function EditTemplatePage() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const template = useTemplateStore((state) =>
    state.templates.find((t) => t.id === templateId)
  );

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Templates
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsConfigOpen(true)}
          className="fixed top-4 right-4 z-10"
        >
          <Settings className="h-4 w-4 mr-2" />
          General Configurations
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Template</h1>
        <CreateTemplateForm
          template={template}
          onSuccess={() => navigate('/')}
        />
      </div>

      <ConfigurationModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </div>
  );
}