import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Not logged in: redirect to login page
  if (!user) return <Navigate to="/landing" />;

  // Access granted
  return children;
}
