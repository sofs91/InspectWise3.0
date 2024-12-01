export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          organization_id: string | null;
          role: 'admin' | 'user';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          organization_id?: string | null;
          role?: 'admin' | 'user';
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          organization_id?: string | null;
          role?: 'admin' | 'user';
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
        };
        Update: {
          name?: string;
        };
      };
    };
  };
}