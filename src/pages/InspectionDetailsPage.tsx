import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useInspectionStore } from '../store/inspectionStore';
import { useTemplateStore } from '../store/templateStore';
import { formatDate } from '../lib/utils';
import { generatePDF } from '../lib/pdf';

export function InspectionDetailsPage() {
  const navigate = useNavigate();
  const { inspectionId } = useParams();
  const inspection = useInspectionStore((state) =>
    state.inspections.find((i) => i.id === inspectionId)
  );
  const template = useTemplateStore((state) =>
    state.templates.find((t) => t.id === inspection?.templateId)
  );

  if (!inspection || !template) {
    return <div>Inspection not found</div>;
  }

  const handleDownloadPDF = async () => {
    await generatePDF(inspection, template);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/inspections')}
          className="group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Inspections
        </Button>

        <Button onClick={handleDownloadPDF} className="space-x-2">
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Inspection Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Template: {template.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Inspector Name</h3>
            <p className="mt-1 text-lg text-gray-900">{inspection.inspectorName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="mt-1 text-lg text-gray-900">{inspection.location}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date</h3>
            <p className="mt-1 text-lg text-gray-900">{formatDate(inspection.date)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <span
              className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                inspection.status === 'complete'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {inspection.status}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-900">Responses</h2>
          {template.questions.map((question) => (
            <div key={question.id} className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {question.question}
              </h3>
              <div className="mt-2">
                {renderResponse(question, inspection.responses[question.id])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderResponse(question: any, value: any) {
  switch (question.type) {
    case 'text':
      return <p className="text-gray-900">{value || 'No response'}</p>;
    
    case 'multipleChoice':
      return <p className="text-gray-900">{value || 'No selection'}</p>;
    
    case 'checkbox':
      return (
        <ul className="list-disc list-inside text-gray-900">
          {value && value.length > 0 ? (
            value.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))
          ) : (
            <li>No selections</li>
          )}
        </ul>
      );
    
    case 'photo':
      return value ? (
        <img
          src={URL.createObjectURL(value)}
          alt="Inspection photo"
          className="max-w-md rounded-lg"
        />
      ) : (
        <p className="text-gray-500">No photo uploaded</p>
      );
    
    case 'signature':
      return value ? (
        <img
          src={value}
          alt="Signature"
          className="max-w-md border rounded-lg"
        />
      ) : (
        <p className="text-gray-500">No signature provided</p>
      );
    
    default:
      return <p className="text-gray-500">Unsupported response type</p>;
  }
}