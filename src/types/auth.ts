export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  organization_id: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}