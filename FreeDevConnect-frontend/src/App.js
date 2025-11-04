import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/global.css';

// Routes protégées
import ProtectedRoute from './components/routes/ProtectedRoute';
import RoleRoute from './components/routes/RoleRoute';
import DashboardRedirect from './components/routes/DashboardRedirect';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientDashboard from './pages/ClientDashboard';
import FreelanceDashboard from './pages/FreelanceDashboard';
import ProjectPage from './pages/ProjectPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import MessagesPage from './pages/MessagesPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectsListPage from './pages/ProjectsList';
import FreelancesListPage from './pages/FreelancesListPage';

// Admin
import AdminDashboard from './components/Admin/Dashboard';
import AdminUsers from './components/Admin/AdminUsers';
import AdminProjects from './components/Admin/AdminProjects';
import AdminModeration from './components/Admin/AdminModeration';
import AdminReports from './components/Admin/AdminReports';

// Client
import ProjectForm from './components/client/ProjectForm';
import ProposalsList from './components/client/ProposalsList';
import ClientProjectsList from './components/client/ClientProjectsList';
import EditProjectForm from './components/client/EditProjectForm';

// Freelance
import ApplicationForm from './components/freelance/ApplicationForm';
import ProfileForm from './components/freelance/ProfileForm';

// Commun
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AccessibilityWidget from './components/common/AccessibilityWidget';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<DashboardRedirect />} />
                  <Route path="/projects" element={<ProjectsListPage />} />
                  <Route path="/projets" element={<ProjectsListPage />} />
                  <Route path="/freelances" element={<FreelancesListPage />} />

                  {/* Admin */}
                  <Route path="/admin/dashboard" element={
                    <RoleRoute role="admin"><AdminDashboard /></RoleRoute>
                  } />
                  <Route path="/admin/users" element={
                    <RoleRoute role="admin"><AdminUsers /></RoleRoute>
                  } />
                  <Route path="/admin/projects" element={
                    <RoleRoute role="admin"><AdminProjects /></RoleRoute>
                  } />
                  <Route path="/admin/moderation" element={
                    <RoleRoute role="admin"><AdminModeration /></RoleRoute>
                  } />
                  <Route path="/admin/reports" element={
                    <RoleRoute role="admin"><AdminReports /></RoleRoute>
                  } />

                  {/* Client */}
                  <Route path="/client/dashboard" element={
                    <RoleRoute role="client"><ClientDashboard /></RoleRoute>
                  } />
                  <Route path="/client/projects/new" element={
                    <RoleRoute role="client"><ProjectForm /></RoleRoute>
                  } />
                  <Route path="/client/projects/edit/:id" element={
                    <RoleRoute role="client"><EditProjectForm /></RoleRoute>
                  } />
                  <Route path="/client/projects" element={
                    <RoleRoute role="client"><ClientProjectsList /></RoleRoute>
                  } />
                  <Route path="/client/proposals" element={
                    <RoleRoute role="client"><ProposalsList /></RoleRoute>
                  } />
                  <Route path="/client/proposals/:projectId" element={
                    <RoleRoute role="client"><ProposalsList /></RoleRoute>
                  } />

                  {/* Freelance */}
                  <Route path="/freelance/dashboard" element={
                    <RoleRoute role="freedev"><FreelanceDashboard /></RoleRoute>
                  } />
                  <Route path="/freelance/application/:projectId" element={
                    <RoleRoute role="freedev"><ApplicationForm /></RoleRoute>
                  } />
                  <Route path="/freelance/profile/edit" element={
                    <RoleRoute role="freedev"><ProfileForm /></RoleRoute>
                  } />
                  <Route path="/freelance/profile/:id" element={
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                  } />

                  {/* Commun */}
                  <Route path="/projects/:id" element={
                    <ProtectedRoute><ProjectPage /></ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                  } />
                  <Route path="/profile/edit" element={
                    <ProtectedRoute><EditProfilePage /></ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute><MessagesPage /></ProtectedRoute>
                  } />

                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <AccessibilityWidget />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
