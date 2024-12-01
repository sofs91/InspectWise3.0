import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createOrganization, joinOrganization } from '../lib/organizations';
import { Button } from '../components/ui/Button';

type SetupMode = 'select' | 'create' | 'join';

export function OrganizationSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = React.useState<SetupMode>('select');
  const [organizationName, setOrganizationName] = React.useState('');
  const [organizationCode, setOrganizationCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('No authenticated user found');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await createOrganization(organizationName, user.id);
      navigate('/');
    } catch (err) {
      setError('Failed to create organization');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('No authenticated user found');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await joinOrganization(organizationCode, user.id);
      navigate('/');
    } catch (err) {
      setError('Failed to join organization. Please check the code and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderModeSelection = () => (
    <div className="space-y-4">
      <Button
        onClick={() => setMode('create')}
        className="w-full"
      >
        Create New Organization
      </Button>
      <Button
        onClick={() => setMode('join')}
        variant="outline"
        className="w-full"
      >
        Join Existing Organization
      </Button>
    </div>
  );

  const renderCreateForm = () => (
    <form onSubmit={handleCreateSubmit} className="space-y-6">
      <div>
        <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
          Organization Name
        </label>
        <input
          id="organizationName"
          name="organizationName"
          type="text"
          required
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Acme Inc."
        />
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setMode('select')}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Organization'}
        </Button>
      </div>
    </form>
  );

  const renderJoinForm = () => (
    <form onSubmit={handleJoinSubmit} className="space-y-6">
      <div>
        <label htmlFor="organizationCode" className="block text-sm font-medium text-gray-700">
          Organization Code
        </label>
        <input
          id="organizationCode"
          name="organizationCode"
          type="text"
          required
          value={organizationCode}
          onChange={(e) => setOrganizationCode(e.target.value)}
          className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Enter organization code"
        />
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setMode('select')}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={loading}
        >
          {loading ? 'Joining...' : 'Join Organization'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            InspectWise
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Organization Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'select'
              ? 'Choose how you want to get started'
              : mode === 'create'
              ? 'Create a new organization'
              : 'Join an existing organization'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {mode === 'select' && renderModeSelection()}
        {mode === 'create' && renderCreateForm()}
        {mode === 'join' && renderJoinForm()}
      </div>
    </div>
  );
}