import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useDemoStore } from "@/store/useDemoStore";
import { useKeycloak } from "@/context/KeycloakContext";
import { LoadingScreen } from "@/components/common/LoadingScreen";

export function ProtectedRoute() {
  const { initialized, authenticated } = useKeycloak();
  const { isAuthenticated: storeAuth } = useAuthStore();
  const { isDemoMode } = useDemoStore();

  const isAuth = authenticated || storeAuth || isDemoMode;

  if (!initialized && !isAuth) {
    return <LoadingScreen message="Connecting to Keycloak SSO Realm..." />;
  }

  // If not authenticated, redirect to /login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
