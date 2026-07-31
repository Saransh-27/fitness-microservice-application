import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useKeycloak } from "@/context/KeycloakContext";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export function RegisterPage() {
  const navigate = useNavigate();
  const { authenticated, registerDirect, loginSocial } = useKeycloak();
  const { isAuthenticated: storeAuth } = useAuthStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [frontname, setFrontname] = useState("");
  const [lastname, setLastname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-redirect to /dashboard if authenticated via SSO / Social Login
  useEffect(() => {
    if (authenticated || storeAuth) {
      navigate("/dashboard", { replace: true });
    }
  }, [authenticated, storeAuth, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const success = await registerDirect({
        username,
        email,
        password,
        frontname,
        lastname,
      });

      if (success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error?.message || "Registration failed. Please try again.");
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
            Create Fit<span className="text-[#D8FC00]">Guide</span> Account
          </h1>
          <p className="text-xs text-slate-400">
            Start tracking your workout telemetry with AI recommendations
          </p>
        </div>

        {/* Clean Card Form */}
        <Card className="border-[#1E2436] bg-[#0B0E17] shadow-xl rounded-3xl p-2">
          <CardContent className="pt-6 space-y-5">
            {/* Social Authentication Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => loginSocial("google")}
                className="h-11 text-xs font-bold bg-[#05060A] border-[#1E2436] hover:bg-[#121624] text-white rounded-2xl gap-2 active:scale-95 transition-transform"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.8-1.5-1.3-3.2-1.3-5z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => loginSocial("github")}
                className="h-11 text-xs font-bold bg-[#05060A] border-[#1E2436] hover:bg-[#121624] text-white rounded-2xl gap-2 active:scale-95 transition-transform"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1E2436]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-extrabold tracking-wider">
                <span className="bg-[#0B0E17] px-3 text-slate-500">Or register with email</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-200 block mb-1">
                    First Name
                  </label>
                  <Input
                    type="text"
                    value={frontname}
                    onChange={(e) => setFrontname(e.target.value)}
                    placeholder="Alex"
                    className="h-10 text-xs rounded-xl bg-[#05060A] border-[#1E2436] text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-200 block mb-1">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Morgan"
                    className="h-10 text-xs rounded-xl bg-[#05060A] border-[#1E2436] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">
                  Username *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="alex_athlete"
                    className="pl-10 h-10 text-xs rounded-xl bg-[#05060A] border-[#1E2436] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@fitness.com"
                    className="pl-10 h-10 text-xs rounded-xl bg-[#05060A] border-[#1E2436] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 h-10 text-xs rounded-xl bg-[#05060A] border-[#1E2436] text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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
                {loading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Button>
            </form>

            <div className="text-center pt-3 border-t border-[#1E2436] text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#D8FC00] hover:underline"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
