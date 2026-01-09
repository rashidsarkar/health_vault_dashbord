import { Navigate } from "react-router";
import { useAuth } from "@/providers/useAuth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, token } = useAuth();

  // Check if user is authenticated and has a valid token
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
