import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitializing, user, token } = useAuth();

  if (isInitializing) {
    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        },
        children: 'Chargement...'
      }
    };
  }

  if (!isAuthenticated || !token || !user) {
    console.warn('⛔ Accès refusé: utilisateur non authentifié');
    return Navigate({ to: '/login', replace: true });
  }

  return children;
}
export default ProtectedRoute;