import React, { useState, useEffect } from "react";
import { User as UserIcon, Mail, Save, CheckCircle2, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { userService } from "@/services/userService";
import { toast } from "sonner";

export function ProfilePage() {
  const { user, setUser } = useAuthStore();

  const [frontname, setFrontname] = useState(user?.frontname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFrontname(user.frontname || "");
      setLastname(user.lastname || "");
      setEmail(user.email || "");
      setUsername(user.username || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("User ID not found.");
      return;
    }

    try {
      setSaving(true);
      const updated = await userService.updateUser(user.id, {
        frontname,
        lastname,
        email,
        username,
      });

      setUser({ ...user, ...updated });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update user profile:", error);
      toast.error("Failed to update profile. Please check backend connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 max-w-4xl mx-auto pb-8 font-['Plus_Jakarta_Sans']">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
          <UserIcon className="w-7 h-7 text-[#D8FC00]" /> User Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Manage your personal identity & account preferences
        </p>
      </div>

      {/* Profile Banner */}
      <Card className="p-6 relative overflow-hidden bg-gradient-to-r from-[#1E2BD9]/30 via-[#141A99]/20 to-[#05060A] border-[#1E2436] rounded-3xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-[#1E2BD9] text-[#D8FC00] border border-[#D8FC00]/40 flex items-center justify-center text-3xl font-black shadow-xl shrink-0">
            {user?.frontname?.[0] || user?.username?.[0] || "U"}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <h2 className="text-xl font-extrabold text-white">
              {user?.frontname ? `${user.frontname} ${user.lastname || ""}` : user?.username || "Athlete"}
            </h2>
            <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1 font-mono">
              <Mail className="w-3.5 h-3.5 text-[#D8FC00]" /> {user?.email || "No email provided"}
            </p>
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <Card className="bg-[#0B0E17] border-[#1E2436] rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-extrabold text-white">Personal Information</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Update your account details stored in the user microservice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  First Name
                </label>
                <Input
                  value={frontname}
                  onChange={(e) => setFrontname(e.target.value)}
                  placeholder="First name"
                  className="h-11 rounded-2xl bg-[#05060A] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Last Name
                </label>
                <Input
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Last name"
                  className="h-11 rounded-2xl bg-[#05060A] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00] text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Username
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="h-11 rounded-2xl bg-[#05060A] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@fitness.com"
                  className="h-11 rounded-2xl bg-[#05060A] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00] text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end border-t border-[#1E2436]">
              <Button
                type="submit"
                disabled={saving}
                className="gap-2 bg-[#D8FC00] text-[#05060A] hover:bg-[#c2e400] rounded-2xl font-extrabold shadow-lg shadow-[#D8FC00]/15 active:scale-95 transition-transform min-w-[140px] h-11 text-xs"
              >
                <Save className="w-4 h-4 stroke-[2.5]" />
                {saving ? "Saving Changes..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
