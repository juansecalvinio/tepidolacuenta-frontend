import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface OwnerRouteProps {
  children: React.ReactNode;
}

export const OwnerRoute = ({ children }: OwnerRouteProps) => {
  const { isAuthenticated, isOwner } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isOwner) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
