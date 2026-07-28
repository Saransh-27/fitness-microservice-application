import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoadingScreen } from "@/components/common/LoadingScreen";

// Lazy-loaded page components for code-splitting
const DashboardPage = lazy(() =>
  import("@/features/dashboard/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  }))
);
const ActivityPage = lazy(() =>
  import("@/features/activities/ActivityPage").then((m) => ({
    default: m.ActivityPage,
  }))
);
const AIAssistantPage = lazy(() =>
  import("@/features/ai-assistant/AIAssistantPage").then((m) => ({
    default: m.AIAssistantPage,
  }))
);
const ProfilePage = lazy(() =>
  import("@/features/profile/ProfilePage").then((m) => ({
    default: m.ProfilePage,
  }))
);
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  }))
);
const AchievementsPage = lazy(() =>
  import("@/features/achievements/AchievementsPage").then((m) => ({
    default: m.AchievementsPage,
  }))
);
const AdminUsersPage = lazy(() =>
  import("@/features/admin/AdminUsersPage").then((m) => ({
    default: m.AdminUsersPage,
  }))
);

// Keycloak Custom Theme Pages
const LoginPage = lazy(() =>
  import("@/features/keycloak-theme/LoginPage").then((m) => ({
    default: m.LoginPage,
  }))
);
const RegisterPage = lazy(() =>
  import("@/features/keycloak-theme/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  }))
);
const ForgotPasswordPage = lazy(() =>
  import("@/features/keycloak-theme/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);

const { NotFoundPage, ForbiddenPage } = lazy(() =>
  import("@/pages/ErrorPages").then((m) => ({
    default: m,
  }))
) as any;

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Keycloak Theme Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/activities" element={<ActivityPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/workouts" element={<Navigate to="/activities" replace />} />
            <Route path="/meals" element={<Navigate to="/dashboard" replace />} />
            <Route path="/progress" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>

        {/* Error Fallback Routes */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
