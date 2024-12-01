import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OrganizationSetupPage } from './pages/OrganizationSetupPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { CreateTemplatePage } from './pages/CreateTemplatePage';
import { EditTemplatePage } from './pages/EditTemplatePage';
import { StartInspectionPage } from './pages/StartInspectionPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { InspectionDetailsPage } from './pages/InspectionDetailsPage';

console.log('🔍 [app] Starting render');

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/organization-setup"
            element={
              <ProtectedRoute requireOrganization={false}>
                <OrganizationSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <TemplatesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateTemplatePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates/:templateId/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditTemplatePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates/:templateId/inspect"
            element={
              <ProtectedRoute>
                <Layout>
                  <StartInspectionPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inspections"
            element={
              <ProtectedRoute>
                <Layout>
                  <InspectionsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inspections/:inspectionId"
            element={
              <ProtectedRoute>
                <Layout>
                  <InspectionDetailsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}