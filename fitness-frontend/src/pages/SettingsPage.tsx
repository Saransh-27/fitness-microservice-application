import { useState } from "react";
import { Settings as SettingsIcon, Moon, Sun, Trash2, LogOut, ShieldAlert, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/useAuthStore";
import { useKeycloak } from "@/context/KeycloakContext";
import { userService } from "@/services/userService";
import { toast } from "sonner";

export function SettingsPage() {
  const { user, keycloakId } = useAuthStore();
  const { logout } = useKeycloak();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    const targetId = keycloakId || user?.keycloakId || user?.id || user?.username;
    if (!targetId) return;
    try {
      setDeleting(true);
      await userService.deleteUser(targetId);
      toast.success("Account permanently deleted.");
      logout();
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 max-w-4xl mx-auto pb-8 font-['Plus_Jakarta_Sans']">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-[#D8FC00]" /> Account Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Customize application theme, manage account session, and data controls
        </p>
      </div>



      {/* Session Management */}
      <Card className="bg-[#0B0E17] border-[#1E2436] rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-extrabold text-white flex items-center gap-2">
            <LogOut className="w-4 h-4 text-sky-400" /> Session Management
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Sign out of your active Keycloak authentication session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={logout}
            variant="outline"
            className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-2xl h-11 px-6 font-bold text-xs gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out of Account
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone: Delete Account */}
      <Card className="bg-[#0B0E17] border-red-500/30 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-extrabold text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Danger Zone
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Permanently delete your account data from PostgreSQL database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showDeleteConfirm ? (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
              className="bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600 hover:text-white rounded-2xl h-11 px-6 font-bold text-xs gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </Button>
          ) : (
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 space-y-3">
              <p className="text-xs font-bold text-red-300">
                Are you sure? This action cannot be undone. All your profile data will be removed.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  variant="destructive"
                  className="rounded-2xl h-10 px-5 font-bold text-xs"
                >
                  {deleting ? "Deleting..." : "Yes, Permanently Delete"}
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="ghost"
                  className="text-slate-400 hover:text-white rounded-2xl h-10 text-xs font-bold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
