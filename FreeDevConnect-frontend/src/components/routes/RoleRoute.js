import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/loader.css'; 
const RoleRoute = ({ children, role }) => {
  const { user, isAuthenticated, isInitializing, token } = useAuth();

  // Protection contre les redirections précipitées
  if (isInitializing || !user || !user.role) {
    console.log('⏳ Auth pas encore prête ou user incomplet');
    return (
      <div className="loader-centered">
        <div>Chargement...</div>
      </div>
    );
  }

  console.log('🔐 Vérification accès:', {
    isAuthenticated,
    token,
    user,
    attendu: role
  });

  if (!isAuthenticated || !token) {
    console.warn('⛔ Utilisateur non authentifié');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    console.warn(`⛔ Rôle incorrect: ${user.role} ≠ ${role}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
