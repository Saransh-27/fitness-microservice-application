import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useKeycloak } from "@/context/KeycloakContext";
import { LoadingScreen } from "@/components/common/LoadingScreen";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const { initialized, authenticated } = useKeycloak();
  const { user, isAuthenticated: storeAuth } = useAuthStore();

  const isAuth = authenticated || storeAuth;

  if (!initialized && !isAuth) {
    return <LoadingScreen message="Connecting to Keycloak SSO Realm..." />;
  }

  // If not authenticated, redirect to /login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // If page requires ADMIN role, verify role
  if (adminOnly && user?.role !== "ADMIN") {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
