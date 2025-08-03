import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Not logged in -> redirect to login
  if (!user) return <Navigate to="/landing" />;

  // Logged in but not an admin -> redirect to home
  if (!user.roles?.includes('ROLE_ADMIN')) {
    return <Navigate to="/" />;
  }

  // Logged in as admin -> grant access
  return children;
}