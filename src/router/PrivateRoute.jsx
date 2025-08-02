import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // Not logged in: redirect to login page
  if (!user) return <Navigate to="/login" />;


  
  // Access granted
  return children;
}