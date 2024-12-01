import type { Organization } from './auth';

export type Question = {
  id: string;
  type: 'multipleChoice' | 'checkbox' | 'text' | 'photo' | 'signature';
  question: string;
  options?: string[];
  required: boolean;
};

export type Template = {
  id: string;
  name: string;
  organization_id: string;
  questions: Question[];
  created_at: string;
  updated_at: string;
};

export type InspectionStatus = 'complete' | 'incomplete';

export type Inspection = {
  id: string;
  template_id: string;
  organization_id: string;
  inspector_name: string;
  status: InspectionStatus;
  date: Date;
  location: string;
  responses: Record<string, any>;
};

export type Configuration = {
  id: string;
  name: string;
  organization_id: string;
  options: string[];
  created_at: string;
  updated_at: string;
};