import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useKeycloak } from "@/context/KeycloakContext";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginDirect } = useKeycloak();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter your username or email.");
      return;
    }

    try {
      setLoading(true);
      const success = await loginDirect(username, password);
      if (success) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#05060A] relative font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#1E2BD9] text-[#D8FC00] flex items-center justify-center shadow-lg shadow-[#1E2BD9]/30 border border-[#1E2BD9]/50">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Fit<span className="text-[#D8FC00]">Guide</span>
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your telemetry & AI health insights
          </p>
        </div>

        {/* Clean Card Form */}
        <Card className="border-[#1E2436] bg-[#0B0E17] shadow-xl rounded-3xl p-2">
          <CardContent className="pt-6 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1.5">
                  Username or Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username or email"
                    className="pl-10 h-11 text-xs rounded-2xl bg-[#05060A] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-200">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-[#D8FC00] hover:underline font-semibold"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-11 text-xs rounded-2xl bg-[#05060A] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-xs font-extrabold gap-2 bg-[#D8FC00] text-[#05060A] hover:bg-[#c2e400] rounded-2xl shadow-lg shadow-[#D8FC00]/15 active:scale-95 transition-transform"
              >
                {loading ? "Signing in..." : "Sign In"}
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Button>
            </form>

            <div className="text-center pt-3 border-t border-[#1E2436] text-xs text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#D8FC00] hover:underline"
              >
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
