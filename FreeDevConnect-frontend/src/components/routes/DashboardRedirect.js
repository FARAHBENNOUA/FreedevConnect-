import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DashboardRedirect = () => {
  const { user, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && user) {
      const redirectMap = {
        admin: '/admin/dashboard',
        client: '/client/dashboard',
        freedev: '/freelance/dashboard',
        freelance: '/freelance/dashboard'
      };

      const target = redirectMap[user.role] || '/';
      navigate(target, { replace: true });
    }
  }, [user, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="dashboard-redirect-loading">
        <div className="spinner" />
        <p>Chargement du dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // On affiche rien ici car la redirection est gérée dans useEffect
  return null;
};

export default DashboardRedirect;
