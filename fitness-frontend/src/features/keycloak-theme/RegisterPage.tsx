import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useKeycloak } from "@/context/KeycloakContext";
import { toast } from "sonner";

export function RegisterPage() {
  const navigate = useNavigate();
  const { registerDirect } = useKeycloak();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [frontname, setFrontname] = useState("");
  const [lastname, setLastname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
