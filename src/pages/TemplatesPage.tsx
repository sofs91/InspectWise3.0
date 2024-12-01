import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTemplateStore } from '../store/templateStore';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../lib/utils';

export function TemplatesPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { 
    templates, 
    loading, 
    error, 
    fetchTemplates,
    subscribeToTemplates,
    unsubscribeFromTemplates,
  } = useTemplateStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    if (profile?.organization_id) {
      fetchTemplates(profile.organization_id);
      subscribeToTemplates(profile.organization_id);
    }

    return () => {
      unsubscribeFromTemplates();
    };
  }, [profile?.organization_id]);

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <Button className="space-x-2" onClick={() => navigate('/templates/create')}>
          <Plus className="h-4 w-4" />
          <span>Create Template</span>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search templates..."
          className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Template Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTemplates.map((template) => (
              <tr key={template.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {template.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(new Date(template.created_at))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mr-2"
                    onClick={() => navigate(`/templates/${template.id}/inspect`)}
                  >
                    Start Inspection
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/templates/${template.id}/edit`)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
            {filteredTemplates.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No templates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}