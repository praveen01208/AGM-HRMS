import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, type UserRole } from '../store/authStore';

/**
 * Redirects to login if not authenticated.
 * Optionally checks for a specific role — redirects to '/' if role doesn't match.
 */
export function useRequireAuth(requiredRole?: UserRole) {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }
    if (requiredRole && user?.role !== requiredRole) {
      navigate(`/${user?.role}`, { replace: true });
    }
  }, [isAuthenticated, user, requiredRole, navigate]);

  return { user, isAuthenticated };
}
